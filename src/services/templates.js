import { supabase } from "../lib/supabase"

export async function getTemplate(
  userId,
  templateType
) {
  const { data, error } =
    await supabase
      .from("templates")
      .select("*")
      .eq("user_id", userId)
      .eq(
        "template_type",
        templateType
      )
      .maybeSingle()

  if (error) throw error

  return data
}

export async function saveTemplate(
  userId,
  templateType,
  content
) {
  const { data, error } =
    await supabase
      .from("templates")
      .upsert(
        {
          user_id: userId,
          template_type:
            templateType,
          content,
        },
        {
          onConflict:
            "user_id,template_type",
        }
      )
      .select()
      .single()

  if (error) throw error

  return data
}