// App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailForm from './components/EmailForm';
import EmailHistory from './components/EmailHistory';
import StatusMessage from './components/StatusMessage';
import { sendEmail, getEmailHistory } from './services/api';

function App() {
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmailHistory();
  }, []);

  const fetchEmailHistory = async () => {
    try {
      const data = await getEmailHistory();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Failed to fetch email history:', error);
      setEmails([]);
    }
  };

  const handleSendEmail = async (emailData) => {
    setLoading(true);
    setStatus({ type: '', message: '' }); // Clear previous status
    
    try {
      await sendEmail(emailData);
      setStatus({ type: 'success', message: 'Email sent successfully!' });
      fetchEmailHistory(); // Refresh history
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
      
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || error.message || 'Failed to send email' 
      });
      
      // Clear error status after 8 seconds
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 8000);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <EmailForm onSendEmail={handleSendEmail} loading={loading} />
            {status.message && (
              <div className="mt-4">
                <StatusMessage type={status.type} message={status.message} />
              </div>
            )}
          </div>
          <div>
            <EmailHistory emails={emails} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;