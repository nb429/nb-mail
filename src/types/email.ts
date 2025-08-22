export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  folder: string;
  starred: boolean;
  attachments: string[];
}

export interface Folder {
  id: string;
  name: string;
  count: number;
  icon: string;
}