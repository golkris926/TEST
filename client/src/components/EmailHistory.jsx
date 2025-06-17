// components/EmailHistory.jsx
import React from 'react';

const EmailHistory = ({ emails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Email History</h2>
      
      {emails.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <p className="text-gray-500">No emails sent yet</p>
          <p className="text-sm text-gray-400 mt-1">Your email history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {emails.map((email) => (
            <div key={email.id || email.messageId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">To:</span>
                    <span className="text-sm text-blue-600">{email.to}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {truncateText(email.subject, 40)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {truncateText(email.message, 80)}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    email.status === 'sent' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {email.status || 'sent'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(email.sentAt)}
                  </span>
                </div>
              </div>
              
              {email.messageId && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    ID: {email.messageId.substring(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {emails.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing {emails.length} recent email{emails.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailHistory;