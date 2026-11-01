import { now } from "./db.js";

/** Provider contract: assess(ip) -> { available, provider, flags?, asn?, org?, error? } */
export class IIpRiskProvider {
  get name() { return "none"; }
  async assess() { throw new Error("not implemented"); }
}

export class NullProvider extends IIpRiskProvider {
  get name() { return "none"; }
  async assess() { return { available: false, provider: this.name, error: "not_configured" }; }
}

// ipapi.is: https://ipapi.is/developers.html — key is sent in a POST body so it stays out of URLs and logs.
export class IpApiIsProvider extends IIpRiskProvider {
  constructor(apiKey, fetchImpl = fetch) { super(); this.key = apiKey; this.fetch = fetchImpl; }
  get name() { return "ipapi.is"; }
  async assess(ip) {
    try {
      const res = await this.fetch("https://api.ipapi.is/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ q: ip, key: this.key }),
        signal: AbortSignal.timeout(4000)
      });
      const d = await res.json();
      if (!res.ok || d.error) return { available: false, provider: this.name, error: d.error_code || `http_${res.status}` };
      if (typeof d.is_vpn !== "boolean" || typeof d.is_proxy !== "boolean") {
        return { available: false, provider: this.name, error: "no_security_fields" };
      }
      const asnObj = typeof d.asn === "object" && d.asn ? d.asn : null;
      return {
        available: true,
        provider: this.name,
        flags: {
          mobile: d.is_mobile === true,
          vpn: d.is_vpn === true,
          proxy: d.is_proxy === true,
          tor: d.is_tor === true,
          datacenter: d.is_datacenter === true,
          abuser: d.is_abuser === true
        },
        asn: asnObj ? `AS${asnObj.asn}` : (typeof d.asn === "string" ? d.asn : null),
        org: (typeof d.company === "object" ? d.company?.name : d.company) || asnObj?.org || null,
        networkType: (typeof d.company === "object" && d.company?.type) || null
      };
    } catch (e) {
      return { available: false, provider: this.name, error: e.name === "TimeoutError" ? "timeout" : "network_error" };
    }
  }
}

export class NetworkClassificationService {
  classify(raw) {
    if (!raw.available) return { type: "unknown", confidence: 0, flags: null };
    const f = raw.flags;
    let type = "residential_or_business";
    if (f.tor) type = "tor";
    else if (f.vpn) type = "vpn";
    else if (f.proxy) type = "proxy";
    else if (f.datacenter) type = "datacenter";
    else if (f.mobile) type = "mobile";
    // Residential VPNs and proxies can evade detection, so a clean result is never reported as certain.
    return { type, confidence: type === "residential_or_business" ? 0.6 : 0.9, flags: f };
  }
}

const RANK = { ALLOW: 0, CHALLENGE: 1, BLOCK: 2 };

export class AccessRiskPolicy {
  constructor(policies) { this.policies = policies; }
  decide(raw, cls) {
    if (!raw.available) return { action: this.policies.unavailable, reasons: ["risk_data_unavailable"] };
    const f = cls.flags;
    let action = "ALLOW";
    const reasons = [];
    const apply = (flag, key) => {
      if (!f[flag]) return;
      reasons.push(flag);
      if (RANK[this.policies[key]] > RANK[action]) action = this.policies[key];
    };
    apply("tor", "tor"); apply("vpn", "vpn"); apply("proxy", "proxy");
    apply("datacenter", "datacenter"); apply("mobile", "mobile");
    if (f.abuser) { reasons.push("abuser"); if (RANK.CHALLENGE > RANK[action]) action = "CHALLENGE"; }
    return { action, reasons };
  }
}

export function loadPolicies(db, cfg) {
  const p = { ...cfg.defaultPolicies };
  for (const r of db.prepare("SELECT key,value FROM settings WHERE key LIKE 'policy.%'").all()) {
    const k = r.key.slice(7);
    if (k in p && r.value in RANK) p[k] = r.value;
  }
  return p;
}

export class IpRiskAssessmentService {
  constructor(db, cfg, provider) { this.db = db; this.cfg = cfg; this.provider = provider; this.cls = new NetworkClassificationService(); }

  async assess(ip) {
    const cutoff = now() - 6 * 3600;
    const cached = this.db.prepare("SELECT result_json FROM ip_risk_assessments WHERE ip=? AND provider=? AND available=1 AND created_at>? ORDER BY id DESC LIMIT 1")
      .get(ip, this.provider.name, cutoff);
    let raw = cached ? JSON.parse(cached.result_json) : await this.provider.assess(ip);
    if (!cached) {
      this.db.prepare("INSERT INTO ip_risk_assessments(ip,provider,available,result_json,created_at) VALUES(?,?,?,?,?)")
        .run(ip, this.provider.name, raw.available ? 1 : 0, JSON.stringify(raw), now());
    }
    const classification = this.cls.classify(raw);
    const decision = new AccessRiskPolicy(loadPolicies(this.db, this.cfg)).decide(raw, classification);
    const score = !raw.available ? null : Math.min(100, (raw.flags.tor ? 90 : 0) + (raw.flags.vpn ? 70 : 0) + (raw.flags.proxy ? 70 : 0) + (raw.flags.datacenter ? 40 : 0) + (raw.flags.abuser ? 50 : 0) + (raw.flags.mobile ? 20 : 0));
    return {
      ip,
      assessed: raw.available,
      provider: this.provider.name,
      error: raw.available ? null : raw.error,
      asn: raw.asn ?? null,
      org: raw.org ?? null,
      networkType: classification.type,
      confidence: classification.confidence,
      flags: classification.flags,
      riskScore: score,
      action: decision.action,
      reasons: decision.reasons
    };
  }
}
