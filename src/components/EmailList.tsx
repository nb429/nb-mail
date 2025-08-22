import React from 'react';
import { Email } from '../types/email';
import { Star, Trash2, Archive } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  onEmailDelete: (emailId: string) => void;
  onEmailStar: (emailId: string, starred: boolean) => void;
  loading: boolean;
  currentFolder: string;
}

export const EmailList: React.FC<EmailListProps> = ({ 
  emails, 
  selectedEmail, 
  onEmailSelect, 
  onEmailDelete,
  onEmailStar,
  loading,
  currentFolder 
}) => {
  if (loading) {
    return (
      <div className="h-full">
        {/* Loading skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-medium mb-2">No emails</h3>
          <p className="text-sm">This folder is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {emails.map((email) => {
        const isSelected = selectedEmail?.id === email.id;
        
        return (
          <div
            key={email.id}
            onClick={() => onEmailSelect(email)}
            className={`
              p-4 border-b border-gray-200 cursor-pointer transition-colors relative group
              ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
              ${!email.read ? 'bg-blue-25' : ''}
            `}
          >
            <div className="flex items-start space-x-3">
              {/* Unread indicator */}
              {!email.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium truncate ${!email.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {currentFolder === 'sent' ? email.to : email.from}
                    </span>
                    {email.attachments.length > 0 && (
                      <div className="w-4 h-4 text-gray-400">📎</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(new Date(email.timestamp))}
                  </span>
                </div>
                
                <h3 className={`text-sm truncate mb-1 ${!email.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {email.subject}
                </h3>
                
                <p className="text-xs text-gray-600 truncate">
                  {email.body.split('\n')[0]}
                </p>
              </div>
            </div>
            
            {/* Action buttons - show on hover */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-sm border p-1 flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEmailStar(email.id, !email.starred);
                }}
                className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                  email.starred ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                <Star className="h-3 w-3" fill={email.starred ? 'currentColor' : 'none'} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEmailDelete(email.id);
                }}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};