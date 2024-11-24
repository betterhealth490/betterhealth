export interface InboxItem {
    profileImageUrl: string;
    firstName: string;
    lastName: string;
    latestMessage: {
      text: string;
      time: Date;
    };
    email: string;
    recievedMessages: string[];
    sentMessages: string[];
    unreadMessages: number;
    id: number;
}