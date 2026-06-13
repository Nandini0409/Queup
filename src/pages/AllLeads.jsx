import { useEffect, useState } from "react";

import { useCurrentUser } from "../hooks/useCurrentUser";

import { getLeads } from "../services/leads";

import { LEAD_STATUS } from "../constants/leadStatus";

import LeadDrawer from "../components/drawer/LeadDrawer";
import AddLeadModal from "../components/AddLeadModal";
import LeadCard from "../components/LeadCard";
import LeadStats from "../components/LeadStats";
import SearchInput from "../components/SearchInput";

const LEADS_PER_PAGE = 10;

function AllLeads() {
  const user = useCurrentUser();

  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] =
    useState(null)

  const [isAddLeadOpen, setIsAddLeadOpen] =
    useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  async function loadLeads() {
    if (!user) return;

    try {
      const data = await getLeads(user.id);

      setLeads(data);
    } catch (error) {
      console.error(error);
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
          .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "active") {
        return (
          lead.status !==
          LEAD_STATUS.INTERESTED &&
          lead.status !==
          LEAD_STATUS.COMPLETED
        );
      }

      if (filter === "interested") {
        return (
          lead.status ===
          LEAD_STATUS.INTERESTED
        );
      }

      if (filter === "completed") {
        return (
          lead.status ===
          LEAD_STATUS.COMPLETED
        );
      }

      return true;
    }
  );

  const totalPages = Math.ceil(
    filteredLeads.length /
    LEADS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    LEADS_PER_PAGE;

  const paginatedLeads =
    filteredLeads.slice(
      startIndex,
      startIndex +
      LEADS_PER_PAGE
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-6xl px-6 py-5">

        {/* MODALS */}

        {isAddLeadOpen && user && (
          <AddLeadModal
            userId={user.id}
            onClose={() =>
              setIsAddLeadOpen(false)
            }
            onLeadCreated={(lead) => {
              setLeads((prev) => [
                lead,
                ...prev,
              ]);
            }}
          />
        )}

        {selectedLead && (
          <LeadDrawer
            lead={selectedLead}
            onClose={() =>
              setSelectedLead(null)
            }
          />
        )}

        {/* HERO */}

        <div
          className="
            mb-5
            rounded-3xl
            bg-[var(--color-primary)]
            p-5
            text-white
          "
        >
          <div className="px-2 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                All Leads
              </h1>

              <p className="mt-1 text-white/70">
                Manage and review your outreach pipeline.
              </p>
            </div>

            <button
              onClick={() =>
                setIsAddLeadOpen(true)
              }
              className="
                rounded-xl
                bg-[var(--color-accent)]
                px-5
                py-3
                font-semibold
                text-[var(--color-primary)]
                transition
                hover:opacity-90
              "
            >
              + Add Lead
            </button>
          </div>
        </div>

        {/* STATS */}

        {/* <LeadStats leads={leads} /> */}

        {/* SEARCH + FILTERS */}

        <div
          className="
            mb-8
            rounded-2xl
            bg-white
            p-3
            shadow-sm
          "
        >
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder='Profile name, eg: "John Smith"'
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "active",
              "interested",
              "completed",
              "all",
            ].map((value) => (
              <button
                key={value}
                onClick={() =>
                  setFilter(value)
                }
                className={`
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition

                  ${filter === value
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-slate-200"
                  }
                `}
              >
                {value
                  .charAt(0)
                  .toUpperCase() +
                  value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* LEADS */}

        <div className="space-y-4">
          {paginatedLeads.map(
            (lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() =>
                  setSelectedLead(
                    lead
                  )
                }
              />
            )
          )}

          {paginatedLeads.length ===
            0 && (
              <div
                className="
                rounded-2xl
                bg-white
                py-16
                text-center
                shadow-sm
              "
              >
                <p
                  className="
                  text-[var(--color-text-secondary)]
                "
                >
                  No leads found.
                </p>
              </div>
            )}
        </div>

        {/* PAGINATION */}

        <div className="mt-8 flex justify-center gap-3">
          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
              )
            }
            className="
              rounded-xl
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              shadow-sm
              disabled:opacity-40
            "
          >
            Previous
          </button>

          <div
            className="
              flex
              items-center
              rounded-xl
              bg-white
              px-4
              text-sm
              shadow-sm
            "
          >
            Page {currentPage} of{" "}
            {totalPages || 1}
          </div>

          <button
            disabled={
              currentPage ===
              totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
              )
            }
            className="
              rounded-xl
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              shadow-sm
              disabled:opacity-40
            "
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default AllLeads;