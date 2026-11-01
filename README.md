# COMPIVOX

COMPIVOX 공식 제품 소개 사이트와 API입니다.

## 구조

- `web/`: 정적 사이트 (한국어/영어 전환, 첫 화면 등장 애니메이션)
- `api/`: Cloudflare Worker API (`/api/health`, `/api/support`)
- `render.yaml`: Render 정적 사이트 설정 (`web/` 배포)

## 로컬 확인

```powershell
cd web
python -m http.server 8080
```

## API 확인

```powershell
cd api
npx wrangler dev
```

## 배포

- 웹: Render에서 `render.yaml`로 정적 사이트 생성
- API: `cd api; npx wrangler deploy`

## Accounts backend (server/)

Zero-framework Node 24 server (SQLite via node:sqlite) that serves web/ and /api. Run: cd server; npm install; set JWT_SIGNING_KEY (32+ chars) and IP_TRUST for your proxy; node src/index.js. Accounts use an ID and password. Sign-up and sign-in require the user to type the IP address detected by the server. The Cloudflare-style checkbox is visual only; password recovery is available only through the signed-in account page.
Deploy as a Render Node web service (see render.yaml), not a static site. The database is migrated in place: existing email accounts are assigned an ID from the email name and can continue signing in with their existing email during transition.
