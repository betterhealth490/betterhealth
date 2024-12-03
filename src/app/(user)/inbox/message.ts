export interface Message {
  id: number;
  recipient: User;
  sender: User;
  read: boolean;
  date: Date;
  text: string;
}

interface User {
  id: number;
  name: string;
}
