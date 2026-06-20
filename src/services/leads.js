import { supabase } from "../lib/supabase"
import { LEAD_STATUS } from "../constants/leadStatus"

async function updateLeadStatus(
  leadId,
  status,
  nextFollowupDate = null
) {
  const { data, error } = await supabase
    .from("leads")
    .update({
      status,
      next_followup_date: nextFollowupDate,
    })
    .eq("id", leadId)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function createLead(
  userId,
  leadData
) {
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        user_id: userId,
        name: leadData.name,
        profile_url: leadData.profileUrl,
        notes: leadData.notes,
        status:
          LEAD_STATUS.REQUEST_SENT,
        next_followup_date: null,
      },
    ])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getLeads(userId) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    })

  if (error) throw error

  return data
}

export async function getLeadCount(userId) {
  const { count, error } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching lead count:", error);
    return 0;
  }

  return count || 0;
}


export async function getTodaysLeadsCount(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("leads")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  if (error) throw error;

  return data?.length || 0;
}


export async function getLeadById(
  leadId
) {
  const { data, error } =
    await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

  if (error) throw error;

  return data;
}


export async function deleteLead(leadId) {
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId);

  if (error) throw error;
}



export async function updateLeadNotes(
  leadId,
  notes
) {
  const { data, error } = await supabase
    .from("leads")
    .update({
      notes,
    })
    .eq("id", leadId)
    .select()
    .single()

  if (error) throw error

  return data
}


export async function searchLeadForAcceptance(
  userId,
  search
) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .eq(
      "status",
      LEAD_STATUS.REQUEST_SENT
    )
    .ilike("name", `%${search}%`)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

export async function searchRepliedLead(
  userId,
  search
) {
  console.log("i am running")
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", `%${search}%`)
    .in("status", [
      LEAD_STATUS.INITIAL_MESSAGE_SENT,
      LEAD_STATUS.FOLLOW_UP_1_SENT,
      LEAD_STATUS.FOLLOW_UP_2_SENT,
      LEAD_STATUS.FINAL_FOLLOW_UP_SENT,
    ])

  if (error) throw error

  return data
}

export async function getFollowUpsDueToday(
  userId
) {
  const today = new Date()
    .toISOString()
    .split("T")[0]

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .lte(
      "next_followup_date",
      today
    )
    .in("status", [
      LEAD_STATUS.INITIAL_MESSAGE_SENT,
      LEAD_STATUS.FOLLOW_UP_1_SENT,
      LEAD_STATUS.FOLLOW_UP_2_SENT,
    ])

  if (error) throw error

  return data
}

export async function markLeadInterested(
  leadId
) {
  return updateLeadStatus(
    leadId,
    LEAD_STATUS.INTERESTED
  )
}

export async function markCompleted(
  leadId
) {
  return updateLeadStatus(
    leadId,
    LEAD_STATUS.COMPLETED
  )
}

export async function markInitialMessageSent(
  leadId
) {
  const lead =
  await getLeadById(leadId);

if (
  lead.status !==
  LEAD_STATUS.REQUEST_SENT
) {
  throw new Error(
    "Lead is not eligible for Initial Message"
  );
}


  const nextDate = new Date()

  nextDate.setDate(
    nextDate.getDate() + 2
  )

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.INITIAL_MESSAGE_SENT,
    nextDate.toISOString()
  )
}

export async function markFollowup1Sent(
  leadId
) {
  const lead =
    await getLeadById(leadId);

  if (
    lead.status !==
    LEAD_STATUS.INITIAL_MESSAGE_SENT
  ) {
    throw new Error(
      "Lead is not eligible for Follow Up 1"
    );
  }
  const nextDate = new Date()

  nextDate.setDate(
    nextDate.getDate() + 3
  )

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FOLLOW_UP_1_SENT,
    nextDate
      .toISOString()
      .split("T")[0]
  )
}

export async function markFollowup2Sent(
  leadId
) {
  const lead =
    await getLeadById(leadId);

  if (
    lead.status !==
    LEAD_STATUS.FOLLOW_UP_1_SENT
  ) {
    throw new Error(
      "Lead is not eligible for Follow Up 2"
    );
  }

  const nextDate = new Date()

  nextDate.setDate(
    nextDate.getDate() + 3
  )

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FOLLOW_UP_2_SENT,
    nextDate
      .toISOString()
      .split("T")[0]
  )
}

export async function markFinalFollowupSent(
  leadId
) {
  const lead =
    await getLeadById(leadId);

  if (
    lead.status !==
    LEAD_STATUS.FOLLOW_UP_2_SENT
  ) {
    throw new Error(
      "Lead is not eligible for Final Follow Up"
    );
  }

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FINAL_FOLLOW_UP_SENT
  )
}