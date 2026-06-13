import {
  ArrowRight,
  Clock3,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import { getLeadActionInfo } from "../utils/getLeadActionInfo";

const subtitleColors = {
  upcoming:
    "text-[var(--color-text-secondary)]",

  today:
    "text-amber-600 font-medium",

  overdue:
    "text-red-500 font-medium",

  success:
    "text-green-600 font-medium",

  info:
    "text-[var(--color-text-secondary)]",
};

function LeadCard({
  lead,
  onClick,
}) {
  const actionInfo =
    getLeadActionInfo(lead);

  return (
    <div
      onClick={onClick}
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-card)]
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-[var(--color-accent)]
        hover:shadow-lg
      "
    >
      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-1
          bg-[var(--color-accent)]
        "
      />

      <div className="p-5 pl-6">
        <div className="flex justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate
                text-lg
                font-semibold
                text-[var(--color-text)]
              "
            >
              {lead.name}
            </h3>

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[var(--color-primary)]
              "
            >
              <ArrowRight
                size={14}
                className="
                  text-[var(--color-accent)]
                "
              />

              <span>
                {actionInfo.title}
              </span>
            </div>

            {actionInfo.subtitle && (
              <div
                className={`
                  mt-2
                  flex
                  items-center
                  gap-2
                  text-xs
                  ${subtitleColors[actionInfo.type]}
                `}
              >
                <Clock3 size={12} />

                <span>
                  {actionInfo.subtitle}
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <StatusBadge
              status={lead.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadCard;