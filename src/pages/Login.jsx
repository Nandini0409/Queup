import { supabase } from "../lib/supabase"
import {
  CheckCircle2,
  CircleX,
  MessageSquare,
} from "lucide-react"
import QueupLogo from "../assets/logo2.png"

function Login() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[#181B3A]">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Replace with your logo */}
            <img
              src={QueupLogo}
              alt="Queup"
              className="h-14 w-auto"
            />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="rounded-xl bg-[#181B3A] px-5 py-2.5 font-medium text-white transition hover:opacity-90"
          >
            Login
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Clear the queue.
            <br />
            Focus on what matters.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            A daily outreach workspace that tells
            you exactly what to do next.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="mt-10 rounded-xl bg-[#91F230] px-8 py-4 text-lg font-bold text-[#181B3A] transition hover:opacity-90"
          >
            Continue with Google
          </button>

          <p className="mt-4 text-sm text-slate-400">
            No setup required.
          </p>
        </section>

        {/* BEFORE / AFTER */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* BEFORE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <CircleX className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-semibold">
                  Before
                </h2>
              </div>

              <ul className="space-y-4 text-slate-600">
                <li>Forgotten follow-ups</li>
                <li>Leads scattered across notes</li>
                <li>Unsure what to do next</li>
              </ul>
            </div>

            {/* AFTER */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">
                  After Queup
                </h2>
              </div>

              <ul className="space-y-4 text-slate-600">
                <li>Every follow-up tracked</li>
                <li>Organized outreach workflow</li>
                <li>Clear next action every day</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DEMO VIDEO */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">
              See Queup in action
            </h2>

            <p className="mt-3 text-slate-500">
              Watch how a complete outreach workflow
              is managed in under a minute.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex h-[400px] items-center justify-center bg-slate-100">
              <span className="text-slate-400">
                Demo Video Placeholder
              </span>
            </div>
          </div>
        </section>

        {/* FEEDBACK */}
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-10">
            <MessageSquare
              className="mx-auto mb-4 h-8 w-8"
              color="#181B3A"
            />

            <h2 className="text-2xl font-semibold">
              Building better workflow tools
            </h2>

            <p className="mt-4 text-slate-500">
              Have feedback, ideas, or a workflow
              challenge you're trying to solve?
            </p>

            <button className="mt-6 rounded-xl border border-slate-200 px-6 py-3 font-medium transition hover:bg-slate-50">
              Send Feedback
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Login
