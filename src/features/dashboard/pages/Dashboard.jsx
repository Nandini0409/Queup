import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "../components/DashboardHeader";
import ReviewWindow from "../../outreach/components/ReviewWindow";
import AddLeadModal from "../../leads/components/AddLeadModal";
import ImportLeadsModal from "../../leads/components/ImportLeadsModal";
import FirstTimeOnboarding from "../components/FirstTimeOnboarding";

import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { getLeadCount } from "../../leads/services/leads";

function Dashboard() {
  console.log("hii in the dashboard")
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const [totalLeads, setTotalLeads] = useState(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Reset state when user changes
  useEffect(() => {
    setTotalLeads(null);
    setIsLoadingLeads(true);
  }, [user]);

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

  // Fetch lead count
  useEffect(() => {
    async function fetchLeads() {
      if (!user) return;

      setIsLoadingLeads(true);

      try {
        const count = await getLeadCount(user.id);
        setTotalLeads(count);
      } catch (err) {
        console.error("Failed to fetch lead count:", err);
        setTotalLeads(0);
      } finally {
        setIsLoadingLeads(false);
      }
    }

    fetchLeads();
  }, [user]);

  const isFirstTimeUser = totalLeads === 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-4xl px-3 sm:px-6">

        {/* HEADER */}
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

        {/* ADD LEAD MODAL */}
        {isAddLeadOpen && user && (
          <AddLeadModal
            userId={user.id}
            onClose={() => setIsAddLeadOpen(false)}
            onLeadCreated={() => {
              setTotalLeads((prev) =>
                prev === null ? 1 : prev + 1
              );
            }}
            mode="add"
          />
        )}

        {/* MAIN AREA */}
        <div
          id="inbox"
          className="
            mt-6 sm:mt-8
            rounded-2xl
            border border-[var(--color-border)]
            bg-[#f7f7f9]
            p-3 sm:p-5
            shadow-sm transition
            hover:shadow-md
          "
        >
          {/* HEADER ROW */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text)]">
              Today's Outreach
            </h2>

            <button
              onClick={() => navigate("/leads")}
              className="
                self-start sm:text-sm text-xs font-medium
                text-blue-600 hover:text-blue-700 hover:underline
                transition
              "
            >
              Open Lead Queue →
            </button>
          </div>

          {/* CONTENT STATE */}
          {isLoadingLeads ? (
            <div className="py-10 text-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : isFirstTimeUser ? (
            <FirstTimeOnboarding onAddLead={() => setIsAddLeadOpen(true)} />
          ) : (
            <ReviewWindow />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

