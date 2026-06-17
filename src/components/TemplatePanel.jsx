function TemplatePanel({
  title,
  description,
  template,
  setTemplate,
  showTemplate,
  onToggle,
  onSave,
  saving,
}) {
  return (
    <div
      className="
        rounded-xl
        border border-[rgba(24,27,58,0.06)]
        bg-[rgba(24,27,58,0.02)]
      "
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h3 className="text-sm font-medium text-[var(--color-primary)]">
            {title}
          </h3>

          {description && (
            <p className="text-xs text-[rgba(24,27,58,0.55)]">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onToggle}
          className="
            text-xs text-[rgba(24,27,58,0.55)]
            hover:text-[var(--color-primary)]
            active:scale-95
            transition
          "
        >
          {showTemplate ? "Hide" : "Edit"}
        </button>
      </div>

      {showTemplate && (
        <div className="px-4 pb-4 space-y-3">
          <textarea
            rows={4}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="
              w-full rounded-lg
              border border-[rgba(24,27,58,0.10)]
              bg-white p-3 text-sm outline-none
              focus:border-[var(--color-primary)]
            "
          />

          <button
            onClick={onSave}
            disabled={saving}
            className="
              text-xs font-medium
              text-[var(--color-primary)]
              hover:opacity-80
              active:scale-95
              transition
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TemplatePanel;