# COMPIVOX

COMPIVOX 공식 제품 소개 사이트와 API입니다.

## 구조

- `web/`: 정적 제품 사이트, 계정 UI 및 정책 페이지 (한국어/영어 제품 소개)
- `api/`: Cloudflare Worker, 정적 자산 라우팅 및 API 게이트웨이
- `server/`: Render에 배포하도록 구성된 비공개 계정 API와 SQLite

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

## 정책 및 서비스 안내

- `/privacy`, `/terms`, `/service-information`, `/legal-information`, `/faq`에서 개인정보 처리방침, 이용약관 및 공식 안내를 제공합니다.
- 신규 계정 생성은 이용약관 동의와 개인정보 처리방침 확인을 요구하며, 두 문서의 버전과 동의 시각을 SQLite의 `policy_acceptances`에 기록합니다.
- 운영자 법적 정보, 비공개 개인정보 문의 채널, 실제 호스팅·국외 이전 정보, 보유기간 및 미성년자 보호 절차는 운영자가 확인해야 합니다. 확인 목록과 정책 버전 변경 절차는 `docs/legal-operations-ko.md`를 참조하세요.
- 법률 안내는 일반 정보이며, 운영 전 구체적인 법률 전문가 확인을 대체하지 않습니다.
