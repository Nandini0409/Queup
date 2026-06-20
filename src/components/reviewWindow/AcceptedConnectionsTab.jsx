import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useCurrentUser } from "../../hooks/useCurrentUser";

import SearchInput from "../SearchInput";
import LeadDrawer from "../drawer/LeadDrawer";
import LeadRow from "../LeadRow";
import TemplatePanel from "../TemplatePanel";

import {
  searchLeadForAcceptance,
  markInitialMessageSent,
} from "../../services/leads";

import { createActivity } from "../../services/activities";

import {
  getTemplate,
  saveTemplate,
} from "../../services/templates";




function LeadRowSkeleton() {
  return (
    <div
      className="
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
        px-3 sm:px-4 py-4
        border-b border-[var(--color-border)]
      "
    >
      <div>
        <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-3 w-40 rounded bg-slate-100 animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="h-8 w-16 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-8 w-16 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-8 w-28 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}






function AcceptedConnectionsTab() {
  const user = useCurrentUser();

  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [markingId, setMarkingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  

  // LOAD TEMPLATE
  useEffect(() => {
    if (!user) return;

    async function loadTemplate() {
      try {
        const data = await getTemplate(user.id, "initial_message");
        setTemplate(
          data?.content ||
          `Hey {{firstName}}, Thanks for connecting!

[Briefly explain why you're reaching out]

[Ask a simple question or suggest a next step]`
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load template");
      }
    }

    loadTemplate();
  }, [user]);

  // SEARCH
  useEffect(() => {
    if (!user) return;

    async function searchLeads() {
      try {
        if (!search.trim()) {
          setLeads([]);
          return;
        }

        setLoading(true);

        const data = await searchLeadForAcceptance(
          user.id,
          search
        );

        setLeads(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to search leads");
      }
      finally {
        setLoading(false);
      }
    }

    searchLeads();
  }, [search, user]);

  // SAVE TEMPLATE
  const handleSaveTemplate = async () => {
    try {
      setSavingTemplate(true);

      if (!template.includes("{{firstName}}")) {
        toast("Missing {{firstName}} personalization", { icon: "⚠️" });
      }

      await saveTemplate(user.id, "initial_message", template);
      toast.success("Template saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save template");
    } finally {
      setSavingTemplate(false);
    }
  };

  // COPY MESSAGE
  const handleCopyMessage = async (lead) => {
    try {
      const firstName = lead.name.split(" ")[0];
      const message = template.replace("{{firstName}}", firstName);
      await navigator.clipboard.writeText(message);
      toast.success("Copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy message");
    }
  };

  // MARK SENT
  const handleInitialMessageSent = async (lead) => {
    try {
      setMarkingId(lead.id);

      const updatedLead = await markInitialMessageSent(lead.id);

      await createActivity(
        updatedLead.user_id,
        updatedLead.id,
        "initial_message_sent"
      );

      setLeads((prev) => prev.filter((item) => item.id !== lead.id));
      toast.success("Marked sent");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    } finally {
      setMarkingId(null);
    }
  };


  function handleLeadStatusChanged(
    updatedLead
  ) {
    setLeads((prev) =>
      prev.filter(
        (lead) =>
          lead.id !== updatedLead.id
      )
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">

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

      {/* ================= TEMPLATE (SOFT TOOL PANEL) ================= */}
      <TemplatePanel
        title="Initial Message Template"
        description="Customize the first message sent to new connections."
        template={template}
        setTemplate={setTemplate}
        showTemplate={showTemplate}
        onToggle={() =>
          setShowTemplate((prev) => !prev)
        }
        onSave={handleSaveTemplate}
        saving={savingTemplate}
      />

      {/* ================= SEARCH ================= */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by lead name..."
      />

      {/* INITIAL EMPTY STATE */}
      {!search.trim() ? (
        <div
          className="
      rounded-xl
      border border-dashed
      border-[var(--color-border)]
      bg-white
      p-5 sm:p-8
      text-center
    "
        >
          <p className="font-medium text-[var(--color-text)]">
            Search accepted connections
          </p>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Find leads who accepted your request and send the first message.
          </p>
        </div>
      ) : search && !loading && leads.length === 0 ? (
        <div
          className="
      rounded-xl
      border border-dashed
      border-[var(--color-border)]
      bg-white
      p-5 sm:p-8
      text-center
    "
        >
          <p className="font-medium text-[var(--color-text)]">
            No matching connections found
          </p>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Try a different name or spelling.
          </p>
        </div>
      ) : (
        <div
          className="
      overflow-hidden rounded-xl
      bg-white
      border border-[rgba(24,27,58,0.06)]
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
                subtitle="Ready for your first message?"
                tertiary={
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="
  w-full sm:w-auto
  text-xs px-3 py-2 rounded-lg
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
                secondary={
                  <button
                    onClick={() => handleCopyMessage(lead)}
                    className="
                w-full sm:w-auto
  text-xs px-3 py-2 rounded-lg
                border border-[rgba(24,27,58,0.10)]
                text-[rgba(5,5,12,0.85)]
                hover:text-[var(--color-primary)]
                hover:border-[var(--color-accent)]
                hover:bg-[rgba(200,230,107,0.08)]
                transition
              "
                  >
                    Copy
                  </button>
                }
                primary={
                  <button
                    onClick={() => handleInitialMessageSent(lead)}
                    disabled={markingId === lead.id}
                    className="
                w-full sm:w-auto
  rounded-lg bg-[var(--color-accent)]
  px-4 py-2 text-sm font-semibold
                text-[var(--color-primary)]
                transition
                hover:opacity-90
                active:scale-[0.98]
                disabled:opacity-50
              "
                  >
                    {markingId === lead.id
                      ? "Updating..."
                      : "Mark Sent"}
                  </button>
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AcceptedConnectionsTab;