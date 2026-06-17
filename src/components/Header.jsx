import { Plus, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import QueupLogo from "../assets/QueupLogo.png";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { supabase } from "../lib/supabase";

function Header({ onAddLead }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = useCurrentUser();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 border-b border-[#acacac] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <img src={QueupLogo} className="h-14 w-auto" />
        <div className="flex items-center gap-3">
          <button
            onClick={onAddLead}
            className="flex items-center gap-2 rounded-xl transition
              hover:opacity-90
              hover:shadow-sm
              active:scale-[0.98] bg-[var(--color-accent)] px-4 py-2.5 font-semibold"
          >
            <Plus size={16} />
            Add Lead
          </button>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsProfileOpen((p) => !p)}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-full bg-[var(--color-primary)] hover:bg-[#3d476f] text-white flex items-center justify-center">
                {userInitial}
              </div>
              <ChevronDown size={16} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border-[--color-border] bg-white shadow-xl">
                <div className="px-4 py-3 border-[--color-secondary]">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;