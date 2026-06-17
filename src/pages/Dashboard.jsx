import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "../components/Header";
import ReviewWindow from "../components/reviewWindow/ReviewWindow";
import AddLeadModal from "../components/AddLeadModal";
import { useCurrentUser } from "../hooks/useCurrentUser";

function Dashboard() {
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-6xl px-6">

        {/* HEADER (ONLY CTA LOCATION) */}
        <Header onAddLead={() => setIsAddLeadOpen(true)} />

        {isAddLeadOpen && user && (
          <AddLeadModal
            userId={user.id}
            onClose={() => setIsAddLeadOpen(false)}
            onLeadCreated={() => {setIsAddLeadOpen(false)}}
            
          />
        )}

        

        {/* MAIN WORK AREA */}
        <div
          id="inbox"
          className="
            mt-8 rounded-2xl border border-[var(--color-border)]
            bg-[#f7f7f9] p-5 shadow-sm transition
            hover:shadow-md
          "
        >
          <div className=" flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Today's Outreach
              </h2>

            </div>

            <button
              onClick={() => navigate("/leads")}
              className="
                text-sm font-medium text-blue-600
                hover:text-blue-700 hover:underline transition
              "
            >
              Open full inbox →
            </button>
          </div>

          <ReviewWindow />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;