import {
  Plus,
  Upload,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
} from "react";

import QueupLogo from "/QueupLogo.png";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { supabase } from "../lib/supabase";

function Header({
  onAddLead,
  onImportLeads,
}) {
  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const userInitial =
    user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header
      className="
        sticky
        top-0
        z-30

        border-b
        border-[#acacac]

        bg-white/90
        backdrop-blur
      "
    >
      <div
        className="
          mx-auto
          flex
          items-center
          justify-between

          max-w-6xl

          px-4
          sm:px-6

          py-3
        "
      >
        {/* LOGO */}

        <img
          src={QueupLogo}
          alt="Queup"
          className="
            h-10
            sm:h-14

            w-auto
            shrink-0
          "
        />

        {/* RIGHT SIDE */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-3

            min-w-0
          "
        >
          <button
            onClick={onImportLeads}
            className="
    flex
    items-center
    justify-center
    gap-2

    w-9
    h-9
    sm:w-auto
    sm:h-auto

    rounded-full
    sm:rounded-xl

    border
    border-[var(--color-border)]

    bg-white
    text-[var(--color-primary)]

    transition
    hover:bg-slate-100

    px-0
    sm:px-4

    py-0
    sm:py-2.5

    font-semibold
  "
          >
            <Upload size={16} />

            <span className="hidden sm:inline">
              Import Leads
            </span>
          </button>
          {/* ADD LEAD */}

          <button
            onClick={onAddLead}
            className="
    flex
    items-center
    justify-center
    gap-2

    w-9
    h-9
    sm:w-auto
    sm:h-auto

    rounded-full
    sm:rounded-xl

    bg-[var(--color-accent)]
    text-white

    transition
    hover:opacity-90
    active:scale-[0.98]

    px-0
    sm:px-4

    py-0
    sm:py-2.5

    font-semibold
  "
          >
            <Plus size={16} />

            <span className="hidden sm:inline">
              Add Lead
            </span>
          </button>

          {/* PROFILE */}

          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              onClick={() =>
                setIsProfileOpen((p) => !p)
              }
              className="
                flex
                items-center
                gap-1
                sm:gap-2
              "
            >
              <div
                className="
                  h-9
                  w-9

                  rounded-full

                  bg-[var(--color-primary)]
                  hover:bg-[#3d476f]

                  text-white

                  flex
                  items-center
                  justify-center
                "
              >
                {userInitial}
              </div>

              <ChevronDown
                size={14}
                className="shrink-0"
              />
            </button>

            {isProfileOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-2

                  w-64
                  max-w-[90vw]

                  rounded-2xl

                  bg-white
                  shadow-xl

                  border
                  border-[var(--color-border)]
                "
              >
                <div
                  className="
                    px-4
                    py-3
                    border-b
                    border-[var(--color-border)]
                  "
                >
                  <p
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    Signed in as
                  </p>

                  <p
                    className="
                      text-sm
                      font-medium
                      truncate
                    "
                  >
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3

                    px-4
                    py-3

                    text-red-600

                    hover:bg-red-100
                  "
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