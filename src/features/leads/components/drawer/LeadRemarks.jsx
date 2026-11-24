import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  updateLeadRemarks,
} from "../../services/leads";

import {
  createActivity,
  getLeadActivities,
} from "../../services/activities";

function LeadRemarks({
  lead,
  onLeadUpdated,
  onActivitiesUpdated,
}) {
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);
  const [remarks, setRemarks] = useState(lead.remarks || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRemarks(lead.remarks || "");
  }, [lead]);

  async function handleSaveRemarks() {
    try {
      setSaving(true);

      const updatedLead =
        await updateLeadRemarks(
          lead.id,
          remarks
        );

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "remarks_updated"
      );

      const activities =
        await getLeadActivities(updatedLead.id);

      onLeadUpdated(updatedLead);
      onActivitiesUpdated(activities);

      setIsEditingRemarks(false);

      toast.success("Remarks updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update remarks");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setRemarks(lead.remarks || "");
    setIsEditingRemarks(false);
  }

  return (
    <section>

      {/* Header */}

      <div className="mb-6 flex items-start justify-between">

        <div>

          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            Notes & Remarks
          </h3>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Keep important context about this lead.
          </p>

        </div>

        {!isEditingRemarks && lead.remarks && (
          <button
            onClick={() => setIsEditingRemarks(true)}
            className="
            rounded-lg
            border border-[var(--color-border)]
            px-4 py-2
            text-sm
            font-medium
            hover:bg-slate-50
          "
          >
            Edit
          </button>
        )}

      </div>

      <div>

        {isEditingRemarks ? (

          <div className="space-y-4">

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Write anything useful about this lead..."
              className="
              w-full
              min-h-[180px]
              rounded-xl
              border border-[var(--color-border)]
              p-4
              text-sm
              leading-7
              resize-none
              outline-none
              focus:border-[var(--color-primary)]
            "
            />

            <div className="flex items-center justify-between">

              <span className="text-xs text-[var(--color-text-secondary)]">
                {remarks.length} characters
              </span>

              <div className="flex gap-2">

                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="
                  rounded-xl
                  border
                  border-[var(--color-border)]
                  px-4
                  py-2
                  text-sm
                  hover:bg-slate-50
                "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveRemarks}
                  disabled={saving}
                  className="
                  rounded-xl
                  bg-[var(--color-primary)]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                "
                >
                  {saving ? "Saving..." : "Save Notes"}
                </button>

              </div>

            </div>

          </div>

        ) : lead.remarks ? (

          <div className="space-y-4">

            <div
              className="
    whitespace-pre-wrap
    rounded-xl
    bg-slate-50
    px-5
    py-4
    leading-7
    text-[15px]
    text-[var(--color-text)]
  "
            >
              {lead.remarks}
            </div>

          </div>

        ) : (

          <div className="py-10 text-center">

            <p className="font-medium text-[var(--color-text)]">
              No notes yet
            </p>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Save meeting notes, objections, follow-up ideas or anything you'll want to remember later.
            </p>

            <button
              onClick={() => setIsEditingRemarks(true)}
              className="
              mt-6
              rounded-xl
              bg-[var(--color-primary)]
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
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

export default LeadRemarks;