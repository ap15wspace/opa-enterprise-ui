// ---------------------------------------------------------------------------
// OIDC / Auth configuration helper
// ---------------------------------------------------------------------------

export const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY ?? "",
  client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "",
  redirect_uri:
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "",
  post_logout_redirect_uri:
    typeof window !== "undefined" ? window.location.origin : "",
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
};
