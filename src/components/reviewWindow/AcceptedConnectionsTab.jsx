import { useEffect, useState } from "react";

import { useCurrentUser } from "../../hooks/useCurrentUser";

import {
  searchLeadForAcceptance,
  markInitialMessageSent,
} from "../../services/leads";

import {
  createActivity,
} from "../../services/activities";

import {
  getTemplate,
  saveTemplate,
} from "../../services/templates";

function AcceptedConnectionsTab() {
  const user = useCurrentUser();

  const [search, setSearch] =
    useState("");

  const [leads, setLeads] =
    useState([]);

  const [template, setTemplate] =
    useState("");

  const [
    savingTemplate,
    setSavingTemplate,
  ] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function loadTemplate() {
      try {
        const data =
          await getTemplate(
            user.id,
            "initial_message"
          );

        if (data) {
          setTemplate(
            data.content
          );
        } else {
          setTemplate(
            `Hi {{firstName}},

Just following up on my previous message.`
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadTemplate();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    async function searchLeads() {
      try {
        if (!search.trim()) {
          setLeads([]);
          return;
        }

        const data =
          await searchLeadForAcceptance(
            user.id,
            search
          );

        setLeads(data);
      } catch (error) {
        console.error(error);
      }
    }

    searchLeads();
  }, [search, user]);

  const handleSaveTemplate =
    async () => {
      try {
        setSavingTemplate(true);

        await saveTemplate(
          user.id,
          "initial_message",
          template
        );
      } catch (error) {
        console.error(error);
      } finally {
        setSavingTemplate(false);
      }
    };

  const handleCopyMessage =
    async (lead) => {
      try {
        const firstName =
          lead.name.split(" ")[0];

        const message =
          template.replace(
            "{{firstName}}",
            firstName
          );

        await navigator.clipboard.writeText(
          message
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleInitialMessageSent =
    async (lead) => {
      try {
        const updatedLead =
          await markInitialMessageSent(
            lead.id
          );

        await createActivity(
          updatedLead.user_id,
          updatedLead.id,
          "initial_message_sent"
        );

        setLeads((prev) =>
          prev.map((item) =>
            item.id === lead.id
              ? updatedLead
              : item
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <h2>
        Accepted Connections
      </h2>

      <p>
        Did any connection
        requests get accepted?
      </p>

      <h3>
        General Template
      </h3>

      <textarea
        rows={6}
        value={template}
        onChange={(e) =>
          setTemplate(
            e.target.value
          )
        }
      />

      <button
        onClick={
          handleSaveTemplate
        }
      >
        {savingTemplate
          ? "Saving..."
          : "Save Template"}
      </button>

      <hr />

      <input
        type="text"
        placeholder="Search Lead"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <hr />

      {search &&
        leads.length === 0 && (
          <p>
            No matching leads
            found.
          </p>
        )}

      {leads.map((lead) => (
        <div key={lead.id}>
          <h3>{lead.name}</h3>

          <p>
            Status:{" "}
            {lead.status}
          </p>

          <p>
            Notes:{" "}
            {lead.notes ||
              "No notes"}
          </p>

          {lead.status ===
          "request_sent" ? (
            <>
              <button
                onClick={() =>
                  handleCopyMessage(
                    lead
                  )
                }
              >
                Copy Message
              </button>

              <a
                href={
                  lead.profile_url
                }
                target="_blank"
                rel="noreferrer"
              >
                Open LinkedIn
              </a>

              <button
                onClick={() =>
                  handleInitialMessageSent(
                    lead
                  )
                }
              >
                Initial Message
                Sent
              </button>
            </>
          ) : (
            <>
              <p>
                This lead is
                no longer waiting
                for an initial
                message.
              </p>

              <a
                href={
                  lead.profile_url
                }
                target="_blank"
                rel="noreferrer"
              >
                Open LinkedIn
              </a>
            </>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default AcceptedConnectionsTab;