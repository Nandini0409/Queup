import {
  CheckCircle2,
  MessageSquare,
  Plus,
  Pencil,
  Clock3,
} from "lucide-react";

const ACTIVITY_CONFIG = {
  lead_added: {
    label: "Lead added to queue",
    icon: Plus,
    bg: "bg-blue-100",
    text: "text-blue-700",
  },

  initial_message_sent: {
    label: "Initial message sent",
    icon: MessageSquare,
    bg: "bg-violet-100",
    text: "text-violet-700",
  },

  follow_up_1_sent: {
    label: "Follow Up 1 sent",
    icon: Clock3,
    bg: "bg-amber-100",
    text: "text-amber-700",
  },

  follow_up_2_sent: {
    label: "Follow Up 2 sent",
    icon: Clock3,
    bg: "bg-amber-100",
    text: "text-amber-700",
  },

  final_follow_up_sent: {
    label: "Final Follow Up sent",
    icon: Clock3,
    bg: "bg-amber-100",
    text: "text-amber-700",
  },

  marked_interested: {
    label: "Marked as interested",
    icon: CheckCircle2,
    bg: "bg-green-100",
    text: "text-green-700",
  },

  notes_updated: {
    label: "Notes updated",
    icon: Pencil,
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
};

function TimelineSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex gap-3 sm:gap-4 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-slate-200" />

          <div className="flex-1">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityTimeline({ activities, loading }) {
  if (loading) return <TimelineSkeleton />;

  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-6 sm:p-8 text-center">
        <p className="font-medium text-[var(--color-text)]">
          No activity yet
        </p>

        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Activity will appear here as you work this lead.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {activities.map((activity, index) => {
        const config = ACTIVITY_CONFIG[activity.activity_type] || {
          label: activity.activity_type,
          icon: Clock3,
          bg: "bg-slate-100",
          text: "text-slate-700",
        };

        const Icon = config.icon;

        const formattedDate = new Date(activity.created_at).toLocaleString(
          "en-GB",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }
        );

        return (
          <div
            key={activity.id}
            className="relative flex gap-3 sm:gap-4"
          >
            {/* timeline line */}
            {index !== activities.length - 1 && (
              <div
                className="
                  absolute
                  left-4
                  top-9
                  h-full
                  w-px
                  bg-[var(--color-border)]
                "
              />
            )}

            {/* icon */}
            <div
              className={`
                relative z-10
                flex h-8 w-8
                items-center justify-center
                rounded-full
                shrink-0
                ${config.bg}
                ${config.text}
              `}
            >
              <Icon size={14} />
            </div>

            {/* content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-[15px] font-medium text-[var(--color-text)] break-words">
                {config.label}
              </p>

              <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-text-secondary)]">
                {formattedDate}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ActivityTimeline;