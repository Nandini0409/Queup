import { useState } from "react";
import { X } from "lucide-react";

import { useAddLead } from "../hooks/useAddLead";

function AddLeadModal({
  userId,
  onClose,
  onLeadCreated,
}) {
  const [name, setName] =
    useState("");

  const [profileUrl, setProfileUrl] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const {
    addLead,
    loading,
    error,
  } = useAddLead();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;
    if (!profileUrl.trim()) return;

    try {
      const lead = await addLead(
        userId,
        {
          name,
          profileUrl,
          notes,
        }
      );

      onLeadCreated?.(lead);

      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          z-40
          bg-black/40
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          fixed
          left-1/2
          top-1/2
          z-50
          w-full
          max-w-[640px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-3xl
          border
          bg-[var(--color-card)]
          border-[var(--color-border)]
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-[var(--color-border)]
            px-8
            py-6
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-[var(--color-text)]
              "
            >
              Add Lead
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[var(--color-text-secondary)]
              "
            >
              Add a new person to your outreach queue.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-[var(--color-text-secondary)]
              transition
              hover:bg-[var(--color-bg)]
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8"
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[var(--color-text)]
                "
              >
                Lead Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="John Smith"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-4
                  py-3
                  text-[var(--color-text)]
                  outline-none
                  transition
                  focus:border-[var(--color-accent)]
                "
              />
            </div>

            {/* Profile URL */}
            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[var(--color-text)]
                "
              >
                Profile URL
              </label>

              <input
                value={profileUrl}
                onChange={(e) =>
                  setProfileUrl(
                    e.target.value
                  )
                }
                placeholder="https://linkedin.com/in/..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-4
                  py-3
                  text-[var(--color-text)]
                  outline-none
                  transition
                  focus:border-[var(--color-accent)]
                "
              />
            </div>

            {/* Notes */}
            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[var(--color-text)]
                "
              >
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Anything important about this lead..."
                className="
                  min-h-[160px]
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-4
                  py-3
                  text-[var(--color-text)]
                  outline-none
                  transition
                  focus:border-[var(--color-accent)]
                "
              />
            </div>

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  p-3
                "
              >
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="
              mt-8
              flex
              justify-end
              gap-3
              border-t
              border-[var(--color-border)]
              pt-6
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border
                border-[var(--color-border)]
                px-5
                py-2.5
                font-medium
                text-[var(--color-text)]
                transition
                hover:bg-[var(--color-bg)]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-[var(--color-primary)]
                px-5
                py-2.5
                font-medium
                text-white
                transition
                hover:opacity-90
                disabled:opacity-50
              "
            >
              {loading
                ? "Adding..."
                : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddLeadModal;