"use client";

import React from "react";
import { ArrowRight, LayoutDashboard, LogOut, PlayCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  clearEntryMode,
  hasActiveSession,
  setEntryMode,
  useEntryMode,
} from "@/hooks/use-entry-mode";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const entryMode = useEntryMode();
  const isHome = path === "/";
  const isAuthPage = path.startsWith("/sign-in") || path.startsWith("/sign-up");
  const isLoggedIn = hasActiveSession(entryMode);

  if (path.includes("/editor")) {
    return null; // Hide header on editor page
  }

  const modeLabel =
    entryMode === "demo"
      ? "Workspace"
      : entryMode === "signup"
        ? "Account"
        : entryMode === "signin"
          ? "Account"
          : "Ready";

  const handleDemoEnter = () => {
    setEntryMode("demo");
    router.push("/dashboard");
  };

  const handleLogout = () => {
    clearEntryMode();
    router.push("/");
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/12 bg-[#07131d]/70 px-5 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-7">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-text.png"
            alt="Pixxel Logo"
            className="min-w-24 object-cover"
            width={96}
            height={24}
          />
          <span className="hidden rounded-full border border-[#f9c784]/30 bg-[#f9c784]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f9c784] md:inline-flex">
            Studio AI
          </span>
        </Link>

        {isHome && (
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-white/72 transition-colors duration-300 hover:text-[#7ae7c7]"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-white/72 transition-colors duration-300 hover:text-[#7ae7c7]"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-white/72 transition-colors duration-300 hover:text-[#7ae7c7]"
            >
              Contact
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          {isHome && !isLoggedIn && (
            <>
              <Link href="/sign-in" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="rounded-full border border-white/12 px-5 text-white/80 hover:bg-white/8 hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up" className="hidden sm:block">
                <Button
                  variant="glass"
                  className="rounded-full border-[#7ae7c7]/25 bg-[#7ae7c7]/10 px-5 text-white hover:border-[#7ae7c7]/40 hover:bg-[#7ae7c7]/18"
                >
                  Sign up
                </Button>
              </Link>
              <Button
                variant="primary"
                onClick={handleDemoEnter}
                className="rounded-full bg-[#f97316] px-5 text-white shadow-[0_10px_40px_rgba(249,115,22,0.35)] hover:scale-[1.02] hover:bg-[#fb923c]"
              >
                <PlayCircle className="h-4 w-4" />
                Demo
              </Button>
            </>
          )}

          {isHome && isLoggedIn && (
            <>
              <Link href="/dashboard">
                <Button
                  variant="glass"
                  className="rounded-full border-white/12 bg-white/6 text-white hover:bg-white/12"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}

          {!isHome && (
            <>
              <Link href="/dashboard">
                <Button
                  variant="glass"
                  className="rounded-full border-white/12 bg-white/6 text-white hover:bg-white/12"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              {isAuthPage ? (
                <Button
                  variant="primary"
                  onClick={handleDemoEnter}
                  className="rounded-full bg-[#f97316] px-5 text-white hover:bg-[#fb923c]"
                >
                  <PlayCircle className="h-4 w-4" />
                  Demo
                </Button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white md:inline-flex"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-2 text-sm text-white/80">
                <span className="h-2 w-2 rounded-full bg-[#7ae7c7]" />
                {modeLabel}
              </div>
            </>
          )}

          {!isHome && !isAuthPage && (
            <Link href="/" className="hidden sm:block">
              <Button
                variant="ghost"
                className="rounded-full px-4 text-white/72 hover:bg-white/8 hover:text-white"
              >
                Home
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {!isHome && isAuthPage && (
            <Link href="/" className="hidden sm:block">
              <Button
                variant="ghost"
                className="rounded-full px-4 text-white/72 hover:bg-white/8 hover:text-white"
              >
                Back Home
              </Button>
            </Link>
          )}
          {!isHome && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-gradient-to-br from-[#7ae7c7]/25 to-[#f9c784]/30 text-sm font-bold text-white">
              {modeLabel[0]}
            </div>
          )}
          {isHome && (
            <Link href="/dashboard" className="hidden lg:block">
              <Button
                variant="ghost"
                className="rounded-full px-4 text-white/72 hover:bg-white/8 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:flex flex-nowrap">Dashboard</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
