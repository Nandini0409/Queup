function StatusBadge({ status }) {
  const config = {
    request_sent: {
      label: "Request Sent",
      className:
        "bg-blue-50 text-blue-700 border-blue-100",
    },

    initial_message_sent: {
      label: "Message Sent",
      className:
        "bg-indigo-50 text-indigo-700 border-indigo-100",
    },

    follow_up_1_sent: {
      label: "F1",
      className:
        "bg-violet-50 text-violet-700 border-violet-100",
    },

    follow_up_2_sent: {
      label: "F2",
      className:
        "bg-purple-50 text-purple-700 border-purple-100",
    },

    final_follow_up_sent: {
      label: "Final",
      className:
        "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
    },

    interested: {
      label: "Interested",
      className:
        "bg-green-50 text-green-700 border-green-100",
    },

    completed: {
      label: "Completed",
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    },
  };

  const current =
    config[status] || {
      label: status,
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5

        rounded-full
        border

        px-2.5
        sm:px-3

        py-1

        text-xs
        font-medium

        max-w-full

        ${current.className}
      `}
    >
      <span
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-current
          shrink-0
        "
      />

      <span className="truncate">
        {current.label}
      </span>
    </span>
  );
}

export default StatusBadge;