export type NeartermTheme = "light" | "dark";

export const reminders = [
  "Review Signal draft",
  "Book dentist appointment",
  "Order dog food",
  "Send print files",
  "Water the patio plants",
] as const;

export const events = [
  { title: "Design critique", time: "10:30 AM", video: true },
  { title: "Lunch with Tom", time: "12:00 PM", video: false },
  { title: "School pickup", time: "3:15 PM", video: false },
] as const;

export const limits = {
  reminders: reminders.length,
  events: events.length,
} as const;
