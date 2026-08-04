import { useState } from "react";
import {
  Globe,
  Building2,
  Users,
  UserRound,
  CalendarDays,
  Clock3,
  Send,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import StatusBadge from "../StatusBadge";

import { LEAD_STATUS } from "../../constants/leadStatus";
import { getLeadSummary } from "../../utils/getLeadSummary";


import { markLeadInterested, markLeadCompleted } from "../../services/leads";
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


function formatDate(date) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
}

function LeadOverview({
  lead,
  onLeadUpdated,
  onActivitiesUpdated,
  onLeadStatusChanged,
}) {
  const [updating, setUpdating] = useState(false);
  const canMarkCompleted = lead.status === LEAD_STATUS.FINAL_FOLLOW_UP_SENT;

  const summary = getLeadSummary(lead);


  const canMarkInterested = [
    LEAD_STATUS.INITIAL_MESSAGE_SENT,
    LEAD_STATUS.FOLLOW_UP_1_SENT,
    LEAD_STATUS.FOLLOW_UP_2_SENT,
    LEAD_STATUS.FINAL_FOLLOW_UP_SENT,
    LEAD_STATUS.COMPLETED,
  ].includes(lead.status);

  async function handleMarkCompleted() {
    try {
      setUpdating(true);

      const updatedLead =
        await markLeadCompleted(lead.id);

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "marked_completed"
      );
      console.log("lead updated")

      const activities =
        await getLeadActivities(updatedLead.id);

      onLeadUpdated(updatedLead);
      onLeadStatusChanged?.(updatedLead);
      onActivitiesUpdated(activities);

      toast.success("Lead marked as completed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    } finally {
      setUpdating(false);
    }
  }


  async function handleMarkInterested() {
    try {
      setUpdating(true);

      const updatedLead = await markLeadInterested(
        lead.id
      );

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "marked_interested"
      );

      const activities =
        await getLeadActivities(updatedLead.id);

      onLeadUpdated(updatedLead);
      onLeadStatusChanged?.(updatedLead);
      onActivitiesUpdated(activities);

      toast.success("Lead marked as interested");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    } finally {
      setUpdating(false);
    }
  }
  console.log(summary)

  return (
    <section className="space-y-8">

      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between gap-6">

        <div className="flex-1">

          <h1 className="text-3xl font-bold">
            {lead.name}
          </h1>

          {lead.profile_heading && (
            <p className="mt-2 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
              {lead.profile_heading}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">

            {lead.business_type && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium">
                {lead.business_type}
              </span>
            )}

            <StatusBadge status={lead.status} />

          </div>

        </div>

        {lead.profile_link && (
          <a
            href={lead.profile_link}
            target="_blank"
            rel="noreferrer"
            className="
      flex items-center gap-2
      rounded-xl
      border border-[var(--color-border)]
      bg-white
      px-4
      py-2.5
      text-sm
      font-medium
      transition
      hover:bg-slate-50
    "
          >
            <ExternalLink size={16} />
            Open LinkedIn
          </a>
        )}

      </div>


      {/* ================= CURRENT SITUATION ================= */}

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Outreach Status
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
          {summary.heading}
        </h2>

        <p className="mt-3 max-w-2xl leading-6 text-[var(--color-text-secondary)]">
          {summary.description}
        </p>

        <div className="mt-8 border-t border-b border-[var(--color-border)] py-6">

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">
            Recommended Action
          </p>

          <p className="mt-3 text-base font-medium text-[var(--color-text)]">
            {summary.recommendation.title}
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            {summary.recommendation.timing}
          </p>

        </div>

        <div className="mt-8 space-y-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <CalendarDays
                size={18}
                className="text-[var(--color-primary)]"
              />

              <span className="text-sm text-[var(--color-text-secondary)]">
                Last Contact
              </span>
            </div>

            <span className="font-medium">
              {lead.last_contact_date
                ? formatDate(lead.last_contact_date)
                : "No outreach yet"}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <Clock3
                size={18}
                className="text-[var(--color-primary)]"
              />

              <span className="text-sm text-[var(--color-text-secondary)]">
                Next Follow Up
              </span>
            </div>

            <span className="font-medium">
              {lead.next_follow_up_date
                ? formatDate(lead.next_follow_up_date)
                : "Not scheduled"}
            </span>

          </div>

        </div>




        <div className="mt-8 flex flex-wrap gap-3">

          {canMarkCompleted && (
            <button
              onClick={handleMarkCompleted}
              disabled={updating}
              className="
        rounded-xl
        border border-[var(--color-border)]
        px-5
        py-3
        text-sm
        font-medium
        hover:bg-slate-50
      "
            >
              {updating ? "Updating..." : "Mark Completed"}
            </button>
          )}

          {canMarkInterested && (
            <button
              onClick={handleMarkInterested}
              disabled={updating}
              className="
        rounded-xl
        bg-[var(--color-primary)]
        px-5
        py-3
        text-sm
        font-medium
        text-white
      "
            >
              {updating
                ? "Updating..."
                : lead.status === LEAD_STATUS.COMPLETED
                  ? "Reopen as Interested"
                  : "Mark Interested"}
            </button>
          )}

        </div>







      </div>


      {/* ================= PROFILE SNAPSHOT ================= */}

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Lead Information
        </p>

        <div className="mt-6 space-y-5">

          {lead.business_type && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Business
              </span>

              <span className="font-medium">
                {lead.business_type}
              </span>
            </div>
          )}

          {lead.country && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Country
              </span>

              <span className="font-medium">
                {lead.country}
              </span>
            </div>
          )}

          {lead.followers_count > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Followers
              </span>

              <span className="font-medium">
                {lead.followers_count.toLocaleString()}
              </span>
            </div>
          )}

          {lead.connections_count > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Connections
              </span>

              <span className="font-medium">
                {lead.connections_count.toLocaleString()}
              </span>
            </div>
          )}

        </div>

      </div>





    </section>
  );
}

export default LeadOverview;