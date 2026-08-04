import { supabase } from "../lib/supabase"
import { LEAD_STATUS } from "../constants/leadStatus"


export async function importLeads(userId, leads) {
  const leadsToInsert = leads.map((lead) => ({
    ...lead,
    user_id: userId,
  }));

  const { error } = await supabase
    .from("leads")
    .insert(leadsToInsert);

  if (error) throw error;
}



async function updateLeadStatus(
  leadId,
  status,
  next_follow_up_date = null,
  next_follow_up_action = null
) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("leads")
    .update({
      status,
      last_contact_date: today,
      next_follow_up_date: next_follow_up_date,
      next_follow_up_action: next_follow_up_action,
    })
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw error;

  return data;
}


export async function updateLead(
  leadId,
  leadData
) {
  const { data, error } = await supabase
    .from("leads")
    .update({
      name: leadData.name.trim(),
      profile_link: leadData.profile_link.trim(),
      profile_heading: leadData.profile_heading.trim(),
      business_type: leadData.business_type.trim(),
      country: leadData.country.trim(),
      followers_count: leadData.followers_count,
      connections_count: leadData.connections_count,
    })
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw error;

  return data;
}


export async function createLead(
  userId,
  leadData
) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        user_id: userId,
        name: leadData.name.trim(),
        profile_link:
          leadData.profile_link.trim(),
        profile_heading:
          leadData.profile_heading.trim(),
        business_type:
          leadData.business_type.trim(),
        country:
          leadData.country.trim(),
        followers_count:
          leadData.followers_count,
        connections_count:
          leadData.connections_count,
        remarks:
          leadData.remarks.trim(),

        // Outreach
        status: LEAD_STATUS.REQUEST_SENT,
        connection_request_date: today,
        last_contact_date: today,

        // No follow-up scheduled until the connection is accepted
        next_follow_up_date: null,
        next_follow_up_action:
          "Wait for Connection Acceptance",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
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



export async function updateLeadRemarks(
  leadId,
  remarks
) {
  const { data, error } = await supabase
    .from("leads")
    .update({
      remarks,
    })
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw error;

  return data;
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
      "next_follow_up_date",
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

export async function markLeadCompleted(
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
  const lead = await getLeadById(leadId);

  if (
    lead.status !==
    LEAD_STATUS.REQUEST_SENT
  ) {
    throw new Error(
      "Lead is not eligible for Initial Message."
    );
  }

  const nextDate = new Date();

  nextDate.setDate(
    nextDate.getDate() + 3
  );

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.INITIAL_MESSAGE_SENT,
    nextDate
      .toISOString()
      .split("T")[0],
    "Send Follow Up 1"
  );
}

export async function markFollowup1Sent(
  leadId
) {
  const lead = await getLeadById(leadId);

  if (
    lead.status !==
    LEAD_STATUS.INITIAL_MESSAGE_SENT
  ) {
    throw new Error(
      "Lead is not eligible for Follow Up 1."
    );
  }

  const nextDate = new Date();

  nextDate.setDate(
    nextDate.getDate() + 7
  );

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FOLLOW_UP_1_SENT,
    nextDate
      .toISOString()
      .split("T")[0],
    "Send Follow Up 2"
  );
}

export async function markFollowup2Sent(
  leadId
) {
  const lead = await getLeadById(leadId);

  if (
    lead.status !==
    LEAD_STATUS.FOLLOW_UP_1_SENT
  ) {
    throw new Error(
      "Lead is not eligible for Follow Up 2."
    );
  }

  const nextDate = new Date();

  nextDate.setDate(
    nextDate.getDate() + 7
  );

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FOLLOW_UP_2_SENT,
    nextDate
      .toISOString()
      .split("T")[0],
    "Send Final Follow Up"
  );
}

export async function markFinalFollowupSent(
  leadId
) {
  const lead = await getLeadById(leadId);

  if (
    lead.status !==
    LEAD_STATUS.FOLLOW_UP_2_SENT
  ) {
    throw new Error(
      "Lead is not eligible for Final Follow Up."
    );
  }

  return updateLeadStatus(
    leadId,
    LEAD_STATUS.FINAL_FOLLOW_UP_SENT,
    null,
    "Mark as Completed"
  );
}