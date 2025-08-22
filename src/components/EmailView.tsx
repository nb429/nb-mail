import React from 'react';
import { Email } from '../types/email';
import { Reply, ReplyAll, Forward, Star, Trash2, Archive, MoreHorizontal } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface EmailViewProps {
  email: Email;
  onDelete: () => void;
  onReply: () => void;
  onStar: (starred: boolean) => void;
}

export const EmailView: React.FC<EmailViewProps> = ({ email, onDelete, onReply, onStar }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">{email.subject}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">From:</span> {email.from}
              </div>
              <div>
                <span className="font-medium">To:</span> {email.to}
              </div>
              <div>
                {formatDate(new Date(email.timestamp), true)}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStar(!email.starred)}
              className={`p-2 rounded-lg transition-colors ${
                email.starred 
                  ? 'text-yellow-500 hover:bg-yellow-50' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <Star className="h-5 w-5" fill={email.starred ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={onReply}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Reply"
            >
              <Reply className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Reply All">
              <ReplyAll className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Forward">
              <Forward className="h-5 w-5" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Archive">
              <Archive className="h-5 w-5" />
            </button>
            
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Attachments ({email.attachments.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <span>📎</span>
                  <span className="ml-1">{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Email body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {email.body}
          </div>
        </div>
      </div>
      
      {/* Quick reply actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onReply}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
            
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <ReplyAll className="h-4 w-4" />
              <span>Reply All</span>
            </button>
            
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Forward className="h-4 w-4" />
              <span>Forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};