import { supabase } from "../lib/supabase"

export async function createActivity(
  userId,
  leadId,
  activityType
) {
  const { error } = await supabase
    .from("activities")
    .insert([
      {
        user_id: userId,
        lead_id: leadId,
        activity_type: activityType,
      },
    ])

  if (error) throw error
}


export async function deleteLead(leadId) {
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId);

  if (error) throw error;
}



export async function getLeadActivities(
  leadId
) {
  const { data, error } =
    await supabase
      .from("activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error

  return data
}