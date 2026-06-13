import { useState } from "react";

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
  const [isEditingNotes, setIsEditingNotes] =
    useState(false);

  const [notes, setNotes] =
    useState(lead.notes || "");

  async function handleSaveNotes() {
    try {
      const updatedLead =
        await updateLeadNotes(
          lead.id,
          notes
        );

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "notes_updated"
      );

      const activities =
        await getLeadActivities(
          updatedLead.id
        );

      onLeadUpdated(updatedLead);
      onActivitiesUpdated(
        activities
      );

      setIsEditingNotes(false);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCancel() {
    setNotes(lead.notes || "");
    setIsEditingNotes(false);
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3
          className="
            text-lg
            font-semibold
            text-[var(--color-text)]
          "
        >
          Notes
        </h3>

        {!isEditingNotes && (
          <button
            onClick={() =>
              setIsEditingNotes(true)
            }
            className="
              rounded-lg
              px-3
              py-1.5
              text-sm
              font-medium
              transition
              hover:bg-slate-100
            "
          >
            Edit
          </button>
        )}
      </div>

      <div
        className="
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-white
          p-5
        "
      >
        {isEditingNotes ? (
          <>
            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              placeholder="Add notes about this lead..."
              className="
                min-h-[180px]
                w-full
                rounded-xl
                border
                border-[var(--color-border)]
                p-4
                outline-none
                transition
                focus:border-[var(--color-accent)]
              "
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={
                  handleSaveNotes
                }
                className="
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Save Notes
              </button>

              <button
                onClick={
                  handleCancel
                }
                className="
                  rounded-xl
                  border
                  border-[var(--color-border)]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>
            </div>
          </>
        ) : lead.notes ? (
          <p
            className="
              whitespace-pre-wrap
              text-sm
              leading-6
              text-[var(--color-text-secondary)]
            "
          >
            {lead.notes}
          </p>
        ) : (
          <div className="text-center py-6">
            <p className="font-medium">
              No notes yet
            </p>

            <p
              className="
                mt-2
                text-sm
                text-[var(--color-text-secondary)]
              "
            >
              Add details about the lead,
              their background, interests,
              or conversation context.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default LeadNotes;