import http from "node:http";
import { fileURLToPath } from "node:url";
import { loadConfig, configIssues } from "./config.js";
import { openDb } from "./db.js";
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

const handler = createApp({
  db, cfg,
  risk: new IpRiskAssessmentService(db, cfg, provider),
  webRoot: fileURLToPath(new URL("../../web", import.meta.url))
});

http.createServer(handler).listen(cfg.port, () => console.log(`COMPIVOX server on :${cfg.port}`));
