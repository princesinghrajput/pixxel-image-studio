import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DEMO_TOKEN_IDENTIFIER = "demo-user-identifier";

async function getDemoUser(ctx) {
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", DEMO_TOKEN_IDENTIFIER)
    )
    .unique();
}

async function ensureDemoUser(ctx) {
  const user = await getDemoUser(ctx);

  if (user) {
    return user;
  }

  const now = Date.now();
  const userId = await ctx.db.insert("users", {
    name: "Demo User",
    tokenIdentifier: DEMO_TOKEN_IDENTIFIER,
    email: "demo@pixxel.app",
    imageUrl: "",
    plan: "pro",
    projectsUsed: 0,
    exportsThisMonth: 0,
    createdAt: now,
    lastActiveAt: now,
  });

  return await ctx.db.get(userId);
}

// Get all projects for the current user
export const getUserProjects = query({
  handler: async (ctx) => {
    const user = await getDemoUser(ctx);

    if (!user) {
      return [];
    }

    // Get user's projects, ordered by most recently updated
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user_updated", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return projects;
  },
});

// Create a new project
export const create = mutation({
  args: {
    title: v.string(),
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    width: v.number(),
    height: v.number(),
    canvasState: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ensureDemoUser(ctx);

    // Check plan limits for free users
    if (user.plan === "free") {
      const projectCount = await ctx.db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      if (projectCount.length >= 3) {
        throw new Error(
          "Free plan limited to 3 projects. Upgrade to Pro for unlimited projects."
        );
      }
    }

    // Create the project
    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      userId: user._id,
      originalImageUrl: args.originalImageUrl,
      currentImageUrl: args.currentImageUrl,
      thumbnailUrl: args.thumbnailUrl,
      width: args.width,
      height: args.height,
      canvasState: args.canvasState,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user's project count
    await ctx.db.patch(user._id, {
      projectsUsed: user.projectsUsed + 1,
      lastActiveAt: Date.now(),
    });

    return projectId;
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await ensureDemoUser(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    // Delete the project
    await ctx.db.delete(args.projectId);

    // Update user's project count
    await ctx.db.patch(user._id, {
      projectsUsed: Math.max(0, user.projectsUsed - 1),
      lastActiveAt: Date.now(),
    });

    return { success: true };
  },
});

// Get a single project by ID
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await getDemoUser(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    return project;
  },
});

// Update project canvas state and metadata
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    canvasState: v.optional(v.any()),
    width: v.optional(v.number()), // ← Add this
    height: v.optional(v.number()), // ← Add this
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    activeTransformations: v.optional(v.string()),
    backgroundRemoved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ensureDemoUser(ctx);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    // Update the project
    const updateData = {
      updatedAt: Date.now(),
    };

    // Only update provided fields
    if (args.canvasState !== undefined)
      updateData.canvasState = args.canvasState;
    if (args.width !== undefined) updateData.width = args.width;
    if (args.height !== undefined) updateData.height = args.height;
    if (args.currentImageUrl !== undefined)
      updateData.currentImageUrl = args.currentImageUrl;
    if (args.thumbnailUrl !== undefined)
      updateData.thumbnailUrl = args.thumbnailUrl;
    if (args.activeTransformations !== undefined)
      updateData.activeTransformations = args.activeTransformations;
    if (args.backgroundRemoved !== undefined)
      updateData.backgroundRemoved = args.backgroundRemoved;

    await ctx.db.patch(args.projectId, updateData);

    // Update user's last active time
    await ctx.db.patch(user._id, {
      lastActiveAt: Date.now(),
    });

    return args.projectId;
  },
});
