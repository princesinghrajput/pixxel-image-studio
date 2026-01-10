import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DEMO_TOKEN_IDENTIFIER = "demo-user-identifier";
const DEMO_USER = {
  name: "Demo User",
  tokenIdentifier: DEMO_TOKEN_IDENTIFIER,
  email: "demo@pixxel.app",
  imageUrl: "",
  plan: "pro",
  projectsUsed: 0,
  exportsThisMonth: 0,
};

async function getDemoUser(ctx) {
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", DEMO_TOKEN_IDENTIFIER)
    )
    .unique();
}

async function ensureDemoUserRecord(ctx) {
  const user = await getDemoUser(ctx);

  if (user !== null) {
    return user._id;
  }

  return await ctx.db.insert("users", {
    ...DEMO_USER,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  });
}

export const ensureDemoUser = mutation({
  args: {},
  handler: ensureDemoUserRecord,
});

export const store = mutation({
  args: {},
  handler: ensureDemoUserRecord,
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const user = await getDemoUser(ctx);
    return user ?? null;
  },
});
