"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setEntryMode } from "@/hooks/use-entry-mode";

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const enterWorkspace = async (mode) => {
    setIsSubmitting(true);
    setEntryMode(mode);
    await new Promise((resolve) => setTimeout(resolve, 650));
    router.push("/dashboard");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }
    await enterWorkspace("signin");
  };

  return (
    <div className="w-full max-w-5xl px-6">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.18),rgba(10,24,35,0.92))] p-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-[#f9c784]">
            <Sparkles className="h-4 w-4" />
            Secure access
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Welcome back to Pixxel.
          </h1>
          <p className="mt-4 text-base leading-7 text-white/72">
            Sign in to continue working on your projects, or open the workspace
            instantly when you want a faster path.
          </p>

          <div className="mt-8 space-y-4 rounded-[28px] border border-white/10 bg-black/15 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">
                Quick access
              </p>
              <p className="mt-2 text-lg text-white/85">
                Jump straight into the product without filling in the form.
              </p>
            </div>
            <button
              onClick={() => enterWorkspace("demo")}
              disabled={isSubmitting}
              className="flex w-full items-center justify-between rounded-2xl border border-[#7ae7c7]/25 bg-[#7ae7c7]/10 px-5 py-4 text-left transition hover:bg-[#7ae7c7]/16 disabled:opacity-60"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#7ae7c7]">
                  Workspace mode
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Open instantly
                </p>
              </div>
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <PlayCircle className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#0a1823]/92 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-white/40">
              Account access
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Log in</h2>
            <p className="mt-2 text-white/62">
              Enter your details to continue into the editor workspace.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="alex@brandstudio.com"
                className="h-12 rounded-2xl border-white/12 bg-white/6 text-white placeholder:text-white/35"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-12 rounded-2xl border-white/12 bg-white/6 text-white placeholder:text-white/35"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="xl"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-[#f97316] text-white hover:bg-[#fb923c]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening workspace...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            New to Pixxel?{" "}
            <Link href="/sign-up" className="font-medium text-[#7ae7c7] hover:text-[#a6f5de]">
              Create an account
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
