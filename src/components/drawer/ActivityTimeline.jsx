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
  },

  initial_message_sent: {
    label: "Initial message sent",
    icon: MessageSquare,
  },

  follow_up_1_sent: {
    label: "Follow Up 1 Sent",
    icon: Clock3,
  },

  follow_up_2_sent: {
    label: "Follow Up 2 Sent",
    icon: Clock3,
  },

  final_follow_up_sent: {
    label: "Final Follow Up Sent",
    icon: Clock3,
  },

  marked_interested: {
    label: "Marked as interested",
    icon: CheckCircle2,
  },

  notes_updated: {
    label: "Notes updated",
    icon: Pencil,
  },
};

function ActivityTimeline({
  activities,
  loading,
}) {
  if (loading) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">
        Loading timeline...
      </p>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          No activity yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {activities.map(
        (activity, index) => {
          const config =
            ACTIVITY_CONFIG[
            activity.activity_type
            ] || {
              label:
                activity.activity_type,
              icon: Clock3,
            };

          const Icon =
            config.icon;

          return (
            <div
              key={activity.id}
              className="relative flex gap-4"
            >
              {index !==
                activities.length -
                1 && (
                  <div className="absolute left-4 top-9 h-full w-px bg-[var(--color-border)]" />
                )}

              <div
                className="
                  relative
                  z-10
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--color-accent)]
                  text-[var(--color-primary)]
                "
              >
                <Icon size={14} />
              </div>

              <div className="flex-1">
                <p className="font-medium text-[var(--color-text)]">
                  {config.label}
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {new Date(
                    activity.created_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export default ActivityTimeline;