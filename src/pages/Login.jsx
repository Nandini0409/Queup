import { supabase } from "../lib/supabase";
import QueupLogo from "/QueupLogo.png"
import QueupImg from "../assets/QueupImg.png";
import QueupDemo from "../assets/QueupDemo.mp4"

import {
  ArrowRight,
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
      title: "Never miss a follow-up",
      description:
        "Queup prepares today's follow-ups for you so you always know who needs a first, second, or final follow-up.",
    },
    {
      icon: Users,
      title: "Keep active conversations separate",
      description:
        "Quickly mark replied leads and keep engaged conversations organized instead of buried inside spreadsheets.",
    },
    {
      icon: LayoutPanelTop,
      title: "Complete outreach from one page",
      description:
        "Replies, accepted connections, follow-ups, templates, and daily prospecting—all managed from a single workspace.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* NAVBAR */}
<header
  className="
    sticky
    top-0
    z-20
    border-b
    border-[var(--color-border)]
    bg-white/70
    backdrop-blur-xl
  "
>
  <div
    className="
      mx-auto
      flex
      max-w-7xl
      items-center
      justify-between
      px-4
      py-3
      sm:px-6
    "
  >
    {/* Logo */}
    <div className="flex items-center gap-3">
      <img
        src={QueupLogo}
        alt="Queup"
        className="h-12 w-auto"
      />

    </div>

    {/* CTA */}
    <button
      onClick={handleGoogleLogin}
      className="
        inline-flex
        items-center
        justify-center
        rounded-xl
        bg-[var(--color-primary)]
        px-5
        py-2.5
        text-sm
        font-medium
        text-white
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      Get Started
    </button>
  </div>
</header>
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 -z-10">
            <div
              className="
        absolute
        left-1/2
        top-0
        h-[450px]
        w-[450px]
        -translate-x-1/2
        rounded-full
        bg-[rgba(200,230,107,0.15)]
        blur-3xl
      "
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-14">
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">

              {/* LEFT SIDE */}
              <div className="text-center lg:text-left">

                <h1
                  className="
            mt-6
            text-3xl
            font-bold
            leading-tight
            tracking-tight
            text-[var(--color-primary)]
            sm:text-5xl
          "
                >
                  Complete your daily outreach
                  from one workspace.
                </h1>

                <p
                  className="
            mx-auto
            mt-6
            max-w-md
            text-md
            sm:text-lg
            leading-relaxed
            text-[var(--color-text-secondary)]
            lg:mx-0
          "
                >
                  Track replies, send follow-ups, manage accepted
                  connections, and stay consistent—without juggling
                  spreadsheets.
                </p>

                <button
                  onClick={handleGoogleLogin}
                  className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-2xl
            bg-[var(--color-accent)]
            px-7
            py-4
            font-semibold
            text-[var(--color-primary)]
            shadow-lg
            transition
            hover:-translate-y-1
            hover:shadow-xl
          "
                >
                  Start for free
                  <ArrowRight className="h-5 w-5" />
                </button>

                <p
                  className="
            mt-4
            text-sm
            text-[var(--color-text-muted)]
          "
                >
                  No automation. Just a simpler outreach workflow.
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="relative">
                <img
                  src={QueupImg}
                  alt="Queup review workspace"
                  className="
            mx-auto
            w-full
            max-w-xl
            rounded-[32px]
            border
            border-[var(--color-border)]
            bg-white
            shadow-2xl
          "
                />
              </div>
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              See Queup in action
            </h2>

            <p className="mt-3 text-[var(--color-text-secondary)]">
              Watch how leads move from outreach to follow-ups in under a
              minute.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
            <div className="aspect-video">
              {/* Replace with your actual video */}
              <iframe
                className="h-full w-full"
                src={QueupDemo}
                title="Queup Demo"
                allowFullScreen
              />
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
              Built for people who do daily outreach and need structure, not
              more tools.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(200,230,107,0.18)]">
                    <Icon
                      size={20}
                      className="text-[var(--color-primary)]"
                    />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl bg-[var(--color-primary)] px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-bold">
              Ready to organize your outreach?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Stop juggling spreadsheets and keep every outreach task organized in one place.
            </p>

            <button
              onClick={handleGoogleLogin}
              className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-[var(--color-primary)] transition hover:opacity-90"
            >
              Get Started Free
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-20 border-t border-[var(--color-border)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Queup is an experiment in building better workflow tools for
                small teams and founders.
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Built by Nandini Dixit.
              </p>
            </div>

            <a
              href="https://www.linkedin.com/in/nandini-dixit-1830a825a/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Feedback or questions? Reach out →
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Login;