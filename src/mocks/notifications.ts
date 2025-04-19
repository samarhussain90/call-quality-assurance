export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Campaign Completed",
    message: "Debt Collection Q1 has been completed successfully.",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "New Call Record",
    message: "A new call has been recorded in Customer Service Q1.",
    time: "3 hours ago",
  },
  {
    id: "3",
    title: "System Alert",
    message: "High call volume detected in Sales Outreach Q1.",
    time: "5 hours ago",
  },
]; 