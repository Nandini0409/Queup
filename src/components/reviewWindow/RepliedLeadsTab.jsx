import { useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

import SearchInput from "../SearchInput";
import LeadDrawer from "../drawer/LeadDrawer";
import LeadRow from "../LeadRow";

import toast from "react-hot-toast";

import {
  searchRepliedLead,
  markLeadInterested,
} from "../../services/leads";

import { createActivity } from "../../services/activities";

function LeadRowSkeleton() {
  return (
    <div
      className="
        flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
        px-3 sm:px-4 py-4
        border-b border-[var(--color-border)]
      "
    >
      <div className="min-w-0">
        <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-3 w-40 rounded bg-slate-100 animate-pulse" />
      </div>

      <div className="flex gap-2">
        <div className="h-8 w-16 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-8 w-28 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

function RepliedLeadsTab() {
  const user = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loadingLeadId, setLoadingLeadId] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function searchLeads() {
      try {
        if (!search.trim()) {
          setLeads([]);
          return;
        }

        setLoading(true);

        const data = await searchRepliedLead(
          user.id,
          search
        );

        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    searchLeads();
  }, [search, user]);

  const handleMarkInterested = async (lead) => {
    try {
      setLoadingLeadId(lead.id);

      const updatedLead = await markLeadInterested(
        lead.id
      );

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "marked_interested"
      );

      setLeads((prev) =>
        prev.filter((item) => item.id !== lead.id)
      );

      toast.success(
        `${lead.name} marked as interested`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    } finally {
      setLoadingLeadId(null);
    }
  };

  function handleLeadStatusChanged(updatedLead) {
    setLeads((prev) =>
      prev.filter(
        (lead) => lead.id !== updatedLead.id
      )
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder='Search lead (e.g. "John Smith")'
      />

      {!search.trim() ? (
        <div
          className="
            rounded-xl
            border border-dashed
            border-[var(--color-border)]
            bg-white
            p-6 sm:p-8
            text-center
          "
        >
          <p className="font-medium text-[var(--color-text)]">
            Search for a replied lead
          </p>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Start typing a lead's name to review replies.
          </p>
        </div>
      ) : search && !loading && leads.length === 0 ? (
        <div
          className="
            rounded-xl
            border border-dashed
            border-[var(--color-border)]
            bg-white
            p-6 sm:p-8
            text-center
          "
        >
          <p className="font-medium text-[var(--color-text)]">
            No matching leads found
          </p>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Try a different name or spelling.
          </p>
        </div>
      ) : (
        <div
          className="
            overflow-hidden
            rounded-xl
            border border-[var(--color-border)]
            bg-white
            shadow-sm
          "
        >
          {loading ? (
            <>
              <LeadRowSkeleton />
              <LeadRowSkeleton />
              <LeadRowSkeleton />
            </>
          ) : (
            leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                subtitle="Did they show interest?"
                tertiary={
                  <button
                    onClick={() =>
                      setSelectedLead(lead)
                    }
                    className="
                      w-full sm:w-auto
                      text-xs
                      px-3 py-2
                      rounded-lg
                      border border-[rgba(24,27,58,0.10)]
                      text-[rgba(5,5,12,0.85)]
                      hover:text-[var(--color-primary)]
                      hover:border-[var(--color-accent)]
                      hover:bg-[rgba(200,230,107,0.08)]
                      transition
                    "
                  >
                    View
                  </button>
                }
                primary={
                  <button
                    onClick={() =>
                      handleMarkInterested(lead)
                    }
                    disabled={
                      loadingLeadId === lead.id
                    }
                    className="
                      w-full sm:w-auto
                      rounded-lg
                      bg-[var(--color-accent)]
                      px-4 py-2
                      text-sm font-semibold
                      text-[var(--color-primary)]
                      transition
                      hover:opacity-90
                      active:scale-[0.98]
                      disabled:opacity-50
                    "
                  >
                    {loadingLeadId === lead.id
                      ? "Updating..."
                      : "Mark Interested"}
                  </button>
                }
              />
            ))
          )}
        </div>
      )}

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() =>
            setSelectedLead(null)
          }
          onLeadStatusChanged={
            handleLeadStatusChanged
          }
          onLeadDeleted={(deletedId) =>
              setLeads((prev) =>
                prev.filter(
                  (lead) => lead.id !== deletedId
                )
              )
            }
        />
      )}
    </div>
  );
}

export default RepliedLeadsTab;