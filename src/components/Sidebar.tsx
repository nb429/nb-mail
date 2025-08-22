import React from 'react';
import { Folder } from '../types/email';
import { 
  Inbox, 
  Send, 
  FileText, 
  Shield, 
  Trash2, 
  X 
} from 'lucide-react';

interface SidebarProps {
  folders: Folder[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const iconMap = {
  inbox: Inbox,
  send: Send,
  'file-text': FileText,
  shield: Shield,
  'trash-2': Trash2,
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  folders, 
  selectedFolder, 
  onFolderSelect, 
  isOpen, 
  onClose 
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          {/* Folders */}
          <div className="flex-1 px-4 py-2">
            <nav className="space-y-1">
              {folders.map((folder) => {
                const IconComponent = iconMap[folder.icon as keyof typeof iconMap] || Inbox;
                const isSelected = selectedFolder === folder.id;
                
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onFolderSelect(folder.id);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors
                      ${isSelected 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="font-medium">{folder.name}</span>
                    </div>
                    
                    {folder.count > 0 && (
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${isSelected 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}>
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>Storage: 2.1 GB / 15 GB</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};