import express from 'express';
const router = express.Router();

// Temporary storage for URLs (in production, use database)
let urlHistory = [];

// ✅ Submit URLs route
router.post('/submit-batch', async (req, res) => {
  try {
    const { urls, dripMode } = req.body;
    
    console.log('📤 URL submission:', { urlsCount: urls?.length, dripMode });
    
    // Store URLs in history
    const urlEntries = urls.map(url => ({
      id: Date.now() + Math.random(),
      url: url,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    }));
    
    urlHistory.push(...urlEntries);
    
    res.json({
      success: true,
      message: 'URLs submitted successfully!',
      processedCount: urls?.length || 0,
      data: urlEntries
    });

  } catch (error) {
    console.error('🚨 URL submission error:', error);
    res.status(500).json({
      success: false,
      message: 'URL submission failed'
    });
  }
});

// ✅ Get URL history
router.get('/history', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'URL history retrieved',
      data: urlHistory
    });
  } catch (error) {
    console.error('🚨 History error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get history'
    });
  }
});

// ✅ Get URL stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalUrls: urlHistory.length,
      indexed: urlHistory.filter(url => url.status === 'indexed').length,
      pending: urlHistory.filter(url => url.status === 'submitted').length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('🚨 Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats'
    });
  }
});

export default router;