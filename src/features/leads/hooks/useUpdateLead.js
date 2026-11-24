import { useState } from "react";
import toast from "react-hot-toast";

import { updateLead } from "../services/leads";

export function useUpdateLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function editLead(leadId, leadData) {
    try {
      setLoading(true);
      setError(null);

      const updatedLead = await updateLead(
        leadId,
        leadData
      );

      toast.success("Lead updated");

      return updatedLead;
    } catch (err) {
      const message =
        err.message || "Failed to update lead";

      setError(message);
      toast.error(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    editLead,
    loading,
    error,
  };
}