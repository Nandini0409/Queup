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
      <div className="max-w-5xl mx-auto px-1 mb-10">
        <div className="text-center">

          <h1
            className="
        text-3xl
        sm:text-4xl
        font-bold
        leading-8
        text-[var(--color-primary)]
      "
          >
            Finish today's outreach
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[rgba(24,27,58,0.65)]">
            Review LinkedIn activity, send follow-ups, and keep your pipeline moving forward.
          </p>

          {/* WORKFLOW BAR */}
          <div
            className="
        mt-6

        flex
        flex-col
        sm:flex-row

        items-center
        justify-center

        gap-3
      "
          >
            {/* STEP 1 */}
            <span className="workflow-step">
              1. Review Replies
            </span>

            <span className="hidden sm:inline text-gray-300">
              →
            </span>

            {/* STEP 2 */}
            <span className="workflow-step">
              2. Accepted Connections
            </span>

            <span className="hidden sm:inline text-gray-300">
              →
            </span>

            {/* STEP 3 */}
            <span className="workflow-step">
              3. Follow-ups
            </span>

            <span className="hidden sm:inline text-gray-300">
              →
            </span>

            {/* STEP 4 */}
            <span className="workflow-step">
              4. Add Prospects
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="
    max-w-5xl
    mx-auto
    px-1
    space-y-6
    sm:space-y-8
  "
      >

        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <section
              key={section.id}
              className="
        relative

        rounded-xl
        sm:rounded-2xl

        border
        border-[rgba(24,27,58,0.12)]

        bg-white
        shadow-sm

        transition-all
        duration-300

        hover:shadow-md
        sm:hover:shadow-lg
      "
            >
              {/* LEFT ACCENT */}
              <div
                className="
          absolute
          left-0
          top-0
          bottom-0

          w-[3px]
          sm:w-[4px]

          bg-[var(--color-primary)]

          rounded-l-xl
          sm:rounded-l-2xl
        "
              />
              {/* STEP BADGE (TOP RIGHT) */}
  
  <span
  className="
    inline-flex
    items-center

    rounded-full

    bg-slate-100

    px-2
    py-0.5
    ml-2 mt-2
    text-[10px]
    sm:text-xs

    font-bold

    text-[rgba(15,17,37,0.55)]

    border
    border-[rgba(24,27,58,0.08)]
  "
>
  {section.step}
</span>


              <div className="pl-2 sm:pl-6">
                {/* HEADER */}
                <div
  className="
    relative

    flex
    items-center

    gap-3

    px-2
    sm:px-6

    pt-3
    sm:pt-6
  "
>
  
  {/* ICON */}
  <div
    className="
      flex
      h-9
      w-9
      sm:h-11
      sm:w-11

      shrink-0

      items-center
      justify-center

      rounded-lg
      sm:rounded-xl

      bg-[rgba(24,27,58,0.06)]

      text-[var(--color-primary)]
    "
  >
    <Icon size={16} />
  </div>

  {/* TEXT */}
  <div className="flex-1 min-w-0">

    <h2
      className="
        text-base
        sm:text-xl

        font-semibold

        text-[var(--color-primary)]
      "
    >
      {section.title}
    </h2>

    <p
      className="
        mt-1
        sm:mt-2

        text-xs
        sm:text-sm

        text-[rgba(24,27,58,0.65)]
      "
    >
      {section.description}
    </p>

  </div>
</div>

                {/* BODY */}
                <div
                  className="
            pr-3 pl-2
            sm:px-6

            py-4
            sm:py-6
          "
                >
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
          <span
  className="
    inline-flex
    items-center

    rounded-full

    bg-slate-100

    px-2
    py-0.5
    ml-2 mt-2
    text-[10px]
    sm:text-xs

    font-bold

    text-[rgba(15,17,37,0.55)]

    border
    border-[rgba(24,27,58,0.08)]
  "
>
  Step 4
</span>


          <div className="pl-3 sm:pl-6">

            <div className="
    relative

    flex
    items-center

    gap-3

    px-2
    sm:px-6

    pt-3
    sm:pt-6
  ">

              <div
    className="
      flex
      h-9
      w-9
      sm:h-11
      sm:w-11

      shrink-0

      items-center
      justify-center

      rounded-lg
      sm:rounded-xl

      bg-[rgba(24,27,58,0.06)]

      text-[var(--color-primary)]
    "
  >
                <UserPlus size={18} />
              </div>

               <div className="flex-1 min-w-0">

               <h2
      className="
        text-base
        sm:text-xl

        font-semibold

        text-[var(--color-primary)]
      "
    >
                  Add Prospects
                </h2>

                <p
      className="
        mt-1
        sm:mt-2

        text-xs
        sm:text-sm

        text-[rgba(24,27,58,0.65)]
      "
    >
                  Add new prospects to keep your pipeline active.
                </p>

              </div>

            </div>

            <div
                  className="
            px-3
            sm:px-6

            py-4
            sm:py-6
          "
            >
              <DailyProspectingCard />
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default ReviewWindow;