import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { EmailView } from './components/EmailView';
import { ComposeModal } from './components/ComposeModal';
import { SearchBar } from './components/SearchBar';
import { Topbar } from './components/Topbar';
import { Email, Folder } from './types/email';

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/emails?folder=${selectedFolder}&search=${searchQuery}`);
      const data = await response.json();
      setEmails(data.emails);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/folders');
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [selectedFolder, searchQuery]);

  const handleEmailSelect = async (email: Email) => {
    setSelectedEmail(email);
    
    if (!email.read) {
      try {
        await fetch(`http://localhost:3001/api/emails/${email.id}/read`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        });
        fetchEmails();
      } catch (error) {
        console.error('Failed to mark email as read:', error);
      }
    }
  };

  const handleEmailDelete = async (emailId: string) => {
    try {
      await fetch(`http://localhost:3001/api/emails/${emailId}`, {
        method: 'DELETE',
      });
      fetchEmails();
      fetchFolders();
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error('Failed to delete email:', error);
    }
  };

  const handleEmailStar = async (emailId: string, starred: boolean) => {
    try {
      await fetch(`http://localhost:3001/api/emails/${emailId}/star`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred }),
      });
      fetchEmails();
    } catch (error) {
      console.error('Failed to star email:', error);
    }
  };

  const handleSendEmail = async (emailData: any) => {
    try {
      const formData = new FormData();
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('body', emailData.body);
      
      if (emailData.attachments) {
        emailData.attachments.forEach((file: File) => {
          formData.append('attachments', file);
        });
      }

      await fetch('http://localhost:3001/api/emails/send', {
        method: 'POST',
        body: formData,
      });
      
      setShowCompose(false);
      if (selectedFolder === 'sent') {
        fetchEmails();
      }
      fetchFolders();
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onComposeClick={() => setShowCompose(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 p-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search emails..."
            />
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            <div className="w-96 border-r border-gray-200">
              <EmailList
                emails={emails}
                selectedEmail={selectedEmail}
                onEmailSelect={handleEmailSelect}
                onEmailDelete={handleEmailDelete}
                onEmailStar={handleEmailStar}
                loading={loading}
                currentFolder={selectedFolder}
              />
            </div>
            
            <div className="flex-1">
              {selectedEmail ? (
                <EmailView
                  email={selectedEmail}
                  onDelete={() => handleEmailDelete(selectedEmail.id)}
                  onReply={() => setShowCompose(true)}
                  onStar={(starred) => handleEmailStar(selectedEmail.id, starred)}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📧</div>
                    <h3 className="text-xl font-medium mb-2">No email selected</h3>
                    <p>Select an email from the list to view its content</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
}

export default App;