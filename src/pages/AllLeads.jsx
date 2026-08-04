import { useEffect, useState } from "react";

import { useCurrentUser } from "../hooks/useCurrentUser";

import { getLeads } from "../services/leads";
import { LEAD_STATUS } from "../constants/leadStatus";
import { useNavigate } from "react-router-dom";

import LeadDrawer from "../components/drawer/LeadDrawer";
import AddLeadModal from "../components/AddLeadModal";
import LeadCard from "../components/LeadCard";
import LeadStats from "../components/LeadStats";
import SearchInput from "../components/SearchInput";
import Header from "../components/DashboardHeader";
import ImportLeadsModal from "../components/ImportLeadsModal";

const LEADS_PER_PAGE = 50;

function AllLeads() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const awaitingAcceptanceCount = leads.filter(
    (lead) =>
      lead.status === LEAD_STATUS.REQUEST_SENT
  ).length;

  const inOutreachCount = leads.filter((lead) =>
    [
      LEAD_STATUS.INITIAL_MESSAGE_SENT,
      LEAD_STATUS.FOLLOW_UP_1_SENT,
      LEAD_STATUS.FOLLOW_UP_2_SENT,
      LEAD_STATUS.FINAL_FOLLOW_UP_SENT,
    ].includes(lead.status)
  ).length;

  const interestedCount = leads.filter(
    (lead) =>
      lead.status === LEAD_STATUS.INTERESTED
  ).length;

  const completedCount = leads.filter(
    (lead) =>
      lead.status === LEAD_STATUS.COMPLETED
  ).length;

  async function loadLeads() {
    if (!user) return;

    try {
      setLoading(true);

      const data =
        await getLeads(user.id);

      setLeads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const filteredLeads = leads.filter(
    (lead) => {
      const matchesSearch =
        lead.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      if (!matchesSearch)
        return false;

      switch (filter) {

        case "awaiting":
          return (
            lead.status === LEAD_STATUS.REQUEST_SENT
          );

        case "outreach":
          return [
            LEAD_STATUS.INITIAL_MESSAGE_SENT,
            LEAD_STATUS.FOLLOW_UP_1_SENT,
            LEAD_STATUS.FOLLOW_UP_2_SENT,
            LEAD_STATUS.FINAL_FOLLOW_UP_SENT,
          ].includes(lead.status);

        case "interested":
          return (
            lead.status === LEAD_STATUS.INTERESTED
          );

        case "completed":
          return (
            lead.status === LEAD_STATUS.COMPLETED
          );

        default:
          return true;
      }
    }
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredLeads.length /
      LEADS_PER_PAGE
    )
  );
  const startIndex = (currentPage - 1) * LEADS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + LEADS_PER_PAGE);


  const filters = [
    {
      value: "all",
      label: `All (${leads.length})`,
    },

    {
      value: "awaiting",
      label: `Awaiting Acceptance (${awaitingAcceptanceCount})`,
    },

    {
      value: "outreach",
      label: `In Outreach (${inOutreachCount})`,
    },

    {
      value: "interested",
      label: `Interested (${interestedCount})`,
    },

    {
      value: "completed",
      label: `Completed (${completedCount})`,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl px-3 sm:px-6">

        {selectedLead && (
          <LeadDrawer
            lead={selectedLead}
            onClose={() =>
              setSelectedLead(null)
            }
            onLeadDeleted={(deletedId) =>
              setLeads((prev) =>
                prev.filter(
                  (lead) => lead.id !== deletedId
                )
              )
            }
            mode="add"
          />
        )}

        <Header
          onAddLead={() => setIsAddLeadOpen(true)}
          onImportLeads={() => setIsImportOpen(true)}
        />

        {
          isImportOpen && (
            <ImportLeadsModal
              userId={user.id}
              onClose={() => setIsImportOpen(false)}
              onImportSuccess={() => {
                setIsImportOpen(false);
                loadLeads();
              }}
            />
          )
        }

        {isAddLeadOpen && user && (
          <AddLeadModal
            userId={user.id}
            onClose={() => setIsAddLeadOpen(false)}
            onLeadCreated={(lead) => {
              setLeads((prev) => [lead, ...prev]);
            }}
          />
        )}



        {/* PAGE HEADER */}
        <div
          className="
    mt-4
    mb-5

    flex
    flex-col
    gap-3

    sm:flex-row
    sm:items-start
    sm:justify-between
  "
        >
          <div>
            <h1
              className="
        text-2xl
        sm:text-3xl

        font-bold

        text-[var(--color-text)]
      "
            >
              Lead Queue
            </h1>

            <p
              className="
        mt-1
        text-sm
        sm:text-base

        text-[var(--color-text-secondary)]
      "
            >
              {filteredLeads.length} lead
              {filteredLeads.length !== 1 ? "s" : ""} in your outreach queue.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="
      self-start

      text-sm
      font-medium

      text-blue-600

      hover:text-blue-700
      hover:underline

      transition
    "
          >
            ← Back to Review Window
          </button>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="mt-4 mb-5 sm:mt-6 sm:mb-6 space-y-3">

          {/* SEARCH */}
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder='Profile name, eg: "John Smith"'
          />

          {/* FILTERS (MOBILE FRIENDLY SCROLL + DESKTOP CLEAN) */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">

            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`
          whitespace-nowrap

          rounded-full
          px-4 py-2

          text-sm font-medium

          transition

          ${filter === item.value
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-slate-50"
                  }
        `}
              >
                {item.label}
              </button>
            ))}

          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-[var(--color-border)]" />

        {/* LEADS */}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm">
                <div className="h-5 w-40 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-72 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-32 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}

            {paginatedLeads.length === 0 && (
              <div
                className="
      rounded-2xl
      border border-dashed
      border-[var(--color-border)]
      bg-white
      py-16
      text-center
      shadow-sm
    "
              >
                {leads.length === 0 ? (
                  <>
                    <p className="font-medium text-[var(--color-text)]">
                      No leads yet
                    </p>

                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                      Add your first lead to start building your outreach pipeline.
                    </p>

                    <button
                      onClick={() => setIsAddLeadOpen(true)}
                      className="
            mt-5
            rounded-xl
            bg-[var(--color-primary)]
            px-4 py-2
            text-sm font-medium
            text-white
            transition
            hover:opacity-90
          "
                    >
                      Add First Lead
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-[var(--color-text)]">
                      No matching leads
                    </p>

                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                      Try a different search term or filter.
                    </p>

                    <button
                      onClick={() => {
                        setSearch("");
                        setFilter("all");
                      }}
                      className="
            mt-5
            rounded-xl
            border
            border-[var(--color-border)]
            px-4 py-2
            text-sm font-medium
            text-[var(--color-primary)]
            transition
            hover:bg-slate-50
          "
                    >
                      Clear Filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-40"
          >
            Previous
          </button>
          <div className="flex items-center rounded-xl bg-white px-4 text-sm shadow-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default AllLeads;