import { useState } from "react";
import {
  X,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import StatusBadge from "../StatusBadge";
import toast from "react-hot-toast";

import { getLeadActionInfo } from "../../utils/getLeadActionInfo";
import { markLeadInterested } from "../../services/leads";
import {
  createActivity,
  getLeadActivities,
} from "../../services/activities";

const subtitleColors = {
  upcoming: "text-[var(--color-text-secondary)]",
  today: "text-amber-600 font-medium",
  overdue: "text-red-600 font-medium",
  success: "text-green-600 font-medium",
  info: "text-[var(--color-text-secondary)]",
};

function LeadHeader({
  lead,
  onClose,
  onLeadUpdated,
  onActivitiesUpdated,
  onLeadStatusChanged,
}) {
  const [updating, setUpdating] = useState(false);

  async function handleMarkInterested() {
    try {
      setUpdating(true);

      const updatedLead = await markLeadInterested(lead.id);

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "marked_interested"
      );

      const activities = await getLeadActivities(updatedLead.id);

      onLeadUpdated(updatedLead);

      if (onLeadStatusChanged) {
        onLeadStatusChanged(updatedLead);
      }

      onActivitiesUpdated(activities);

      toast.success("Lead marked as interested");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    } finally {
      setUpdating(false);
    }
  }

  const addedDate = new Date(lead.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const actionInfo = getLeadActionInfo(lead);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] break-words">
            {lead.name}
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Added {addedDate}
          </p>

          <div className="mt-3">
            <StatusBadge status={lead.status} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="
            shrink-0
            rounded-xl
            p-2
            transition
            hover:bg-slate-100
          "
        >
          <X size={18} />
        </button>
      </div>

      {/* NEXT ACTION */}
      <div
        className="
          rounded-2xl
          border border-[var(--color-border)]
          bg-white
          p-4 sm:p-6
        "
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Next Action
        </p>

        <h3 className="mt-2 sm:mt-3 text-xl sm:text-3xl font-bold text-[var(--color-primary)] break-words">
          {actionInfo.title}
        </h3>

        {actionInfo.subtitle && (
          <p className={`mt-2 sm:mt-3 text-sm ${subtitleColors[actionInfo.type]}`}>
            {actionInfo.subtitle}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">

        <a
          href={lead.profile_url}
          target="_blank"
          rel="noreferrer"
          className="
            flex items-center justify-center gap-2

            rounded-xl
            border border-[var(--color-border)]

            px-4 py-2.5

            text-sm font-medium

            transition

            hover:border-[var(--color-primary)]
            hover:bg-slate-50
          "
        >
          <ExternalLink size={16} />
          View Profile
        </a>

        {lead.status !== "interested" && (
          <button
            onClick={handleMarkInterested}
            disabled={updating}
            className="
              flex items-center justify-center gap-2

              rounded-xl
              bg-[var(--color-primary)]

              px-4 py-2.5

              text-sm font-medium text-white

              transition

              hover:shadow-md

              disabled:cursor-not-allowed
              disabled:opacity-50

              sm:w-auto w-full
            "
          >
            <CheckCircle2 size={16} />

            {updating ? "Updating..." : "Mark Interested"}
          </button>
        )}
      </div>
    </div>
  );
}

export default LeadHeader;