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

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" ||
      e.key === " "
    ) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="
        cursor-pointer

        rounded-2xl
        border
        border-[var(--color-border)]

        bg-[var(--color-card)]

        px-4 py-3
        sm:px-5 sm:py-5
        lg:px-6 lg:py-5

        transition-all
        duration-200

        focus:outline-none
        focus:ring-2
        focus:ring-[rgba(24,27,58,0.15)]

        md:hover:border-[var(--color-accent)]
        md:hover:bg-white
        md:hover:shadow-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3

          sm:grid
          sm:grid-cols-[240px_1fr_auto]
          sm:items-start
          sm:gap-8
        "
      >
        {/* MOBILE HEADER */}
        <div className="sm:hidden">
          <h3
            className="
              text-base
              font-semibold
              text-[var(--color-text)]
              break-words
            "
          >
            {lead.name}
          </h3>

          <div className="mt-2">
            <StatusBadge
              status={lead.status}
            />
          </div>
        </div>

        {/* DESKTOP/TABLET NAME */}
        <div className="hidden sm:block min-w-0">
          <h3
            className="
              text-lg
              leading-tight
              font-semibold
              text-[var(--color-text)]
              break-words
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

            <span className="break-words">
              {actionInfo.title}
            </span>
          </div>

          {actionInfo.subtitle && (
            <div
              className={`
                mt-2
                flex
                items-start
                gap-2
                text-xs
                ${subtitleColors[actionInfo.type]}
              `}
            >
              <Clock3
                size={12}
                className="mt-[1px] shrink-0"
              />

              <span className="break-words">
                {actionInfo.subtitle}
              </span>
            </div>
          )}
        </div>

        {/* DESKTOP/TABLET STATUS */}
        <div
          className="
            hidden sm:flex
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