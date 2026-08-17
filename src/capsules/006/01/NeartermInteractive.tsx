import { useState } from "react";
import { NeartermView } from "./NeartermView";
import type { NeartermTheme } from "./model";

export function NeartermInteractive() {
  const [theme, setTheme] = useState<NeartermTheme>("dark");
  const [reminderCount, setReminderCount] = useState(3);
  const [eventCount, setEventCount] = useState(2);
  const [completedReminders, setCompletedReminders] = useState<number[]>([]);

  return (
    <NeartermView
      theme={theme}
      reminderCount={reminderCount}
      eventCount={eventCount}
      completedReminders={completedReminders}
      interactive
      onThemeChange={setTheme}
      onReminderCountChange={setReminderCount}
      onEventCountChange={setEventCount}
      onToggleReminder={(index) => {
        setCompletedReminders((current) =>
          current.includes(index)
            ? current.filter((item) => item !== index)
            : [...current, index],
        );
      }}
    />
  );
}
