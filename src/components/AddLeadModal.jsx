import { useState } from "react";
import { X, UserPlus } from "lucide-react";

import { useAddLead } from "../hooks/useAddLead";
import { validateLead } from "../utils/validateLead";

function AddLeadModal({ userId, onClose, onLeadCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    profileUrl: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const { addLead, loading } = useAddLead();
  const inputClass =
    "mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(24,27,58,0.12)]";
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isFormValid =
    formData.name.trim() && formData.profileUrl.trim();

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLead(
      formData.name,
      formData.profileUrl
    );

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const lead = await addLead(userId, {
        name: formData.name.trim(),
        profileUrl: formData.profileUrl.trim(),
        notes: formData.notes.trim(),
      });

      onLeadCreated?.(lead);
      onClose();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[var(--color-border)] bg-white shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-[var(--color-border)] px-7 py-6">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[rgba(24,27,58,0.06)] text-[var(--color-primary)]">
              <UserPlus size={18} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">
                Add Lead
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Add someone to your outreach pipeline
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-7 space-y-6">

          {/* LEAD NAME */}
          <div>
            <label className="text-sm font-medium text-[var(--color-primary)]">
              Lead Name
            </label>

            <input
              autoFocus
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value)
              }
              placeholder="John Smith"
              className={inputClass}
            />

            {errors.name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* PROFILE URL */}
          <div>
            <label className="text-sm font-medium text-[var(--color-primary)]">
              Profile URL
            </label>

            <input
              value={formData.profileUrl}
              onChange={(e) =>
                handleInputChange("profileUrl", e.target.value)
              }
              placeholder="https://linkedin.com/in/john"
              className={inputClass}
            />

            {errors.profile && (
              <p className="mt-2 text-sm text-red-600">
                {errors.profile}
              </p>
            )}
          </div>

          {/* NOTES */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--color-primary)]">
                Notes
              </label>

              <span className="text-xs text-[var(--color-text-secondary)]">
                {formData.notes.length}/500
              </span>
            </div>

            <textarea
              value={formData.notes}
              maxLength={500}
              onChange={(e) =>
                handleInputChange("notes", e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Context, personalization ideas, etc..."
              className={`${inputClass} min-h-[120px] resize-none`}
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl border border-[var(--color-border)]
                px-5 py-2.5 text-sm
                hover:bg-slate-50
                transition
                cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="
                rounded-xl bg-[var(--color-primary)]
                px-5 py-2.5 text-sm text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:opacity-90
                transition
              "
            >
              {loading ? "Adding..." : "Add Lead"}
            </button>

          </div>

        </form>
      </div>
    </>
  );
}

export default AddLeadModal;