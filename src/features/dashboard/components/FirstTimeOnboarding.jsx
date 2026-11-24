export default function FirstTimeOnboarding({ onAddLead }) {
  return (
    <div className="flex items-center justify-center bg-[var(--color-bg)] mt-9 sm:px-6">
      
      <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl sm:px-8 py-4 px-3 shadow-sm space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Welcome to Queup!
          </h1>

          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage your daily outreach in one place
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 space-y-2">
          <p className="font-semibold text-[var(--color-primary)] text-sm">
            Your daily workflow
          </p>

          <ul className="text-sm text-[var(--color-text-secondary)] space-y-1 list-disc ml-5">
            <li>Update replied leads</li>
            <li>Send messages to accepted connections</li>
            <li>Follow up with active leads</li>
            <li>Add new prospects</li>
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={onAddLead}
          className="
            w-full
            py-3
            rounded-xl
            font-semibold
            bg-[var(--color-primary)]
            text-white
            hover:opacity-90
            active:scale-[0.98]
            transition
          "
        >
          Add Your First Lead
        </button>

        {/* Accent hint */}
        <p className="text-xs text-center text-[var(--color-text-muted)]">
          Tip: You can always add leads later from the dashboard
        </p>

      </div>
    </div>
  );
}