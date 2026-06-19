import { supabase } from "../lib/supabase";
import QueupLogo from "../assets/QueupLogo.png";
import QueupImg from "../assets/QueupImg.png"

import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  BellRing,
  Users,
  LayoutPanelTop,
} from "lucide-react";

function Login() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const features = [
  {
    icon: BellRing,
    title: "Stop wondering who to follow up with",
    description:
      "Know exactly which leads need attention today and never lose track of a conversation.",
  },
  {
    icon: Users,
    title: "Focus on people who replied",
    description:
      "Keep engaged leads separate from cold outreach so you know where your time matters most.",
  },
  {
    icon: LayoutPanelTop,
    title: "Handle outreach from one place",
    description:
      "Templates, notes, lead updates, and context all inside a single workflow.",
  },
];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(255,255,255,0.75)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <img
            src={QueupLogo}
            alt="Queup"
            className="h-14 w-auto"
          />

          <button
            onClick={handleGoogleLogin}
            className="
              rounded-xl
              bg-[var(--color-primary)]
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            Login
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
<section className="relative overflow-hidden">
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(200,230,107,0.08)] to-transparent" />

  <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
    <h1
      className="
        text-4xl
        font-bold
        tracking-tight
        sm:text-6xl
      "
    >
      Finish today's outreach
      <br />
      without the chaos.
    </h1>

    <p
      className="
        mx-auto
        mt-5
        max-w-2xl
        text-base
        leading-relaxed
        text-[var(--color-text-secondary)]
        sm:text-lg
      "
    >
      Know who needs attention, track every conversation,
      and manage follow-ups from one focused workspace.
    </p>

    <button
      onClick={handleGoogleLogin}
      className="
        mt-8
        inline-flex
        items-center
        gap-2
        rounded-xl
        bg-[var(--color-accent)]
        px-6
        py-3
        font-semibold
        text-[var(--color-primary)]
        transition
        hover:opacity-90
      "
    >
      Continue with Google
      <ArrowRight className="h-5 w-5" />
    </button>
  </div>
</section>



        {/* DEMO */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
  See Queup in action
</h2>

<p className="mt-3 text-[var(--color-text-secondary)]">
  Watch how leads move from outreach to follow-ups in under a minute.
</p>
          </div>

          <div
            className="
              mt-10
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-white
              p-6
              shadow-sm
            "
          >
            <div
              className="
                flex
                h-[260px]
                sm:h-[500px]
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-bg)]
                text-[var(--color-text-muted)]
              "
            >
              Demo Video Placeholder
            </div>
          </div>
        </section>


        {/* FEATURES */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Stay consistent without the chaos
            </h2>

            <p className="mt-3 text-[var(--color-text-secondary)]">
              Built for people who do daily outreach and need structure, not more tools.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="
                    rounded-3xl
                    border
                    border-[var(--color-border)]
                    bg-white
                    p-6
                    shadow-sm
                    transition
                    hover:shadow-md
                  "
                >
                  <div
                    className="
                      mb-4
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[rgba(200,230,107,0.18)]
                    "
                  >
                    <Icon
                      size={20}
                      className="text-[var(--color-primary)]"
                    />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-relaxed
                      text-[var(--color-text-secondary)]
                    "
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>


        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
  <div
    className="
      rounded-3xl
      border
      border-[var(--color-border)]
      bg-white
      p-10
      text-center
      shadow-sm
    "
  >
    <MessageSquare
      className="
        mx-auto
        mb-5
        h-8
        w-8
        text-[var(--color-primary)]
      "
    />

    <p
      className="
        text-sm
        uppercase
        tracking-wider
        text-[var(--color-text-muted)]
      "
    >
      Built by Nandini Dixit
    </p>

    <h2
      className="
        mt-3
        text-2xl
        font-bold
        sm:text-3xl
      "
    >
      Queup started from a workflow that felt harder than it should.
    </h2>

    <button
      className="
        mt-8
        rounded-xl
        bg-[var(--color-primary)]
        px-6
        py-3
        font-medium
        text-white
        transition
        hover:opacity-90
      "
    >
      Connect on LinkedIn
    </button>
  </div>
</section>
      </main>
    </div>
  );
}

export default Login;