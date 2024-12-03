export interface Message {
  id: number;
  recipient: InboxUser;
  sender: InboxUser;
  read: boolean;
  date: Date;
  text: string;
}

export interface InboxUser {
  id: number;
  name: string;
}
