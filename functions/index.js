const {onDocumentCreated} = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Use environment variable for API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Simple PDF content as base64
const simplePdfBase64 = 'JVBERi0xLjMKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9SZXNvdXJjZXMgMiAwIFIKL01lZGlhQm94IFswIDAgNTk1LjI4IDg0MS44OV0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgo1MCA3NTAgVGQKKFdlbGNvbWUgdG8gWmVzdCBXZWxsISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovTmFtZSAvRjEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHRdCi9Gb250IDw8IC9GMSA1IDAgUiA+Pgo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzMgMCBSXQo+PgplbmRvYmoKNiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDI5MyAwMDAwMCBuIAowMDAwMDAwMjQ2IDAwMDAwIG4gCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDEyNCAwMDAwMCBuIAowMDAwMDAwMjE3IDAwMDAwIG4gCjAwMDAwMDAzNTAgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDYgMCBSCj4+CnN0YXJ0eHJlZgo0MDAKJSVFT0Y=';

// Cloud Function: Send welcome email when new user registers
exports.sendWelcomeEmail = onDocumentCreated('users/{userId}', async (event) => {
  try {
    const userData = event.data.data();
      const userEmail = userData.email;
      const firstName = userData.firstName || 'User';
      
      console.log(`Sending welcome email to: ${userEmail}`);

      const msg = {
        to: userEmail,
        from: 'archiebwallis@gmail.com', // Your verified sender email
        subject: 'Welcome to Zest Well!',
        text: `Hi ${firstName}!\n\nWelcome to Zest Well! We're excited to help you on your health journey.\n\nYou can now access our platform to find health services, connect with community support, and access valuable health resources.\n\nThank you for joining us!\n\nThe Zest Well Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #007bff;">Welcome to Zest Well!</h1>
            <p>Hi ${firstName}!</p>
            <p>We're excited to help you on your health journey.</p>
            <p>You can now access our platform to:</p>
            <ul>
              <li>Find health services near you</li>
              <li>Connect with community support groups</li>
              <li>Access valuable health resources</li>
              <li>Rate and review health clinics</li>
            </ul>
            <p>Thank you for joining us!</p>
            <p style="margin-top: 30px;">
              <strong>The Zest Well Team</strong>
            </p>
          </div>
        `,
        attachments: [
          {
            content: simplePdfBase64,
            filename: 'welcome-guide.pdf',
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      };

      await sgMail.send(msg);
      console.log(`Welcome email sent successfully to ${userEmail}`);
      
      return null;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      
      if (error.response) {
        console.error('SendGrid response error:', error.response.body);
      }
      
      return null;
    }
  });
