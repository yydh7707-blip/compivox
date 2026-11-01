// Masks configured secret values and credential-looking fields before anything reaches logs or responses.
const MIN_SECRET_LENGTH = 8;
const MASK = "[REDACTED]";

export function secretValues(cfg) {
  return [cfg.jwtKey, cfg.ipApiKey]
    .filter((v) => typeof v === "string" && v.length >= MIN_SECRET_LENGTH);
}

const CREDENTIAL_FIELD = /((?:token|secret|key|password|pass|authorization|pepper)["']?\s*[:=]\s*["']?)([^\s"',;&}]+)/gi;

export function redact(input, secrets = []) {
  let out = String(input ?? "");
  for (const s of secrets) out = out.split(s).join(MASK);
  return out.replace(CREDENTIAL_FIELD, (_, prefix) => prefix + MASK);
}
