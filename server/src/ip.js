import net from "node:net";

// Cloudflare published ranges (https://www.cloudflare.com/ips/). Refresh when Cloudflare updates them.
const CF_V4 = ["173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22", "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20", "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22"];
const CF_V6 = ["2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32"];

export function normalizeIp(raw) {
  if (!raw) return null;
  let s = String(raw).trim();
  if (s.startsWith("[")) s = s.slice(1, s.indexOf("]"));
  s = s.replace(/%.*$/, "");
  const m = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(s);
  if (m) s = m[1];
  const kind = net.isIP(s);
  if (!kind) return null;
  if (kind === 4) return s.split(".").map(Number).join(".");
  return expandV6(s);
}

function expandV6(s) {
  let [head, tail] = s.split("::");
  const h = head ? head.split(":") : [];
  const t = tail !== undefined && tail ? tail.split(":") : [];
  const fill = s.includes("::") ? new Array(8 - h.length - t.length).fill("0") : [];
  return [...h, ...fill, ...t].map((x) => parseInt(x, 16).toString(16)).join(":");
}

const cfList = new net.BlockList();
for (const c of CF_V4) { const [a, p] = c.split("/"); cfList.addSubnet(a, +p, "ipv4"); }
for (const c of CF_V6) { const [a, p] = c.split("/"); cfList.addSubnet(a, +p, "ipv6"); }

export function isCloudflareIp(ip) {
  const n = normalizeIp(ip);
  if (!n) return false;
  return cfList.check(n, net.isIPv6(n) ? "ipv6" : "ipv4");
}

export function isPrivateIp(ip) {
  const n = normalizeIp(ip);
  if (!n) return true;
  const bl = new net.BlockList();
  for (const [a, p] of [["10.0.0.0", 8], ["172.16.0.0", 12], ["192.168.0.0", 16], ["127.0.0.0", 8], ["169.254.0.0", 16], ["100.64.0.0", 10], ["0.0.0.0", 8]]) bl.addSubnet(a, p, "ipv4");
  for (const [a, p] of [["fc00::", 7], ["fe80::", 10], ["::1", 128], ["::", 128]]) bl.addSubnet(a, p, "ipv6");
  return bl.check(n, net.isIPv6(n) ? "ipv6" : "ipv4");
}

function xffList(req) {
  const h = req.headers["x-forwarded-for"];
  return h ? String(h).split(",").map((x) => normalizeIp(x)).filter(Boolean) : [];
}

/**
 * Resolves the client IP according to the configured trust mode.
 * Returns { ip, trusted, source }. Forwarding headers are ignored unless the mode explicitly trusts them.
 */
export function resolveClientIp(req, cfg) {
  const peer = normalizeIp(req.socket?.remoteAddress);
  if (cfg.ipTrust === "cloudflare") {
    const hops = xffList(req);
    // Behind a platform proxy the Cloudflare edge address is the right-most untrusted-by-us hop.
    const edge = hops.length ? hops[Math.max(0, hops.length - cfg.trustedHops)] : peer;
    const cf = normalizeIp(req.headers["cf-connecting-ip"]);
    if (cf && edge && isCloudflareIp(edge)) return { ip: cf, trusted: true, source: "cf-connecting-ip" };
    return { ip: edge || peer, trusted: false, source: "non-cloudflare" };
  }
  if (cfg.ipTrust === "render") {
    const hops = xffList(req);
    if (hops.length) return { ip: hops[Math.max(0, hops.length - cfg.trustedHops)], trusted: true, source: "x-forwarded-for" };
    return { ip: peer, trusted: false, source: "socket" };
  }
  return { ip: peer, trusted: true, source: "socket" };
}
