export function getDueInfo(dateString) {
  if (!dateString) {
    return {
      text: "",
      type: "none",
    };
  }

  const today = new Date();
  const dueDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.round(
    (dueDate - today) /
      (1000 * 60 * 60 * 24)
  );

  if (diffInDays > 1) {
    return {
      text: `Due in ${diffInDays} days`,
      type: "upcoming",
    };
  }

  if (diffInDays === 1) {
    return {
      text: "Due tomorrow",
      type: "upcoming",
    };
  }

  if (diffInDays === 0) {
    return {
      text: "Due today",
      type: "today",
    };
  }

  return {
    text: `Overdue by ${Math.abs(
      diffInDays
    )} day${
      Math.abs(diffInDays) > 1
        ? "s"
        : ""
    }`,
    type: "overdue",
  };
}




export function getLeadActionInfo(
  lead
) {
  const dueInfo = getDueInfo(
    lead.next_followup_date
  );

  switch (lead.status) {
    case "request_sent":
      return {
        title:
          "Connection Request Pending",
        subtitle:
          "Waiting for acceptance",
        type: "info",
      };

    case "initial_message_sent":
      return {
        title: "Send Follow Up 1",
        subtitle: dueInfo.text,
        type: dueInfo.type,
      };

    case "follow_up_1_sent":
      return {
        title: "Send Follow Up 2",
        subtitle: dueInfo.text,
        type: dueInfo.type,
      };

    case "follow_up_2_sent":
      return {
        title:
          "Send Final Follow Up",
        subtitle: dueInfo.text,
        type: dueInfo.type,
      };

    case "final_follow_up_sent":
      return {
        title: "Outreach Finished",
        subtitle: "Waiting for reply",
        type: "info",
      };

    case "interested":
      return {
        title: "Lead Replied",
        subtitle:
          "Conversation active",
        type: "success",
      };

    case "completed":
      return {
        title: "Outreach Closed",
        subtitle:
          "No response received",
        type: "info",
      };

    default:
      return {
        title: "No Action",
        subtitle: "",
        type: "info",
      };
  }
}