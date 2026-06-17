import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getTodaysLeadsCount } from "../../services/leads";

function DailyProspectingCard({ refreshKey }) {
  const user = useCurrentUser();

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const GOAL = 10;

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    async function load() {
      try {
        setLoading(true);

        const todayCount =
          await getTodaysLeadsCount(user.id);

        if (isMounted) {
          setCount(todayCount || 0);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load progress");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [user, refreshKey]);

  const progress = Math.min(
    (count / GOAL) * 100,
    100
  );

  const remaining = Math.max(
    GOAL - count,
    0
  );

  const isComplete = count >= GOAL;

  return (
    <div className="space-y-4">

      <div>
        <div className="text-2xl font-bold text-[var(--color-primary)]">
          {loading
            ? "..."
            : `${count} of ${GOAL}`}
        </div>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          prospects added today
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="
            h-full
            bg-[var(--color-accent)]
            transition-all
            duration-500
          "
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {!loading && !isComplete && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {remaining} more to reach today's goal.
        </p>
      )}

      {!loading && isComplete && (
        <div
          className="
            rounded-xl
            bg-[rgba(200,230,107,0.18)]
            px-4 py-3
            text-sm
            font-medium
            text-[var(--color-primary)]
          "
        >
          You've reached today's prospecting goal.
        </div>
      )}

    </div>
  );
}

export default DailyProspectingCard;