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
    "text-[var(--color-text-secondary)]",

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
        cursor-pointer
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-card)]
        px-6
        py-5
        transition-all
        duration-200
        hover:border-[var(--color-accent)]
        hover:bg-white
        hover:shadow-md
      "
    >
      <div
        className="
          grid
          grid-cols-[240px_1fr_auto]
          items-start
          gap-8
        "
      >
        {/* NAME */}

        <div className="min-w-0">
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
        </div>

        {/* NEXT ACTION */}

        <div className="min-w-0">
          <div
            className="
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
                shrink-0
                text-[var(--color-accent)]
              "
            />

            <span className="truncate">
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
              <Clock3
                size={12}
                className="shrink-0"
              />

              <span className="truncate">
                {actionInfo.subtitle}
              </span>
            </div>
          )}
        </div>

        {/* STATUS */}

        <div
          className="
            flex
            items-start
            justify-end
          "
        >
          <StatusBadge
            status={lead.status}
          />
        </div>
      </div>
    </div>
  );
}

export default LeadCard;