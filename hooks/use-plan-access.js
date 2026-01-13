// hooks/use-plan-access.js

export function usePlanAccess() {
  const isPro = true; // Demo mode: always pro
  const isFree = !isPro;

  // Define which tools are available for each plan
  const planAccess = {
    // Free plan tools
    resize: true,
    crop: true,
    adjust: true,
    text: true,

    // Pro-only tools
    background: isPro,
    ai_extender: isPro,
    ai_edit: isPro,
  };

  // Helper function to check if user has access to a specific tool
  const hasAccess = (toolId) => {
    return planAccess[toolId] === true;
  };

  // Get restricted tools that user doesn't have access to
  const getRestrictedTools = () => {
    return Object.entries(planAccess)
      .filter(([_, hasAccess]) => !hasAccess)
      .map(([toolId]) => toolId);
  };

  // Check if user has reached project limits
  const canCreateProject = (currentProjectCount) => {
    if (isPro) return true;
    return currentProjectCount < 3; // Free limit
  };

  // Check if user has reached export limits
  const canExport = (currentExportsThisMonth) => {
    if (isPro) return true;
    return currentExportsThisMonth < 20;
  };

  return {
    userPlan: isPro ? "pro" : "free_user",
    isPro,
    isFree,
    hasAccess,
    planAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
  };
}
