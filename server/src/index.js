import http from "node:http";
import { fileURLToPath } from "node:url";
import { loadConfig, configIssues } from "./config.js";
import { openDb } from "./db.js";
import { SmtpMailer } from "./mailer.js";
import { IpApiIsProvider, NullProvider, IpRiskAssessmentService } from "./risk.js";
import { createApp } from "./app.js";

const cfg = loadConfig();
const issues = configIssues(cfg);
if (cfg.jwtKey.length < 32) {
  console.error("FATAL: JWT_SIGNING_KEY must be set (32+ characters). Refusing to start without it.");
  process.exit(1);
}
for (const i of issues) console.warn(`CONFIG MISSING: ${i}`);

const db = openDb(cfg.dbPath);
const provider = cfg.ipApiKey ? new IpApiIsProvider(cfg.ipApiKey) : new NullProvider();

async function verifyTurnstile(token, ip) {
  const form = new URLSearchParams({ secret: cfg.turnstileSecret, response: token });
  if (ip) form.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", body: form, signal: AbortSignal.timeout(5000)
  });
  return res.json();
}

const handler = createApp({
  db, cfg,
  mailer: new SmtpMailer(cfg.smtp),
  risk: new IpRiskAssessmentService(db, cfg, provider),
  verifyTurnstile: cfg.turnstileSecret ? verifyTurnstile : null,
  webRoot: fileURLToPath(new URL("../../web", import.meta.url))
});

http.createServer(handler).listen(cfg.port, () => console.log(`COMPIVOX server on :${cfg.port}`));
