import { useEffect, useState } from "react";

import {
  updateLeadNotes,
} from "../../services/leads";

import toast from "react-hot-toast";

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

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    setNotes(lead.notes || "");
  }, [lead]);

  async function handleSaveNotes() {
    try {
      setSaving(true);

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

      toast.success(
        "Notes updated"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update notes"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setNotes(lead.notes || "");
    setIsEditingNotes(false);
  }

  return (
    <section>
      {/* HEADER */}
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

        {!isEditingNotes && lead.notes && (
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

      {/* CONTENT */}
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

            {/* CHARACTER COUNT */}
            <div
              className="
                mt-2
                text-right
                text-xs
                text-[var(--color-text-secondary)]
              "
            >
              {notes.length} characters
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={
                  handleSaveNotes
                }
                disabled={saving}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Saving..."
                  : "Save Notes"}
              </button>

              <button
                onClick={
                  handleCancel
                }
                disabled={saving}
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
                  disabled:opacity-50
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
          <div className="py-8 text-center">
            <p
              className="
                font-medium
                text-[var(--color-text)]
              "
            >
              No notes added yet
            </p>

            <p
              className="
                mt-2
                text-sm
                text-[var(--color-text-secondary)]
              "
            >
              Save conversation details,
              interests, objections,
              or anything useful for future
              follow-ups.
            </p>

            <button
              onClick={() =>
                setIsEditingNotes(true)
              }
              className="
                mt-4
                rounded-lg
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
              Add Notes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default LeadNotes;