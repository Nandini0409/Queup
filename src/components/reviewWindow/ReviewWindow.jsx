import {
  MessageCircle,
  UserCheck,
  Clock3,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

import RepliedLeadsTab from "./RepliedLeadsTab";
import AcceptedConnectionsTab from "./AcceptedConnectionsTab";
import FollowUpsTab from "./FollowUpsTab";
import DailyProspectingCard from "./DailyProspectingCard";

function ReviewWindow() {
  const [prospectRefreshKey, setProspectRefreshKey] = useState(0);
  const sections = [
    {
      id: "replied",
      step: "Step 1",
      title: "Review Replies",
      description:
        "Check for new replies and update interested leads.",
      icon: MessageCircle,
      content: <RepliedLeadsTab />,
    },
    {
      id: "accepted",
      step: "Step 2",
      title: "Review Accepted Connections",
      description:
        "Check for newly accepted connections and send your first message.",
      icon: UserCheck,
      content: <AcceptedConnectionsTab />,
    },
    {
      id: "followups",
      step: "Step 3",
      title: "Send Follow-ups",
      description:
        "Reach out to leads who haven't replied yet.",
      icon: Clock3,
      content: <FollowUpsTab />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-6">

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-4 mb-10">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-[var(--color-primary)]">
            Finish today's outreach
          </h1>

          <p className="mt-3 text-sm text-[rgba(24,27,58,0.65)]">
            Review LinkedIn activity, send follow-ups, and keep your pipeline moving forward.
          </p>

          {/* WORKFLOW BAR */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

            <span
              className="
                rounded-full bg-white
                border border-[rgba(24,27,58,0.10)]
                px-4 py-2
                text-xs font-medium
                text-[var(--color-primary)]
              "
            >
              1. Review Replies
            </span>

            <span className="text-gray-300">→</span>

            <span
              className="
                rounded-full bg-white
                border border-[rgba(24,27,58,0.10)]
                px-4 py-2
                text-xs font-medium
                text-[var(--color-primary)]
              "
            >
              2. Accepted Connections
            </span>

            <span className="text-gray-300">→</span>

            <span
              className="
                rounded-full bg-white
                border border-[rgba(24,27,58,0.10)]
                px-4 py-2
                text-xs font-medium
                text-[var(--color-primary)]
              "
            >
              3. Follow-ups
            </span>

            <span className="text-gray-300">→</span>

            <span
              className="
                rounded-full bg-white
                border border-[rgba(24,27,58,0.10)]
                px-4 py-2
                text-xs font-medium
                text-[var(--color-primary)]
              "
            >
              4. Add Prospects
            </span>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 space-y-8">

        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <section
              key={section.id}
              className="
                relative rounded-2xl
                border border-[rgba(24,27,58,0.12)]
                bg-white shadow-sm
                transition-all duration-300
                hover:shadow-lg
              "
            >

              {/* LEFT ACCENT */}
              <div
                className="
                  absolute left-0 top-0 bottom-0
                  w-[4px]
                  bg-[var(--color-primary)]
                  rounded-l-2xl
                "
              />

              <div className="pl-6">

                {/* HEADER */}
                <div className="flex items-start gap-4 px-6 pt-6">

                  <div
                    className="
                      flex h-11 w-11 items-center justify-center
                      rounded-xl
                      bg-[rgba(24,27,58,0.06)]
                      text-[var(--color-primary)]
                    "
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1">

                    <span
                      className="
                        inline-flex items-center
                        rounded-full
                        bg-[rgba(24,27,58,0.08)]
                        px-3 py-1
                        text-xs font-semibold
                        text-[var(--color-primary)]
                        border border-[rgba(24,27,58,0.10)]
                      "
                    >
                      {section.step}
                    </span>

                    <h2
                      className="
                        mt-3
                        text-xl
                        font-semibold
                        text-[var(--color-primary)]
                      "
                    >
                      {section.title}
                    </h2>

                    <p
                      className="
                        mt-2
                        max-w-2xl
                        text-sm
                        text-[rgba(24,27,58,0.65)]
                      "
                    >
                      {section.description}
                    </p>

                  </div>

                </div>

                {/* BODY */}
                <div className="px-6 py-6">
                  {section.content}
                </div>

              </div>

            </section>
          );
        })}

        {/* STEP 4 */}
        <section
          className="
            relative rounded-2xl
            border border-[rgba(24,27,58,0.12)]
            bg-white shadow-sm
            transition-all duration-300
            hover:shadow-lg
          "
        >

          <div
            className="
              absolute left-0 top-0 bottom-0
              w-[4px]
              bg-[var(--color-primary)]
              rounded-l-2xl
            "
          />

          <div className="pl-6">

            <div className="flex items-start gap-4 px-6 pt-6">

              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  bg-[rgba(24,27,58,0.06)]
                  text-[var(--color-primary)]
                "
              >
                <UserPlus size={18} />
              </div>

              <div className="flex-1">

                <span
                  className="
                    inline-flex items-center
                    rounded-full
                    bg-[rgba(24,27,58,0.08)]
                    px-3 py-1
                    text-xs font-semibold
                    text-[var(--color-primary)]
                    border border-[rgba(24,27,58,0.10)]
                  "
                >
                  Step 4
                </span>

                <h2 className="mt-3 text-xl font-semibold text-[var(--color-primary)]">
                  Add Prospects
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-[rgba(24,27,58,0.65)]">
                  Add new prospects to keep your pipeline active.
                </p>

              </div>

            </div>

            <div className="px-6 py-6">
              <DailyProspectingCard />
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default ReviewWindow;