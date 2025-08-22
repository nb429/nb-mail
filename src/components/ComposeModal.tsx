import React, { useState } from 'react';
import { X, Send, Paperclip, Bold, Italic, Underline } from 'lucide-react';

interface ComposeModalProps {
  onClose: () => void;
  onSend: (email: any) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({ onClose, onSend }) => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!to || !subject) return;
    
    onSend({
      to,
      cc,
      bcc,
      subject,
      body,
      attachments,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Compose Email</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Email fields */}
        <div className="border-b border-gray-200 p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <label className="w-12 text-sm font-medium text-gray-700">To:</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="recipient@example.com"
            />
            <div className="flex space-x-2">
              {!showCc && (
                <button
                  onClick={() => setShowCc(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  onClick={() => setShowBcc(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>
          
          {showCc && (
            <div className="flex items-center space-x-3">
              <label className="w-12 text-sm font-medium text-gray-700">Cc:</label>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="cc@example.com"
              />
            </div>
          )}
          
          {showBcc && (
            <div className="flex items-center space-x-3">
              <label className="w-12 text-sm font-medium text-gray-700">Bcc:</label>
              <input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="bcc@example.com"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <label className="w-12 text-sm font-medium text-gray-700">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email subject"
            />
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
              <Bold className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
              <Italic className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
              <Underline className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <label className="p-2 hover:bg-gray-100 rounded text-gray-600 cursor-pointer">
              <Paperclip className="h-4 w-4" />
              <input
                type="file"
                multiple
                onChange={handleAttachmentChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h3>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="inline-flex items-center bg-gray-100 rounded-lg px-3 py-1">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="ml-2 text-gray-400 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Email body */}
        <div className="flex-1 p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-full resize-none border-none focus:outline-none text-gray-800"
            placeholder="Write your email here..."
          />
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {body.length} characters
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!to || !subject}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};