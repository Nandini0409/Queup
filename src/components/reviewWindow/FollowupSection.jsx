import { useState } from "react";
import LeadRow from "../LeadRow";
import TemplatePanel from "../TemplatePanel";

function FollowUpSection({
  sectionId,   // ✅ FIX
  title,
  template,
  setTemplate,
  leads,
  onSave,
  onCopy,
  onDone,
  onView,
  saving,
  loadingLeadId,
}) {
  const [showTemplate, setShowTemplate] = useState(false);

  return (
    <div className="
      rounded-2xl bg-white shadow-sm overflow-hidden
      border border-[rgba(24,27,58,0.08)]
      transition hover:shadow-md hover:-translate-y-[1px]
    ">

      <TemplatePanel
        title={`${title} Template`}
        description="Customize the message used for this follow-up."
        template={template}
        setTemplate={setTemplate}
        showTemplate={showTemplate}
        onToggle={() =>
          setShowTemplate((prev) => !prev)
        }
        onSave={onSave}
        saving={saving}
      />

      {/* LEADS */}
      <div>
        {leads.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            subtitle="Ready for a follow-up?"

            tertiary={
              <button
                onClick={() => onView(lead)}
                className="
    text-xs px-3 py-1.5 rounded-lg
    border border-[rgba(24,27,58,0.10)]
    text-[rgba(5,5,12,0.85)]
    hover:text-[var(--color-primary)]
    hover:border-[var(--color-accent)]
    hover:bg-[rgba(200,230,107,0.08)]
    transition
  "
              >
                View
              </button>
            }

            secondary={
              <button
                onClick={() => onCopy(lead)}
                className="
    text-xs px-3 py-1.5 rounded-lg
    border border-[rgba(24,27,58,0.10)]
    text-[rgba(5,5,12,0.85)]
    hover:text-[var(--color-primary)]
    hover:border-[var(--color-accent)]
    hover:bg-[rgba(200,230,107,0.08)]
    transition
  "
              >
                Copy
              </button>
            }

            primary={
              <button
                onClick={() => onDone(lead)}
                disabled={loadingLeadId === lead.id}
                className="
          rounded-lg bg-[var(--color-accent)]
          px-4 py-2 text-sm font-semibold
          text-[var(--color-primary)]
          transition
          hover:opacity-90
          active:scale-[0.98]
          disabled:opacity-50
        "
              >
                {loadingLeadId === lead.id ? "Updating..." : "Mark Sent"}
              </button>
            }
          />
        ))}
      </div>

    </div>
  );
}

export default FollowUpSection;