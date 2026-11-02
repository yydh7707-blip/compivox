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

## API 및 사람 확인

```powershell
cd api
npm install
npm run migrate:local
npx wrangler dev
```

## 배포

- 웹과 API: Cloudflare Worker가 정적 웹과 API 게이트웨이를 함께 제공합니다.
- Worker는 Cloudflare Turnstile을 서버에서 확인하고, 짧은 수명의 일회용 확인을 D1에 저장합니다.
- 계정·기기 데이터는 기존 Render SQLite 데이터베이스에 유지됩니다. Worker는 공유 비밀 헤더로만 Render API에 전달하며, 공개 요청은 Worker에서 검증합니다.
- `docs/cloudflare-deploy-ko.md`에 D1, 비밀값, Render 원본 보호 및 도메인 연결 절차가 있습니다.

## Accounts backend (server/)

The Node 24 / SQLite service remains the private account-data origin to preserve existing accounts. It is not a public application endpoint: production startup requires `EDGE_PROXY_SECRET`, and requests are accepted only from the Cloudflare Worker. Accounts use an ID and password, and sign-up/sign-in require confirming the IP observed by the server.
