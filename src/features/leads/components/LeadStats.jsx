function LeadStats({ leads }) {
  const activeLeads =
    leads.filter(
      (lead) =>
        lead.status !== "interested" &&
        lead.status !== "completed"
    ).length;

  const interestedLeads =
    leads.filter(
      (lead) =>
        lead.status === "interested"
    ).length;

  const completedLeads =
    leads.filter(
      (lead) =>
        lead.status === "completed"
    ).length;

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        title="Total"
        value={leads.length}
      />

      <StatCard
        title="Active"
        value={activeLeads}
      />

      <StatCard
        title="Interested"
        value={interestedLeads}
      />

      <StatCard
        title="Completed"
        value={completedLeads}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-card)]
        p-5
      "
    >
      <p
        className="
          text-sm
          text-[var(--color-text-secondary)]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-2
          text-3xl
          font-bold
          text-[var(--color-text)]
        "
      >
        {value}
      </p>
    </div>
  );
}

export default LeadStats;