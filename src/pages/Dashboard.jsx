import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

import { useCurrentUser } from "../hooks/useCurrentUser"

import AddLeadModal from "../components/AddLeadModal"
import ReviewWindow from "../components/reviewWindow/ReviewWindow"

function Dashboard() {
  const navigate = useNavigate()
  const user = useCurrentUser()

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-3xl font-bold text-[#181B3A]">
              Queup
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Clear the queue. Focus on what matters.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="
              rounded-xl
              border
              border-[#E2E8F0]
              px-4
              py-2
              text-sm
              font-medium
              text-[#64748B]
              transition
              hover:bg-[#F8FAFC]
              hover:text-[#181B3A]
            "
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#181B3A]">
            Daily Outreach Review
          </h2>
          <p className="mt-2 text-[#64748B]">
            Complete today's outreach tasks and get back to important work.
          </p>
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          {/* Primary Action */}
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="
              rounded-xl
              bg-[#181B3A]
              px-5
              py-3
              font-medium
              text-white
              transition
              hover:bg-[#23274A]
            "
          >
            + Add Lead
          </button>

          {/* Secondary Action with Lime Accent Highlight */}
          <button
            onClick={() => navigate("/leads")}
            className="
              group
              relative
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              px-5
              py-3
              font-medium
              text-[#181B3A]
              transition
              hover:border-[#C8E66B]
              hover:bg-[#F8FAFC]
            "
          >
            View All Leads
            {/* Soft active indicator dot using Lime */}
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#C8E66B]" />
          </button>
        </div>

        {/* Review Window */}
        <div
          className="
            rounded-3xl
            border
            border-[#E2E8F0]
            bg-white
            p-6
            shadow-sm
          "
        >
          <ReviewWindow />
        </div>
      </main>

      {/* Modal */}
      {isAddLeadOpen && (
        <AddLeadModal
          userId={user?.id}
          onClose={() =>
            setIsAddLeadOpen(false)
          }
        />
      )}
    </div>
  )
}

export default Dashboard