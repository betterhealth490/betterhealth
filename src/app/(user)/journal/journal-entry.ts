export interface JournalEntry {
  id: number;
  author: JournalUser;
  title: string;
  date: Date;
  text: string;
  shared: JournalUser[];
}

export interface JournalUser {
  id: number;
  name: string;
}
