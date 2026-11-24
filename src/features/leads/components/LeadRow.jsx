export function LeadRowShell({ children }) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4

        sm:flex-row
        sm:items-center
        sm:justify-between
        text-center

        px-4
        py-4

        border-b
        border-[rgba(24,27,58,0.06)]

        transition
        hover:bg-[rgba(24,27,58,0.03)]
      "
    >
      {children}
    </div>
  );
}

export function LeadLeft({ title, subtitle }) {
  return (
    <div
      className="
        min-w-0
        flex-1
      "
    >
      <h4
        className="
          font-medium
          sm:text-left
          text-[var(--color-text)]
          break-words
        "
      >
        {title}
      </h4>

      {subtitle && (
        <p
          className="
            mt-1
            text-xs
            sm:text-left
            text-[rgba(24,27,58,0.55)]
            break-words
          "
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function LeadActions({
  primary,
  secondary,
  tertiary,
}) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2

        sm:flex-nowrap
        sm:gap-3

        w-full
        sm:w-auto
      "
    >
      {tertiary}
      {secondary}
      {primary}
    </div>
  );
}

function LeadRow({
  lead,
  subtitle,

  left,
  primary,
  secondary,
  tertiary,
}) {
  return (
    <LeadRowShell>
      {/* LEFT */}
      <LeadLeft
        title={lead?.name}
        subtitle={subtitle}
      />

      {/* RIGHT */}
      <LeadActions
        tertiary={tertiary}
        secondary={secondary}
        primary={primary}
      />
    </LeadRowShell>
  );
}

export default LeadRow;