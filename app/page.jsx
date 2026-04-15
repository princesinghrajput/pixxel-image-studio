"use client";

import FeaturesSection from "@/components/features";
import InteractiveStats from "@/components/interactive-stats";
import PricingSection from "@/components/pricing";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Layers3,
  PlayCircle,
  Sparkles,
  Wand2,
} from "lucide-react";
import { setEntryMode } from "@/hooks/use-entry-mode";

const proofPoints = [
  "AI background cleanup",
  "Smart resize and crop",
  "Instant workspace access",
];

const featureCards = [
  {
    icon: Wand2,
    title: "Generative edits",
    copy: "Retouch, extend, and transform images without leaving the editor.",
  },
  {
    icon: Layers3,
    title: "Flexible canvas",
    copy: "Work with layered controls, reusable states, and polished exports.",
  },
  {
    icon: PlayCircle,
    title: "Fast start",
    copy: "Open the workspace in one click when you want immediate access.",
  },
];

function HeroPanel({ onWorkspaceEnter }) {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-36 md:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.2),_transparent_28%),radial-gradient(circle_at_80%_15%,_rgba(122,231,199,0.18),_transparent_24%),linear-gradient(180deg,_rgba(7,19,29,0)_0%,_rgba(7,19,29,0.9)_100%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f9c784]/25 bg-[#f9c784]/10 px-4 py-2 text-sm font-medium text-[#f9c784]">
            <Sparkles className="h-4 w-4" />
            Modern AI image editor
          </div>

          <h1
            className="text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl font-semibold tracking-tight"
          >
            Create polished visuals in a workspace built for speed.
          </h1>

          <p
            className="mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg"
          >
            Crop, resize, retouch, and enhance images in a clean editor that
            feels premium from the first click.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button
                variant="primary"
                size="xl"
                className="w-full rounded-full bg-[#f97316] px-7 text-white shadow-[0_16px_50px_rgba(249,115,22,0.35)] hover:bg-[#fb923c] sm:w-auto"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                variant="glass"
                size="xl"
                className="w-full rounded-full border-white/12 bg-white/7 px-7 text-white hover:bg-white/12 sm:w-auto"
              >
                Sign in
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="xl"
              onClick={onWorkspaceEnter}
              className="w-full rounded-full border border-[#7ae7c7]/30 bg-[#7ae7c7]/10 px-7 text-[#d7fff2] hover:bg-[#7ae7c7]/16 sm:w-auto"
            >
              <PlayCircle className="h-4 w-4" />
              Open workspace
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {proofPoints.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72"
              >
                <CheckCircle2 className="h-4 w-4 text-[#7ae7c7]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[34px] bg-gradient-to-br from-[#f97316]/20 via-transparent to-[#7ae7c7]/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#0a1823]/92 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Pixxel Workspace</p>
                <p className="text-xs text-white/55">
                  A cleaner way to start creating
                </p>
              </div>
              <div className="rounded-full bg-[#7ae7c7]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7ae7c7]">
                Live
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/45">
                    Sign in
                  </span>
                  <Link
                    href="/sign-in"
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/75 transition hover:bg-white/12"
                  >
                    Open
                  </Link>
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Pick up where you left off
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Return to your projects, edits, and exports without friction.
                </p>
              </div>

              <div className="rounded-[28px] border border-[#f97316]/30 bg-[#f97316]/12 px-5 py-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/45">
                    Workspace mode
                  </span>
                  <button
                    onClick={onWorkspaceEnter}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/75 transition hover:bg-white/12"
                  >
                    Open
                  </button>
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Start instantly
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Jump directly into the product when you want a faster way to
                  explore the workspace.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(122,231,199,0.15),rgba(249,199,132,0.16))] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                    Fast start
                  </p>
                  <p className="mt-2 text-4xl font-semibold text-white">
                    Ready in seconds
                  </p>
                </div>
                <div className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80">
                  Seamless
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/64">
                The product opens through a clean account flow, with a faster
                workspace shortcut available whenever you want it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="px-6 py-12 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        {featureCards.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="rounded-[30px] border border-white/10 bg-[#0a1823]/85 p-7"
          >
            <div className="mb-5 inline-flex rounded-2xl border border-white/10 bg-white/8 p-3 text-[#f9c784]">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/62">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  const router = useRouter();

  const handleWorkspaceEnter = () => {
    setEntryMode("demo");
    router.push("/dashboard");
  };

  return (
    <div className="relative overflow-hidden pb-24">
      <div className="absolute inset-0 -z-10 bg-[#07131d]" />
      <HeroPanel onWorkspaceEnter={handleWorkspaceEnter} />
      <ValueStrip />
      <InteractiveStats />
      <FeaturesSection />
      <PricingSection />

      <section id="contact" className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.18),rgba(122,231,199,0.12))] p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f9c784]">
            Built to move fast
          </p>
          <h2
            className="mt-4 text-4xl text-white md:text-5xl font-semibold tracking-tight"
          >
            Start creating with a cleaner front door.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/72">
            Sign in when you want the full account path, or open the workspace
            directly when speed matters most.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button
                variant="primary"
                size="xl"
                className="w-full rounded-full bg-[#f97316] px-8 text-white hover:bg-[#fb923c] sm:w-auto"
              >
                Create account
              </Button>
            </Link>
            <Button
              variant="glass"
              size="xl"
              onClick={handleWorkspaceEnter}
              className="w-full rounded-full border-white/12 bg-white/8 px-8 text-white hover:bg-white/12 sm:w-auto"
            >
              Open workspace
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
