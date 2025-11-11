import Url from "../models/urlModel.js";
import GoogleIndexingService from '../services/googleIndexingService.js';

export const submitUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user._id;

    console.log('🔍 DEBUG - Submit URL Request:', {
      url,
      userId,
      body: req.body,
      headers: req.headers
    });

    if (!url) {
      console.log('❌ DEBUG - URL missing in request');
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        console.log('❌ DEBUG - Invalid URL protocol:', url);
        return res.status(400).json({
          success: false,
          message: "URL must start with http:// or https://"
        });
      }
    } catch (error) {
      console.log('❌ DEBUG - URL validation failed:', error.message);
      return res.status(400).json({
        success: false,
        message: "Invalid URL format"
      });
    }

    // Check for duplicate submission
    const recentSubmission = await Url.findOne({
      userId,
      url,
      submittedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentSubmission) {
      console.log('❌ DEBUG - Duplicate submission:', url);
      return res.status(400).json({
        success: false,
        message: "This URL was already submitted in last 24 hours"
      });
    }

    console.log('✅ DEBUG - Creating new URL submission');
    
    // Create URL submission record
    const newUrl = new Url({
      userId,
      url,
      status: 'processing'
    });

    await newUrl.save();
    console.log('✅ DEBUG - URL saved to database:', newUrl._id);

    // Simulated Google Indexing
    const indexingResult = await GoogleIndexingService.submitUrlForIndexing(url);

    if (indexingResult.success) {
      newUrl.status = 'indexed';
      newUrl.indexedAt = new Date();
      newUrl.googleResponse = indexingResult.data;
      newUrl.googleIndexed = true;
      await newUrl.save();

      console.log('✅ DEBUG - URL indexed successfully');

      res.status(200).json({
        success: true,
        message: "✅ URL submitted successfully!",
        data: {
          id: newUrl._id,
          url: newUrl.url,
          status: newUrl.status,
          indexedAt: newUrl.indexedAt
        }
      });

    } else {
      newUrl.status = 'failed';
      newUrl.errorMessage = indexingResult.error;
      await newUrl.save();

      console.log('❌ DEBUG - Indexing failed:', indexingResult.error);

      res.status(400).json({
        success: false,
        message: indexingResult.message,
        error: indexingResult.error
      });
    }

  } catch (error) {
    console.error('❌ DEBUG - URL submission error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// ... rest of the code remains same

// In controllers/urlController.js
export const checkIndexingStatus = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user._id;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format"
      });
    }

    // Simulate Google Indexing API check
    // For now, using mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const statuses = ['INDEXED', 'NOT_INDEXED', 'PENDING', 'FAILED'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const isIndexed = url.includes('example.com') || Math.random() > 0.5;
    const status = isIndexed ? 'INDEXED' : randomStatus;

    // Update or create URL record
    const urlRecord = await Url.findOneAndUpdate(
      { userId, url },
      {
        googleIndexed: status === 'INDEXED',
        lastChecked: new Date(),
        googleStatus: status
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: {
        url,
        indexed: status === 'INDEXED',
        status: status,
        lastChecked: new Date(),
        note: "Simulated data - Connect to Google API for real results"
      }
    });

  } catch (error) {
    console.error('Indexing status check error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get URL history
export const getUrlHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const urls = await Url.find({ userId }).sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: urls,
      count: urls.length,
      note: "FREE Service - Unlimited Submissions"
    });

  } catch (error) {
    console.error('Get URL history error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch URL history"
    });
  }
};

// Get user submission stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalSubmitted = await Url.countDocuments({ userId });
    const totalIndexed = await Url.countDocuments({ userId, status: 'indexed' });
    const todaySubmissions = await Url.countDocuments({
      userId,
      submittedAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    res.json({
      success: true,
      data: {
        totalSubmitted,
        totalIndexed,
        todaySubmissions,
        successRate: totalSubmitted > 0 ? ((totalIndexed / totalSubmitted) * 100).toFixed(2) : 0,
        plan: "FREE Forever",
        limits: "Unlimited submissions",
        note: "Using simulated indexing - Add Google API for real results"
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stats"
    });
  }
};

// In controllers/urlController.js
export const submitUrlBatch = async (req, res) => {
  try {
    const { urls, dripMode = false } = req.body;
    const userId = req.user._id;

    console.log('🔍 DEBUG - Submit URL Batch Request:', {
      urlCount: urls?.length,
      userId,
      dripMode
    });

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "URLs array is required"
      });
    }

    if (urls.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Maximum 500 URLs allowed per submission"
      });
    }

    // Validate all URLs
    const validUrls = [];
    const invalidUrls = [];

    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        if (['http:', 'https:'].includes(urlObj.protocol)) {
          validUrls.push(url);
        } else {
          invalidUrls.push(url);
        }
      } catch (error) {
        invalidUrls.push(url);
      }
    }

    if (invalidUrls.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid URLs found: ${invalidUrls.slice(0, 5).join(', ')}${invalidUrls.length > 5 ? '...' : ''}`,
        invalidUrls
      });
    }

    // Check for duplicate submissions in last 24 hours
    const recentSubmissions = await Url.find({
      userId,
      url: { $in: urls },
      submittedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const recentUrls = recentSubmissions.map(sub => sub.url);
    const newUrls = urls.filter(url => !recentUrls.includes(url));

    if (newUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All URLs were already submitted in the last 24 hours"
      });
    }

    if (newUrls.length < urls.length) {
      console.log(`⚠️ Filtered out ${urls.length - newUrls.length} duplicate URLs`);
    }

    // Process URLs
    const results = [];
    const processedUrls = [];

    for (const url of newUrls) {
      try {
        // Create URL submission record
        const newUrl = new Url({
          userId,
          url,
          status: 'processing',
          batchSubmission: true,
          dripMode
        });

        await newUrl.save();

        // Submit to Google Indexing
        const indexingResult = await GoogleIndexingService.submitUrlForIndexing(url);

        if (indexingResult.success) {
          newUrl.status = 'indexed';
          newUrl.indexedAt = new Date();
          newUrl.googleResponse = indexingResult.data;
          newUrl.googleIndexed = true;
          await newUrl.save();

          results.push({
            url,
            status: 'success',
            message: 'URL submitted successfully'
          });
        } else {
          newUrl.status = 'failed';
          newUrl.errorMessage = indexingResult.error;
          await newUrl.save();

          results.push({
            url,
            status: 'error',
            message: indexingResult.message
          });
        }

        processedUrls.push(url);

        // If drip mode is enabled, add delay between submissions
        if (dripMode && newUrls.indexOf(url) < newUrls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }

      } catch (error) {
        console.error(`❌ Error processing URL ${url}:`, error);
        results.push({
          url,
          status: 'error',
          message: 'Processing failed'
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    res.status(200).json({
      success: true,
      message: `✅ ${successCount} URLs submitted successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      data: {
        total: urls.length,
        processed: processedUrls.length,
        success: successCount,
        failed: errorCount,
        duplicates: urls.length - newUrls.length,
        results
      }
    });

  } catch (error) {
    console.error('❌ DEBUG - URL batch submission error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};