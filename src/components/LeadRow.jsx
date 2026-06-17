export function LeadRowShell({ children }) {
  return (
    <div
      className="
        flex items-center justify-between
        px-4 py-4
        border-b border-[rgba(24,27,58,0.06)]
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
    <div>
      <h4 className="font-medium text-[var(--color-text)]">
        {title}
      </h4>

      {subtitle && (
        <p className="mt-1 text-xs text-[rgba(24,27,58,0.55)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}


export function LeadActions({ primary, secondary, tertiary }) {
  return (
    <div className="flex items-center gap-3">
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