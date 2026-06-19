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
        w-full
        rounded-xl
        border border-[rgba(24,27,58,0.06)]
        bg-[rgba(24,27,58,0.02)]
      "
    >
      <div
        className="
          flex flex-col gap-3
          sm:flex-row sm:items-center sm:justify-between

          px-4 py-3
          sm:px-5 sm:py-4
        "
      >
        <div className="min-w-0 flex-1">
          <h3
            className="
              text-sm font-medium
              text-[var(--color-primary)]
              break-words
            "
          >
            {title}
          </h3>

          {description && (
            <p
              className="
                mt-1
                text-xs
                text-[rgba(24,27,58,0.55)]
                break-words
              "
            >
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onToggle}
          className="
            self-start
            sm:self-auto

            min-h-[40px]

            px-3 py-2

            text-sm
            text-[rgba(24,27,58,0.55)]

            hover:text-[var(--color-primary)]
            active:scale-95
            transition
          "
        >
          {showTemplate ? "Hide" : "Edit"}
        </button>
      </div>

      {showTemplate && (
        <div
          className="
            px-4 pb-4
            sm:px-5 sm:pb-5
            space-y-4
          "
        >
          <textarea
            rows={5}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="
              w-full

              min-h-[160px]
              sm:min-h-[180px]

              rounded-lg
              border border-[rgba(24,27,58,0.10)]

              bg-white
              p-3

              text-sm
              outline-none
              resize-y

              focus:border-[var(--color-primary)]
            "
          />

          <button
            onClick={onSave}
            disabled={saving}
            className="
              w-full
              sm:w-auto

              rounded-lg

              px-4 py-2.5

              text-sm font-medium
              text-[var(--color-primary)]

              border border-[rgba(24,27,58,0.10)]
              bg-white

              hover:bg-[rgba(24,27,58,0.03)]
              active:scale-[0.98]
              transition

              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TemplatePanel;