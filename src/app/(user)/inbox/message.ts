export interface Message {
  id: number;
  name: string;
  subject: string;
  read: boolean;
  email: string;
  date: Date;
  text: string;
}

export const mockMessages: Message[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    date: new Date("2021-09-01"),
    subject: "Hello",
    text: "Hello, how are you?",
    read: false,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    date: new Date("2021-09-02"),
    subject: "Project Update",
    text: "Just wanted to give you a quick update on the project progress. We've completed the initial phase and are moving forward with the next steps. Let me know if you need any clarification.",
    read: false,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    date: new Date("2021-09-03"),
    subject: "Meeting Tomorrow",
    text: "Hi there! Just a reminder about our team meeting tomorrow at 10 AM. Please come prepared with your weekly updates. We'll be discussing the roadmap for Q4.",
    read: false,
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@company.com",
    date: new Date("2021-09-04"),
    subject: "Design Review",
    text: "I've attached the latest design mockups for your review. The client has requested some minor adjustments to the color scheme. Could you take a look and provide your feedback by EOD?",
    read: true,
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex.chen@company.com",
    date: new Date("2021-09-05"),
    subject: "Budget Review Q3",
    text: "Please find attached the Q3 budget report for your department. We need to discuss some adjustments to align with our yearly targets. There are a few areas where we've exceeded our projections.",
    read: true,
  },
  {
    id: 6,
    name: "Emily Brown",
    email: "emily.brown@company.com",
    date: new Date("2021-09-06"),
    subject: "New Client Onboarding",
    text: "We've just signed the contract with TechCorp. I've prepared the initial onboarding documents and timeline. Can you review them before I send them to the client? We should schedule a kick-off meeting next week.",
    read: true,
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david.wilson@company.com",
    date: new Date("2021-09-07"),
    subject: "Team Building Event",
    text: "Hi team! I'm organizing a team building event for next month. Please fill out the survey I'll be sending later today with your preferences for activities and dietary requirements. Looking forward to spending some quality time together!",
    read: true,
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    date: new Date("2021-09-08"),
    subject: "API Documentation Update",
    text: "I've updated the API documentation with the new endpoints we discussed in last week's meeting. Please review the changes when you have a chance. Pay special attention to the authentication section as there have been significant updates.",
    read: true,
  },
];
