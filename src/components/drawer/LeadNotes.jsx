import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  updateLeadNotes,
} from "../../services/leads";

import {
  createActivity,
  getLeadActivities,
} from "../../services/activities";

function LeadNotes({
  lead,
  onLeadUpdated,
  onActivitiesUpdated,
}) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotes(lead.notes || "");
  }, [lead]);

  async function handleSaveNotes() {
    try {
      setSaving(true);

      const updatedLead = await updateLeadNotes(lead.id, notes);

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "notes_updated"
      );

      const activities = await getLeadActivities(updatedLead.id);

      onLeadUpdated(updatedLead);
      onActivitiesUpdated(activities);

      setIsEditingNotes(false);
      toast.success("Notes updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notes");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setNotes(lead.notes || "");
    setIsEditingNotes(false);
  }

  return (
    <section className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text)]">
          Notes
        </h3>

        {!isEditingNotes && lead.notes && (
          <button
            onClick={() => setIsEditingNotes(true)}
            className="
              rounded-lg
              px-3 py-1.5
              text-sm
              font-medium
              text-[var(--color-text-secondary)]
              hover:text-[var(--color-primary)]
              hover:bg-slate-100
              transition
            "
          >
            Edit
          </button>
        )}
      </div>

      {/* CARD */}
      <div
        className="
          rounded-2xl
          border border-[var(--color-border)]
          bg-white
          p-4 sm:p-5
          transition
        "
      >

        {/* EDIT MODE */}
        {isEditingNotes ? (
          <div className="space-y-3">

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="
                w-full
                min-h-[140px] sm:min-h-[180px]

                rounded-xl
                border border-[var(--color-border)]

                bg-white

                p-3 sm:p-4

                text-sm
                leading-6

                outline-none

                transition

                focus:border-[var(--color-primary)]
                focus:ring-2
                focus:ring-[rgba(24,27,58,0.10)]
              "
            />

            {/* CHAR COUNT */}
            <div className="text-right text-xs text-[var(--color-text-secondary)]">
              {notes.length} characters
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="
                  w-full sm:w-auto

                  rounded-xl
                  bg-[var(--color-primary)]

                  px-4 py-2

                  text-sm font-medium
                  text-white

                  transition
                  hover:opacity-90

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>

              <button
                onClick={handleCancel}
                disabled={saving}
                className="
                  w-full sm:w-auto

                  rounded-xl
                  border border-[var(--color-border)]

                  px-4 py-2

                  text-sm font-medium

                  hover:bg-slate-50

                  transition

                  disabled:opacity-50
                "
              >
                Cancel
              </button>
            </div>
          </div>
        ) : lead.notes ? (
          /* VIEW MODE */
          <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-secondary)]">
            {lead.notes}
          </p>
        ) : (
          /* EMPTY STATE */
          <div className="py-8 text-center">
            <p className="font-medium text-[var(--color-text)]">
              No notes added yet
            </p>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Save context, objections, or follow-up details here.
            </p>

            <button
              onClick={() => setIsEditingNotes(true)}
              className="
                mt-4

                rounded-xl
                border border-[var(--color-border)]

                px-4 py-2

                text-sm font-medium

                hover:bg-slate-50

                transition
              "
            >
              Add Notes
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default LeadNotes;