import { google } from 'googleapis';
import path from 'path';

class GoogleIndexingService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'service-account-key.json'),
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    
    this.indexing = google.indexing({
      version: 'v3',
      auth: this.auth
    });
  }

  // Submit URL to Google Indexing API
  async submitUrlForIndexing(url) {
    try {
      console.log('🚀 Submitting to Google Indexing API:', url);

      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED' // or 'URL_DELETED'
        }
      });

      console.log('✅ Google Indexing Response:', response.data);

      return {
        success: true,
        data: response.data,
        message: 'URL successfully submitted to Google Indexing API',
        notificationUrl: response.data.urlNotificationMetadata.url,
        latestUpdate: response.data.urlNotificationMetadata.latestUpdate
      };

    } catch (error) {
      console.error('❌ Google Indexing API Error:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to submit URL to Google Indexing API'
      };
    }
  }

  // Get indexing status
  async getIndexingStatus(url) {
    try {
      const response = await this.indexing.urlNotifications.getMetadata({
        url: url
      });

      return {
        success: true,
        data: response.data,
        status: response.data.urlNotificationMetadata.latestUpdate ? 'INDEXED' : 'PENDING'
      };

    } catch (error) {
      console.error('Google Status Check Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new GoogleIndexingService();