"use client";

import React, { useEffect, useState } from "react";
import { Plus, Image, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useDemoUser } from "@/hooks/use-demo-user";
import { hasActiveSession, useEntryMode } from "@/hooks/use-entry-mode";
import { api } from "@/convex/_generated/api";
import { NewProjectModal } from "./_components/new-project-modal";
import { ProjectGrid } from "./_components/project-grid";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const entryMode = useEntryMode();
  const hasSession = hasActiveSession(entryMode);
  const { isReady, isLoading: isBootstrappingUser, error: bootstrapError } =
    useDemoUser();

  useEffect(() => {
    if (entryMode !== null && !hasSession) {
      router.replace("/sign-in");
    }
  }, [entryMode, hasSession, router]);

  // Get user's projects
  const { data: projects, isLoading: isProjectsLoading } = useConvexQuery(
    api.projects.getUserProjects,
    hasSession && isReady ? {} : "skip"
  );

  const isLoading = entryMode === null || isBootstrappingUser || isProjectsLoading;

  if (bootstrapError && hasSession) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">
            <h1 className="text-2xl font-bold mb-2">Workspace Unavailable</h1>
            <p className="text-red-100/80">
              We couldn&apos;t load your workspace right now. Please refresh and try
              again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your Projects
            </h1>
            <p className="text-white/70">
              Create and manage your AI-powered image designs
            </p>
          </div>

          <Button
            onClick={() => setShowNewProjectModal(true)}
            variant="primary"
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>

        {/* Projects Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : projects && projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <EmptyState onCreateProject={() => setShowNewProjectModal(true)} />
        )}

        {/* New Project Modal */}
        <NewProjectModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
        />
      </div>
    </div>
  );
}

// Empty state when user has no projects
function EmptyState({ onCreateProject }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6">
        <Image className="h-12 w-12 text-cyan-400" />
      </div>

      <h3 className="text-2xl font-semibold text-white mb-3">
        Create Your First Project
      </h3>

      <p className="text-white/70 mb-8 max-w-md">
        Upload an image to start editing with our powerful AI tools, or create a
        blank canvas to design from scratch.
      </p>

      <Button
        onClick={onCreateProject}
        variant="primary"
        size="xl"
        className="gap-2"
      >
        <Sparkles className="h-5 w-5" />
        Start Creating
      </Button>
    </div>
  );
}
