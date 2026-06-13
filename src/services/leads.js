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
    .ilike("name", `%${search}%`)
    .order("created_at", {
      ascending: false,
    })

  if (error) throw error

  return data
}

export async function searchRepliedLead(
  userId,
  search
) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", `%${search}%`)
    .in("status", [
      LEAD_STATUS.INITIAL_MESSAGE_SENT,
      LEAD_STATUS.FOLLOWUP1_SENT,
      LEAD_STATUS.FOLLOWUP2_SENT,
      LEAD_STATUS.FINAL_FOLLOWUP_SENT,
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
      LEAD_STATUS.FOLLOWUP1_SENT,
      LEAD_STATUS.FOLLOWUP2_SENT,
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
  const nextDate = new Date()

  nextDate.setDate(
    nextDate.getDate() + 3
  )

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FOLLOWUP1_SENT,
    nextDate
      .toISOString()
      .split("T")[0]
  )
}

export async function markFollowup2Sent(
  leadId
) {
  const nextDate = new Date()

  nextDate.setDate(
    nextDate.getDate() + 3
  )

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FOLLOWUP2_SENT,
    nextDate
      .toISOString()
      .split("T")[0]
  )
}

export async function markFinalFollowupSent(
  leadId
) {
  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FINAL_FOLLOWUP_SENT
  )
}