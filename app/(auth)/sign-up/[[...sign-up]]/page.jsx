"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setEntryMode } from "@/hooks/use-entry-mode";

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return;
    }

    setIsSubmitting(true);
    setEntryMode("signup");
    await new Promise((resolve) => setTimeout(resolve, 700));
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-5xl px-6">
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#0a1823]/92 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-white/40">
              New workspace
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Create account</h1>
            <p className="mt-2 text-white/62">
              Set up your Pixxel account and start creating right away.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">
                Full name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Ava Johnson"
                className="h-12 rounded-2xl border-white/12 bg-white/6 text-white placeholder:text-white/35"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="ava@studio.com"
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
                value={form.password}
                onChange={(event) => handleChange("password", event.target.value)}
                placeholder="Create a password"
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
                  Building workspace...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-[#7ae7c7] hover:text-[#a6f5de]">
              Sign in
            </Link>
            .
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(122,231,199,0.18),rgba(10,24,35,0.92))] p-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-[#7ae7c7]">
            <Sparkles className="h-4 w-4" />
            Fast onboarding
          </div>
          <h2 className="mt-6 text-4xl font-semibold leading-tight">
            Get into the editor with a clean, simple setup flow.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/72">
            Create your account, land in the dashboard, and start working
            without extra friction.
          </p>

          <div className="mt-8 space-y-4 rounded-[28px] border border-white/10 bg-black/15 p-5">
            {[
              "A lightweight sign-up experience with direct dashboard access",
              "A faster workspace shortcut remains available whenever you want it",
              "Session state stays consistent across the app until logout",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-[#7ae7c7]" />
                <p className="text-white/78">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
