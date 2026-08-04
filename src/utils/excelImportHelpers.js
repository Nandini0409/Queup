import * as XLSX from "xlsx";
import { LEAD_STATUS } from "../constants/leadStatus";

const STATUS_MAP = {
  "request sent": LEAD_STATUS.REQUEST_SENT,
  "connection request sent": LEAD_STATUS.REQUEST_SENT,

  "initial message sent": LEAD_STATUS.INITIAL_MESSAGE_SENT,

  "follow up 1": LEAD_STATUS.FOLLOW_UP_1_SENT,
  "follow up 1 sent": LEAD_STATUS.FOLLOW_UP_1_SENT,

  "follow up 2": LEAD_STATUS.FOLLOW_UP_2_SENT,
  "follow up 2 sent": LEAD_STATUS.FOLLOW_UP_2_SENT,

  "final follow up": LEAD_STATUS.FINAL_FOLLOW_UP_SENT,
  "final follow up sent": LEAD_STATUS.FINAL_FOLLOW_UP_SENT,

  "interested": LEAD_STATUS.INTERESTED,

  "completed": LEAD_STATUS.COMPLETED,
};

function excelDateToISO(excelDate) {
  console.log(excelDate)
  if (
    excelDate === undefined ||
    excelDate === null ||
    excelDate === ""
  ) {
    return null;
  }

  const date = XLSX.SSF.parse_date_code(excelDate);

  return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
    date.d
  ).padStart(2, "0")}`;
}

function getNextFollowUp(status, lastContactDate) {

  // Request Sent doesn't need a last contact date
  if (status === LEAD_STATUS.REQUEST_SENT) {
    return {
      next_follow_up_date: null,
      next_follow_up_action:
        "Waiting for connection acceptance",
    };
  }

  // Interested doesn't follow the sequence
  if (status === LEAD_STATUS.INTERESTED) {
    return {
      next_follow_up_date: null,
      next_follow_up_action:
        "Continue conversation",
    };
  }

  // Completed doesn't need anything
  if (status === LEAD_STATUS.COMPLETED) {
    return {
      next_follow_up_date: null,
      next_follow_up_action:
        "No further action",
    };
  }

  // Final follow up is already the last outreach step
  if (status === LEAD_STATUS.FINAL_FOLLOW_UP_SENT) {
    return {
      next_follow_up_date: null,
      next_follow_up_action:
        "Close lead if no response",
    };
  }

  // Initial / Follow Up 1 / Follow Up 2 REQUIRE last contact date
  if (!lastContactDate) {
    return {
      next_follow_up_date: null,
      next_follow_up_action:
        "Add last contact date",
    };
  }

  const nextDate = new Date(lastContactDate);

  switch (status) {
    case LEAD_STATUS.INITIAL_MESSAGE_SENT:
      nextDate.setDate(nextDate.getDate() + 3);

      return {
        next_follow_up_date:
          nextDate.toISOString().split("T")[0],
        next_follow_up_action:
          "Send Follow Up 1",
      };

    case LEAD_STATUS.FOLLOW_UP_1_SENT:
      nextDate.setDate(nextDate.getDate() + 7);

      return {
        next_follow_up_date:
          nextDate.toISOString().split("T")[0],
        next_follow_up_action:
          "Send Follow Up 2",
      };

    case LEAD_STATUS.FOLLOW_UP_2_SENT:
      nextDate.setDate(nextDate.getDate() + 7);

      return {
        next_follow_up_date:
          nextDate.toISOString().split("T")[0],
        next_follow_up_action:
          "Send Final Follow Up",
      };

    default:
      return {
        next_follow_up_date: null,
        next_follow_up_action: null,
      };
  }
}

export function mapImportedLead(row) {
  const rowNumber = (row.__rowNum__ ?? 0) + 2;

  // Validate Lead Name
  if (!row["Profile Heading "]?.trim()) {
    throw new Error(
      `Row ${rowNumber}: Lead name is missing. Please fill the "Profile Heading" column.`
    );
  }

  // Validate Profile Link
  if (!row["Profile Link"]?.trim()) {
    throw new Error(
      `Row ${rowNumber}: Profile Link is missing.`
    );
  }

  // Normalize Status
  const rawStatus = String(
    row["Status"] ?? ""
  )
    .trim()
    .toLowerCase();

  // Validate Status
  const status = STATUS_MAP[rawStatus];

  if (!status) {
    throw new Error(
      `Row ${rowNumber}: "${row["Status"]}" isn't a supported status.

Allowed values are:

• Request Sent
• Initial Message Sent
• Follow Up 1 Sent
• Follow Up 2 Sent
• Final Follow Up Sent
• Interested
• Completed`
    );
  }

  // Convert dates
  const connectionRequestDate = excelDateToISO(
    row["Date of connection request"]
  );

  const lastContactDate = excelDateToISO(
    row["Date of Last Contact"]
  );

  if (
    !lastContactDate &&
    [
      LEAD_STATUS.INITIAL_MESSAGE_SENT,
      LEAD_STATUS.FOLLOW_UP_1_SENT,
      LEAD_STATUS.FOLLOW_UP_2_SENT,
    ].includes(status)
  ) {
    console.warn(
      `Row ${rowNumber}: Missing "Date of Last Contact". Queup imported this lead, but follow-ups can't be scheduled until this date is added.`
    );
  }

  // Calculate follow up
  const followUp = getNextFollowUp(
    status,
    lastContactDate
  );

  return {
    name: row["Profile Heading "].trim(),

    profile_heading:
      row["Profile Heading.1"]?.trim() || "",

    business_type:
      row["Type of Connection"]?.trim() || "",

    country:
      row["Country"]?.trim() || "",

    followers_count:
      Number(row["Number of Followers"]) || null,

    connections_count:
      Number(row["Number of connections"]) || null,

    connection_request_date:
      connectionRequestDate,

    last_contact_date:
      lastContactDate,

    status,

    ...followUp,

    remarks:
      row["Remarks"]?.trim() || null,

    profile_link:
      row["Profile Link"].trim(),
  };
}