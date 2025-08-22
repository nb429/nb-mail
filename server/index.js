import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Mock data - In production, this would come from MongoDB
let emails = [
  {
    id: '1',
    from: 'john.doe@company.com',
    to: 'you@company.com',
    subject: 'Project Update - Q4 Results',
    body: 'Hi team,\n\nI wanted to share the latest updates on our Q4 project results. We\'ve exceeded our targets by 15% and received excellent feedback from stakeholders.\n\nKey achievements:\n- Completed all deliverables on time\n- Budget came in 8% under projected costs\n- Client satisfaction score: 9.2/10\n\nLet\'s schedule a team meeting next week to discuss next steps.\n\nBest regards,\nJohn',
    timestamp: new Date('2025-01-20T09:30:00'),
    read: false,
    folder: 'inbox',
    starred: true,
    attachments: []
  },
  {
    id: '2',
    from: 'sarah.wilson@marketing.com',
    to: 'you@company.com',
    subject: 'New Marketing Campaign Proposal',
    body: 'Hello,\n\nI\'ve prepared a comprehensive marketing campaign proposal for our upcoming product launch. The strategy focuses on digital channels with a multi-platform approach.\n\nHighlights include:\n- Social media advertising across 4 platforms\n- Influencer partnerships\n- Content marketing strategy\n- Email automation sequences\n\nI\'ve attached the detailed proposal document. Please review and let me know your thoughts.\n\nThanks,\nSarah',
    timestamp: new Date('2025-01-20T08:15:00'),
    read: false,
    folder: 'inbox',
    starred: false,
    attachments: ['campaign-proposal.pdf']
  },
  {
    id: '3',
    from: 'noreply@bank.com',
    to: 'you@company.com',
    subject: 'Monthly Statement Available',
    body: 'Dear Valued Customer,\n\nYour monthly statement for January 2025 is now available in your online banking portal.\n\nAccount Summary:\n- Previous balance: $5,247.83\n- Total deposits: $3,200.00\n- Total withdrawals: $1,876.45\n- Current balance: $6,571.38\n\nFor detailed transaction history, please log in to your account.\n\nThank you for banking with us.\n\nBest regards,\nFirst National Bank',
    timestamp: new Date('2025-01-19T16:45:00'),
    read: true,
    folder: 'inbox',
    starred: false,
    attachments: []
  },
  {
    id: '4',
    from: 'you@company.com',
    to: 'client@business.com',
    subject: 'Meeting Confirmation - Tomorrow 2 PM',
    body: 'Dear Client,\n\nThis is to confirm our meeting scheduled for tomorrow (January 21st) at 2:00 PM.\n\nAgenda:\n- Project timeline review\n- Budget discussion\n- Next phase planning\n\nMeeting will be held in Conference Room A. Please let me know if you need to reschedule.\n\nLooking forward to our discussion.\n\nBest regards,\nYour Name',
    timestamp: new Date('2025-01-20T14:20:00'),
    read: true,
    folder: 'sent',
    starred: false,
    attachments: []
  }
];

let folders = [
  { id: 'inbox', name: 'Inbox', count: 3, icon: 'inbox' },
  { id: 'sent', name: 'Sent', count: 1, icon: 'send' },
  { id: 'drafts', name: 'Drafts', count: 0, icon: 'file-text' },
  { id: 'spam', name: 'Spam', count: 0, icon: 'shield' },
  { id: 'trash', name: 'Trash', count: 0, icon: 'trash-2' }
];

// API Routes

// Get emails
app.get('/api/emails', (req, res) => {
  const { folder = 'inbox', search, limit = 50, offset = 0 } = req.query;
  
  let filteredEmails = emails.filter(email => email.folder === folder);
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredEmails = filteredEmails.filter(email => 
      email.subject.toLowerCase().includes(searchTerm) ||
      email.from.toLowerCase().includes(searchTerm) ||
      email.body.toLowerCase().includes(searchTerm)
    );
  }
  
  filteredEmails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const paginatedEmails = filteredEmails.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    emails: paginatedEmails,
    total: filteredEmails.length,
    hasMore: filteredEmails.length > parseInt(offset) + parseInt(limit)
  });
});

// Get specific email
app.get('/api/emails/:id', (req, res) => {
  const email = emails.find(e => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: 'Email not found' });
  }
  res.json(email);
});

// Send email
app.post('/api/emails/send', upload.array('attachments'), (req, res) => {
  const { to, subject, body } = req.body;
  const attachments = req.files ? req.files.map(file => file.filename) : [];
  
  const newEmail = {
    id: Date.now().toString(),
    from: 'you@company.com',
    to,
    subject,
    body,
    timestamp: new Date(),
    read: true,
    folder: 'sent',
    starred: false,
    attachments
  };
  
  emails.push(newEmail);
  
  // Update folder counts
  const sentFolder = folders.find(f => f.id === 'sent');
  if (sentFolder) sentFolder.count++;
  
  res.json({ message: 'Email sent successfully', email: newEmail });
});

// Mark email as read/unread
app.patch('/api/emails/:id/read', (req, res) => {
  const { read } = req.body;
  const email = emails.find(e => e.id === req.params.id);
  
  if (!email) {
    return res.status(404).json({ error: 'Email not found' });
  }
  
  email.read = read;
  res.json(email);
});

// Star/unstar email
app.patch('/api/emails/:id/star', (req, res) => {
  const { starred } = req.body;
  const email = emails.find(e => e.id === req.params.id);
  
  if (!email) {
    return res.status(404).json({ error: 'Email not found' });
  }
  
  email.starred = starred;
  res.json(email);
});

// Move email to folder
app.patch('/api/emails/:id/move', (req, res) => {
  const { folder } = req.body;
  const email = emails.find(e => e.id === req.params.id);
  
  if (!email) {
    return res.status(404).json({ error: 'Email not found' });
  }
  
  // Update folder counts
  const oldFolder = folders.find(f => f.id === email.folder);
  const newFolder = folders.find(f => f.id === folder);
  
  if (oldFolder) oldFolder.count = Math.max(0, oldFolder.count - 1);
  if (newFolder) newFolder.count++;
  
  email.folder = folder;
  res.json(email);
});

// Delete email
app.delete('/api/emails/:id', (req, res) => {
  const emailIndex = emails.findIndex(e => e.id === req.params.id);
  
  if (emailIndex === -1) {
    return res.status(404).json({ error: 'Email not found' });
  }
  
  const email = emails[emailIndex];
  
  if (email.folder === 'trash') {
    // Permanently delete
    emails.splice(emailIndex, 1);
  } else {
    // Move to trash
    const oldFolder = folders.find(f => f.id === email.folder);
    const trashFolder = folders.find(f => f.id === 'trash');
    
    if (oldFolder) oldFolder.count = Math.max(0, oldFolder.count - 1);
    if (trashFolder) trashFolder.count++;
    
    email.folder = 'trash';
  }
  
  res.json({ message: 'Email deleted successfully' });
});

// Get folders
app.get('/api/folders', (req, res) => {
  res.json(folders);
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});