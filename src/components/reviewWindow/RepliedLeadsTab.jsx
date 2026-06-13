import { useEffect, useState } from "react";

import { useCurrentUser } from "../../hooks/useCurrentUser";

import {
  searchRepliedLead,
  markLeadInterested,
} from "../../services/leads";

import { createActivity } from "../../services/activities";

function RepliedLeadsTab({
  onOpenLead,
}) {
  const user = useCurrentUser();

  const [search, setSearch] =
    useState("");

  const [leads, setLeads] =
    useState([]);

  useEffect(() => {
    if (!user) return;

    async function searchLeads() {
      try {
        if (!search.trim()) {
          setLeads([]);
          return;
        }

        const data =
          await searchRepliedLead(
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

  const handleMarkInterested =
    async (lead) => {
      try {
        const updatedLead =
          await markLeadInterested(
            lead.id
          );

        await createActivity(
          updatedLead.user_id,
          updatedLead.id,
          "marked_interested"
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
      <h2>Replied Leads</h2>

      <p>
        Did any leads reply?
      </p>

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
            No matching leads found.
          </p>
        )}

      {leads.map((lead) => (
        <div key={lead.id}>
          <h3>{lead.name}</h3>

          <p>
            Current Status:{" "}
            {lead.status}
          </p>

          <p>
            Notes:{" "}
            {lead.notes ||
              "No notes"}
          </p>

          <button
            onClick={() =>
              onOpenLead(lead)
            }
          >
            Open Lead
          </button>

          {lead.status ===
          "interested" ? (
            <p>
              Already marked
              interested
            </p>
          ) : (
            <button
              onClick={() =>
                handleMarkInterested(
                  lead
                )
              }
            >
              Mark Interested
            </button>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default RepliedLeadsTab;