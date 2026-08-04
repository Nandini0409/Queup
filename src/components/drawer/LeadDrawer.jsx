import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getLeadActivities } from "../../services/activities";
import { deleteLead } from "../../services/leads";
import AddLeadModal from "../AddLeadModal";

import LeadOverview from "./LeadOverview";
import LeadRemarks from "./LeadRemarks";
import ActivityTimeline from "./ActivityTimeline";

function LeadDrawer({
  lead,
  onClose,
  onLeadStatusChanged,
  onLeadDeleted,
}) {
  const [leadData, setLeadData] = useState(lead);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);

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

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${leadData.name}?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await deleteLead(leadData.id);

      toast.success("Lead deleted");

      onLeadDeleted?.(leadData.id);

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  }

  if (!leadData) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed inset-0 z-40
          bg-black/40 backdrop-blur-sm
        "
        onClick={onClose}
      />


      {isEditLeadOpen && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
          />
          <AddLeadModal
            mode="edit"
            lead={leadData}
            onClose={() => setIsEditLeadOpen(false)}
            onLeadCreated={(updatedLead) => {
              setLeadData(updatedLead);
              setIsEditLeadOpen(false);
            }}
          />
        </>
      )}
      {/* Drawer */}
      <aside
        className="
          fixed right-0 top-0 z-50
          h-screen w-full sm:max-w-[560px]
          overflow-y-auto

          border-l border-[var(--color-border)]
          bg-[var(--color-card)]
          shadow-2xl
        "
      >
        {/* Sticky Header */}
        <header
          className="
            sticky top-0 z-20

            flex items-center justify-between

            border-b border-[var(--color-border)]
            bg-[var(--color-card)]/95
            backdrop-blur

            px-6 py-4
          "
        >
          <div>
            <h2 className="mt-1 text-lg font-semibold text-[var(--color-text)]">
              Lead Details
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditLeadOpen(true)}
              className="
      rounded-lg
      border border-[var(--color-border)]
      px-3 py-2
      text-sm
      transition
      hover:bg-slate-100
    "
            >
              Edit Lead
            </button>

            <button
              onClick={onClose}
              className="
      rounded-lg
      px-3 py-2
      text-sm
      text-[var(--color-text-secondary)]
      transition
      hover:bg-slate-100
    "
            >
              Close
            </button>
          </div>
        </header>

        {/* Body */}
        {/* Body */}
        <main className="px-6 py-8">

          {/* Lead Overview */}
          <section className="border-b border-[var(--color-border)] pb-10">
            <LeadOverview
              lead={leadData}
              onLeadUpdated={setLeadData}
              onActivitiesUpdated={setActivities}
              onLeadStatusChanged={onLeadStatusChanged}
            />
          </section>

          {/* Notes */}
          <section className="border-b border-[var(--color-border)] py-10">
            <LeadRemarks
              lead={leadData}
              onLeadUpdated={setLeadData}
              onActivitiesUpdated={setActivities}
            />
          </section>

          {/* Timeline */}
          <section className="border-b border-[var(--color-border)] py-10">
            <h3 className="mb-6 text-lg font-semibold text-[var(--color-text)]">
              Activity Timeline
            </h3>

            <ActivityTimeline
              activities={activities}
              loading={loading}
            />
          </section>

          {/* Danger Zone */}
          <section className="pt-10">
            <div
              className="
        rounded-2xl
        border border-red-200
        bg-red-50/40
        p-5
      "
            >
              <h3 className="text-base font-semibold text-red-700">
                Danger Zone
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-600">
                Deleting this lead permanently removes it along with
                its associated outreach history.
              </p>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="
          mt-5
          w-full
          rounded-xl
          border border-red-300
          px-4
          py-3
          text-sm
          font-medium
          text-red-700
          transition
          hover:bg-red-100
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
              >
                {isDeleting ? "Deleting..." : "Delete Lead"}
              </button>
            </div>
          </section>

        </main>
      </aside>
    </>
  );
}

export default LeadDrawer;