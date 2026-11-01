const env = process.env;
const int = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d);
const policy = (v, d) => (["ALLOW", "CHALLENGE", "BLOCK"].includes((v || "").toUpperCase()) ? v.toUpperCase() : d);

export function loadConfig(overrides = {}) {
  return {
    port: int(env.PORT, 8080),
    nodeEnv: env.NODE_ENV || "development",
    publicUrl: env.PUBLIC_URL || "http://localhost:8080",
    dbPath: env.DATABASE_PATH || "./data/compivox.db",
    jwtKey: env.JWT_SIGNING_KEY || "",
    accessTtlSec: int(env.ACCESS_TOKEN_TTL_SEC, 15 * 60),
    refreshTtlSec: int(env.REFRESH_TOKEN_TTL_SEC, 30 * 24 * 3600),
    ipApiKey: env.IP_INTELLIGENCE_API_KEY || "",
    // direct | render | cloudflare
    ipTrust: (env.IP_TRUST || "direct").toLowerCase(),
    trustedHops: int(env.IP_TRUSTED_HOPS, 1),
    maxDevicesPerIp: int(env.MAX_DEVICES_PER_IP, 3),
    maxDevicesPerAccount: int(env.MAX_DEVICES_PER_ACCOUNT, 3),
    freeMonthlyBuilds: int(env.FREE_MONTHLY_BUILDS, 10),
    adminEmails: (env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
    adminUsers: (env.ADMIN_USERS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
    defaultPolicies: {
      mobile: policy(env.POLICY_MOBILE, "CHALLENGE"),
      vpn: policy(env.POLICY_VPN, "BLOCK"),
      proxy: policy(env.POLICY_PROXY, "BLOCK"),
      tor: policy(env.POLICY_TOR, "BLOCK"),
      datacenter: policy(env.POLICY_DATACENTER, "CHALLENGE"),
      unavailable: policy(env.POLICY_RISK_UNAVAILABLE, "CHALLENGE")
    },
    ...overrides
  };
}

export function configIssues(c) {
  const out = [];
  if (c.jwtKey.length < 32) out.push("JWT_SIGNING_KEY (32+ chars)");
  return out;
}
