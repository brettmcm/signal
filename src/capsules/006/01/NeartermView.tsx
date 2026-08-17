import type { NeartermTheme } from "./model";
import { events, limits, reminders } from "./model";
import "./nearterm.css";

type Props = {
  theme: NeartermTheme;
  reminderCount: number;
  eventCount: number;
  completedReminders?: readonly number[];
  interactive?: boolean;
  onThemeChange?: (theme: NeartermTheme) => void;
  onReminderCountChange?: (count: number) => void;
  onEventCountChange?: (count: number) => void;
  onToggleReminder?: (index: number) => void;
};

const clamp = (value: number, maximum: number) =>
  Math.min(maximum, Math.max(0, value));

export function NeartermView({
  theme,
  reminderCount,
  eventCount,
  completedReminders = [],
  interactive = false,
  onThemeChange,
  onReminderCountChange,
  onEventCountChange,
  onToggleReminder,
}: Props) {
  const visibleEvents = events.slice(0, clamp(eventCount, limits.events));
  const visibleReminders = reminders.slice(0, clamp(reminderCount, limits.reminders));

  return (
    <div className="nearterm-capsule" data-theme={theme}>
      <div className="nearterm-controls" aria-label="Nearterm display controls">
        <div className="nt-appearance" role="group" aria-label="Appearance">
          <button type="button" aria-label="Use light appearance" aria-pressed={theme === "light"} tabIndex={interactive ? 0 : -1} onClick={() => onThemeChange?.("light")}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.4"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13"/></svg>
          </button>
          <button type="button" aria-label="Use dark appearance" aria-pressed={theme === "dark"} tabIndex={interactive ? 0 : -1} onClick={() => onThemeChange?.("dark")}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.7 10.7A6 6 0 0 1 5.3 3.3 5.5 5.5 0 1 0 12.7 10.7Z"/></svg>
          </button>
        </div>

        <div className="nt-count-controls">
          <Stepper label="Tasks" value={reminderCount} maximum={limits.reminders} interactive={interactive} onChange={onReminderCountChange} />
          <Stepper label="Events" value={eventCount} maximum={limits.events} interactive={interactive} onChange={onEventCountChange} />
        </div>
      </div>

      <div className="nt-popover" aria-label="Interactive Nearterm menu bar app">
        <header className="nt-panel-header"><p><strong>Friday</strong><span>August 14, 2026</span></p></header>

        <section className="nt-section" aria-label="Events remaining today">
          {visibleEvents.length > 0 ? <>
            <p className="nt-summary">You have <strong>{visibleEvents.length} {visibleEvents.length === 1 ? "event" : "events"}</strong> remaining today</p>
            <div className="nt-rows">
              {visibleEvents.map((event) => <div className="nt-row" key={event.title}>
                <span className="nt-row-icon" aria-hidden="true">{event.video ? "◆" : "◌"}</span>
                <span>{event.title} at <strong>{event.time}</strong></span>
              </div>)}
            </div>
          </> : <p className="nt-summary"><span className="nt-cup" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.25 7.25h7.5v3.1a3.15 3.15 0 0 1-3.15 3.15h-1.2a3.15 3.15 0 0 1-3.15-3.15v-3.1Z"/><path d="M10.75 8.25h.75a1.75 1.75 0 0 1 0 3.5h-1.2M2 14.5h10.5M5.25 5.25c-1-1 .9-1.55 0-2.65M8 5.25c-1-1 .9-1.55 0-2.65"/></svg></span> You have <strong>no events</strong> remaining today</p>}
        </section>

        <section className="nt-section" aria-label="Tasks today">
          {visibleReminders.length > 0 ? <>
            <p className="nt-summary">You have <strong>{visibleReminders.length} {visibleReminders.length === 1 ? "task" : "tasks"}</strong> today</p>
            <div className="nt-rows">
              {visibleReminders.map((reminder, index) => {
                const complete = completedReminders.includes(index);
                return <button className={`nt-row nt-reminder-row${complete ? " is-complete" : ""}`} type="button" key={reminder} aria-pressed={complete} tabIndex={interactive ? 0 : -1} onClick={() => onToggleReminder?.(index)}>
                  <span className="nt-row-icon nt-circle" aria-hidden="true"/><span>{reminder}</span>
                </button>;
              })}
            </div>
          </> : <p className="nt-summary"><span className="nt-check" aria-hidden="true">●</span> You have <strong>no tasks</strong> today</p>}
        </section>
      </div>
    </div>
  );
}

function Stepper({ label, value, maximum, interactive, onChange }: { label: string; value: number; maximum: number; interactive: boolean; onChange?: (value: number) => void }) {
  const singularLabel = label.replace(/s$/, "").toLowerCase();
  return <div className="nt-stepper">
    <span>{label}</span>
    <button type="button" aria-label={`Show one fewer ${singularLabel}`} disabled={value <= 0} tabIndex={interactive ? 0 : -1} onClick={() => onChange?.(clamp(value - 1, maximum))}>−</button>
    <output aria-live="polite">{value}</output>
    <button type="button" aria-label={`Show one more ${singularLabel}`} disabled={value >= maximum} tabIndex={interactive ? 0 : -1} onClick={() => onChange?.(clamp(value + 1, maximum))}>+</button>
  </div>;
}
