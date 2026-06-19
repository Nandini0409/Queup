import { useEffect, useState } from "react";

import { getLeadActivities } from "../../services/activities";

import LeadHeader from "./LeadHeader";
import LeadNotes from "./LeadNotes";
import ActivityTimeline from "./ActivityTimeline";

function LeadDrawer({
  lead,
  onClose,
  onLeadStatusChanged,
}) {
  const [leadData, setLeadData] = useState(lead);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLeadData(lead);
  }, [lead]);

  useEffect(() => {
    if (!lead) return;

    async function loadActivities() {
      try {
        setLoading(true);

        const data = await getLeadActivities(lead.id);
        setActivities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [lead]);

  if (!leadData) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="
          fixed inset-0 z-40
          bg-black/40
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className="
          fixed right-0 top-0 z-50
          h-full w-full sm:max-w-[540px]
          overflow-y-auto

          bg-[var(--color-card)]
          border-l border-[var(--color-border)]

          shadow-2xl
        "
      >
        {/* sticky header area */}
        <div
          className="
            sticky top-0 z-10

            bg-[var(--color-card)]
            border-b border-[var(--color-border)]

            px-4 sm:px-6 py-4
            flex items-center justify-between
          "
        >
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Lead Details
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              px-3 py-1.5
              text-sm
              text-[var(--color-text-secondary)]
              hover:bg-slate-100
              transition
            "
          >
            Close
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-6 space-y-8">

          {/* HEADER */}
          <LeadHeader
            lead={leadData}
            onClose={onClose}
            onLeadUpdated={setLeadData}
            onActivitiesUpdated={setActivities}
            onLeadStatusChanged={onLeadStatusChanged}
          />

          {/* DIVIDER */}
          <div className="border-t border-[var(--color-border)]" />

          {/* NOTES */}
          <LeadNotes
            lead={leadData}
            onLeadUpdated={setLeadData}
            onActivitiesUpdated={setActivities}
          />

          {/* DIVIDER */}
          <div className="border-t border-[var(--color-border)]" />

          {/* TIMELINE */}
          <section>
            <h3 className="mb-4 text-base sm:text-lg font-semibold text-[var(--color-text)]">
              Activity Timeline
            </h3>

            <ActivityTimeline
              activities={activities}
              loading={loading}
            />
          </section>

        </div>
      </div>
    </>
  );
}

export default LeadDrawer;