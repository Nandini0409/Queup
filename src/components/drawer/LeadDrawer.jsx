import { useEffect, useState } from "react";

import { getLeadActivities } from "../../services/activities";

import LeadHeader from "./LeadHeader";
import LeadNotes from "./LeadNotes";
import ActivityTimeline from "./ActivityTimeline";

function LeadDrawer({
  lead,
  onClose,
}) {
  const [leadData, setLeadData] =
    useState(lead);
    console.log(lead)

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    setLeadData(lead);
  }, [lead]);

  useEffect(() => {
    if (!lead) return;

    async function loadActivities() {
      try {
        setLoading(true);

        const data =
          await getLeadActivities(
            lead.id
          );

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
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          z-40
          bg-black/30
          backdrop-blur-[2px]
        "
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          fixed
          right-0
          top-0
          z-50
          h-screen
          w-full
          max-w-[540px]
          overflow-y-auto
          border-l
          border-[var(--color-border)]
          bg-[var(--color-card)]
          shadow-2xl
        "
      >
        <div className="p-6">
          {/* Header */}
          <LeadHeader
            lead={leadData}
            onClose={onClose}
            onLeadUpdated={
              setLeadData
            }
            onActivitiesUpdated={
              setActivities
            }
          />

          {/* Divider */}
          <div className="my-8 border-t border-[var(--color-border)]" />

          {/* Notes */}
          <LeadNotes
            lead={leadData}
            onLeadUpdated={
              setLeadData
            }
            onActivitiesUpdated={
              setActivities
            }
          />

          {/* Divider */}
          <div className="my-8 border-t border-[var(--color-border)]" />

          {/* Timeline */}
          <section>
            <h3
              className="
                mb-5
                text-lg
                font-semibold
                text-[var(--color-text)]
              "
            >
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