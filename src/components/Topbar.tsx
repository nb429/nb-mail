import React from 'react';
import { Menu, Plus, Mail } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
  onComposeClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onComposeClick }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">MailPro</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onComposeClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Compose</span>
        </button>
        
        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
          U
        </div>
      </div>
    </div>
  );
};