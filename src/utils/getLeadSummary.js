import { getDueInfo } from "./../features/leads/utils/getLeadActionInfo";

export function getLeadSummary(lead) {
  const dueInfo = getDueInfo(lead.next_follow_up_date);

  switch (lead.status) {

    case "request_sent":
      return {
        heading: "Waiting for connection acceptance",

        description:
          "A connection request has been sent. Outreach will begin once the request is accepted.",

        recommendation: {
          title: "Wait for acceptance",
          timing: "No action required",
        },
      };

    case "initial_message_sent":
      return {
        heading: "Waiting for a response",

        description:
          "The initial message has been sent. Wait for the lead to respond before sending the next follow up.",

        recommendation: {
          title: "Send Follow Up 1",
          timing: dueInfo.text,
        },
      };

    case "follow_up_1_sent":
      return {
        heading: "Waiting after Follow Up 1",

        description:
          "Follow Up 1 has been sent. If the lead doesn't respond, send the next follow up when it's due.",

        recommendation: {
          title: "Send Follow Up 2",
          timing: dueInfo.text,
        },
      };

    case "follow_up_2_sent":
      return {
        heading: "Waiting after Follow Up 2",

        description:
          "If there's still no response, the next step is the final follow up when it becomes due.",

        recommendation: {
          title: "Send Final Follow Up",
          timing: dueInfo.text,
        },
      };

    case "final_follow_up_sent":
      return {
        heading: "Final follow up sent",

        description:
          "The final follow up has been sent. Wait for a response before closing this outreach.",

        recommendation: {
          title: "Close the lead if there's no response",
          timing: dueInfo.text,
        },
      };

    case "interested":
      return {
        heading: "Lead replied",

        description:
          "The lead has shown interest. Continue the conversation and qualify the opportunity.",

        recommendation: {
          title: "Continue the conversation",
          timing: "Respond as soon as possible",
        }
      };

    case "completed":
      return {
        heading: "Outreach completed",

        description:
          "The outreach sequence has finished without receiving a response. No further follow ups are scheduled.",

        recommendation: {
          title: "No further action",
          timing: "Completed",
        },
      };

    default:
      return {
        heading: "Outreach not started",

        description:
          "No outreach activity has been recorded for this lead yet.",

        recommendation: {
          title: "Begin outreach",
          timing: "When ready",
        },
      };
  }
}