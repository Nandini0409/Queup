import {
  X,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import StatusBadge from "../StatusBadge";

import { getLeadActionInfo } from "../../utils/getLeadActionInfo";

import {
  markLeadInterested,
} from "../../services/leads";

import {
  createActivity,
  getLeadActivities,
} from "../../services/activities";

const subtitleColors = {
  upcoming:
    "text-[var(--color-text-secondary)]",

  today:
    "text-amber-600 font-medium",

  overdue:
    "text-red-600 font-medium",

  success:
    "text-green-600 font-medium",

  info:
    "text-[var(--color-text-secondary)]",
};

function LeadHeader({
  lead,
  onClose,
  onLeadUpdated,
  onActivitiesUpdated,
}) {
  async function handleMarkInterested() {
    try {
      const updatedLead =
        await markLeadInterested(
          lead.id
        );

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "marked_interested"
      );

      const activities =
        await getLeadActivities(
          updatedLead.id
        );

      onLeadUpdated(updatedLead);
      onActivitiesUpdated(
        activities
      );
    } catch (error) {
      console.error(error);
    }
  }

  const addedDate =
    new Date(
      lead.created_at
    ).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  const actionInfo =
    getLeadActionInfo(lead);

  return (
    <>
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <h2
            className="
              text-3xl
              font-bold
              text-[var(--color-text)]
            "
          >
            {lead.name}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-[var(--color-text-secondary)]
            "
          >
            Added {addedDate}
          </p>

          <div className="mt-3">
            <StatusBadge
              status={lead.status}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="
            rounded-xl
            p-2
            transition-all
            hover:bg-slate-100
          "
        >
          <X size={18} />
        </button>
      </div>

      {/* Next Action */}

      <div
        className="
          mt-8
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-white
          p-6
        "
      >
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-[var(--color-text-secondary)]
          "
        >
          Next Action
        </p>

        <h3
          className="
            mt-3
            text-3xl
            font-bold
            text-[var(--color-primary)]
          "
        >
          {actionInfo.title}
        </h3>

        {actionInfo.subtitle && (
          <p
            className={`
              mt-3
              text-sm
              ${subtitleColors[actionInfo.type]}
            `}
          >
            {actionInfo.subtitle}
          </p>
        )}
      </div>

      {/* Buttons */}

      <div className="mt-6 flex gap-3">
        <a
          href={lead.profile_url}
          target="_blank"
          rel="noreferrer"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--color-border)]
            px-4
            py-2.5
            text-sm
            font-medium
            transition-all
            hover:border-[var(--color-primary)]
            hover:bg-slate-50
          "
        >
          <ExternalLink size={16} />
          Open Profile
        </a>

        {lead.status !==
          "interested" && (
          <button
            onClick={
              handleMarkInterested
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-all
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >
            <CheckCircle2
              size={16}
            />
            Mark Interested
          </button>
        )}
      </div>
    </>
  );
}

export default LeadHeader;