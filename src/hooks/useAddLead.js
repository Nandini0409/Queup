import { useState } from "react"

import { createLead } from "../services/leads"
import { createActivity } from "../services/activities"

export function useAddLead() {
  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState(null)

  async function addLead(
    userId,
    leadData
  ) {
    try {
      setLoading(true)
      setError(null)

      const lead =
        await createLead(
          userId,
          leadData
        )

      await createActivity(
        userId,
        lead.id,
        "lead_added"
      )

      return lead
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    addLead,
    loading,
    error,
  }
}