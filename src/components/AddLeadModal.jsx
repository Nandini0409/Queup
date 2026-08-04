import { useState } from "react";
import { X, UserPlus } from "lucide-react";

import { useUpdateLead } from "../hooks/useUpdateLead";
import { useAddLead } from "../hooks/useAddLead";
import { validateLead, isLeadFormValid } from "../utils/Validity";


function AddLeadModal({
  userId,
  lead,
  onClose,
  onLeadCreated,
  mode = "add"
}) {
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState({
    name: lead?.name ?? "",
    profile_link: lead?.profile_link ?? "",
    profile_heading: lead?.profile_heading ?? "",
    country: lead?.country ?? "",
    business_type: lead?.business_type ?? "",
    connections_count: lead?.connections_count ?? "",
    followers_count: lead?.followers_count ?? "",
    connection_request_date:
      lead?.connection_request_date ??
      new Date().toISOString().split("T")[0],
    remarks: lead?.remarks ?? "",
  });

  const [errors, setErrors] = useState({});

  const { addLead, loading: adding } = useAddLead();
  const { editLead, loading: editing } = useUpdateLead();

  const loading = adding || editing;


  const inputClass = `mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(24,27,58,0.12)]`;

  const handleInputChange = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };


  const isFormValid = isLeadFormValid(formData);

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLead(formData);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      profile_link: formData.profile_link.trim(),
      profile_heading: formData.profile_heading.trim(),
      country: formData.country.trim(),
      business_type: formData.business_type.trim(),
      connections_count: formData.connections_count
        ? Number(formData.connections_count)
        : null,
      followers_count: formData.followers_count
        ? Number(formData.followers_count)
        : null,
    };

    try {
      let savedLead;

      if (isEdit) {
        savedLead = await editLead(
          lead.id,
          payload
        );
      } else {
        savedLead = await addLead(userId, {
          ...payload,
          connection_request_date:
            formData.connection_request_date || null,
          remarks: formData.remarks.trim(),
        });
      }

      onLeadCreated?.(savedLead);
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
      <div
        className="fixed left-1/2 top-1/2 z-100 w-[95vw] max-w-[620px] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div
          className=" flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-4 py-5 sm:px-7 sm:py-6"
        >
          <div
            className="flex items-center gap-3 min-w-0"
          >
            <div
              className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[rgba(24,27,58,0.06)] text-[var(--color-primary)]"
            >
              <UserPlus size={18} />
            </div>

            <div className="min-w-0">
              <h2
                className="text-lg sm:text-xl font-semibold text-[var(--color-primary)]"
              >
                {isEdit ? "Edit Lead" : "Add Lead"}
              </h2>

              <p
                className="mt-1 text-sm text-[var(--color-text-secondary)]"
              >
                {isEdit
                  ? "Update this lead's information."
                  : "Add someone to your outreach pipeline."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 hover:bg-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-7 space-y-6"
        >
          {/* =========================
    BASIC INFORMATION
========================= */}
          <div className="space-y-5">

            <div>
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                Basic Information
              </h3>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Basic information about the lead.
              </p>
            </div>

            {/* Lead Name */}
            <div>
              <label className="text-sm font-medium text-[var(--color-primary)]">
                Lead Name <span className="text-red-500">*</span>
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

            {/* LinkedIn Profile */}
            <div>
              <label className="text-sm font-medium text-[var(--color-primary)]">
                LinkedIn Profile URL{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="url"
                value={formData.profile_link}
                onChange={(e) =>
                  handleInputChange(
                    "profile_link",
                    e.target.value
                  )
                }
                placeholder="https://linkedin.com/in/johnsmith"
                className={inputClass}
              />

              {errors.profile_link && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.profile_link}
                </p>
              )}
            </div>

            {/* Profile Heading */}
            <div>
              <label className="text-sm font-medium text-[var(--color-primary)]">
                Profile Heading
              </label>

              <textarea
                rows={3}
                value={formData.profile_heading}
                onChange={(e) =>
                  handleInputChange(
                    "profile_heading",
                    e.target.value
                  )
                }
                placeholder="Founder @ ABC Company | Helping SaaS companies grow..."
                className={`${inputClass} resize-none`}
              />

              {errors.profile_heading && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.profile_heading}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="text-sm font-medium text-[var(--color-primary)]">
                Country
              </label>

              <input
                value={formData.country}
                onChange={(e) =>
                  handleInputChange("country", e.target.value)
                }
                placeholder="India"
                className={inputClass}
              />

              {errors.country && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.country}
                </p>
              )}
            </div>

          </div>







          {/* =========================
    BUSINESS INFORMATION
========================= */}
          <div className="space-y-5 border-t border-[var(--color-border)] pt-6">

            <div>
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                Business Information
              </h3>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Information related to the lead's business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Business Type */}
              <div>
                <label className="text-sm font-medium text-[var(--color-primary)]">
                  Business Type
                </label>

                <input
                  value={formData.business_type}
                  onChange={(e) =>
                    handleInputChange(
                      "business_type",
                      e.target.value
                    )
                  }
                  placeholder="Marketing Agency"
                  className={inputClass}
                />

                {errors.business_type && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.business_type}
                  </p>
                )}
              </div>

              {/* Connections */}
              <div>
                <label className="text-sm font-medium text-[var(--color-primary)]">
                  Number of Connections
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.connections_count}
                  onChange={(e) =>
                    handleInputChange(
                      "connections_count",
                      e.target.value
                    )
                  }
                  placeholder="500"
                  className={inputClass}
                />

                {errors.connections_count && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.connections_count}
                  </p>
                )}
              </div>

              {/* Followers */}
              <div>
                <label className="text-sm font-medium text-[var(--color-primary)]">
                  Number of Followers
                </label>

                <input
                  type="number"
                  min="0"
                  value={formData.followers_count}
                  onChange={(e) =>
                    handleInputChange(
                      "followers_count",
                      e.target.value
                    )
                  }
                  placeholder="1200"
                  className={inputClass}
                />

                {errors.followers_count && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.followers_count}
                  </p>
                )}
              </div>

            </div>

          </div>


          {/* =========================
    OUTREACH
========================= */}

          {!isEdit && (
            <div className="space-y-5 border-t border-[var(--color-border)] pt-6">

              <div>
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  Outreach
                </h3>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Track communication with this lead.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Last Contact Date */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-primary)]">
                    Last Contact Date
                  </label>

                  <input
                    type="date"
                    value={formData.connection_request_date}
                    onChange={(e) =>
                      handleInputChange(
                        "connection_request_date",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

              </div>

              {/* Remarks */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--color-primary)]">
                    Remarks
                  </label>

                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {formData.remarks.length}/500
                  </span>
                </div>

                <textarea
                  maxLength={500}
                  rows={5}
                  value={formData.remarks}
                  onChange={(e) =>
                    handleInputChange(
                      "remarks",
                      e.target.value
                    )
                  }
                  placeholder="Add notes, personalization ideas, follow-up details..."
                  className={`${inputClass} resize-none`}
                />
              </div>

            </div>
          )}



          {/* FOOTER */}
          <div
            className="flex flex-col-reverse gap-3 pt-4 border-t border-[var(--color-border)] sm:flex-row sm:justify-end"
          >
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading || !isFormValid
              }
              className="w-full sm:w-auto rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                  ? "Save Changes"
                  : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddLeadModal;