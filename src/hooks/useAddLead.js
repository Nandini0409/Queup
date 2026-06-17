import { useState } from "react"
import toast from "react-hot-toast"

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

      toast.success(
        `${lead.name} added to queue`
      )

      return lead
    } catch (err) {
      const message =
        err.message ||
        "Failed to add lead!"

      setError(message)

      toast.error(message)

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