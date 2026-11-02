# COMPIVOX Cloudflare Worker 전환

Worker는 `compivox.xyz`의 정적 웹과 공개 API를 제공하고, 로그인·가입·기기 등록 앞에서 Turnstile 토큰을 서버 검증합니다. 계정 데이터는 기존 Render SQLite에 남겨 계정 이관 없이 전환합니다. Render 원본은 Worker만 접근할 수 있도록 `EDGE_PROXY_SECRET`을 확인합니다.

## 사전 준비

1. Cloudflare 계정에서 `compivox.xyz`가 활성화되어 있는지 확인합니다.
2. Turnstile 위젯을 만들고 허용 호스트에 `compivox.xyz`와 실제 사용하는 `www` 호스트를 등록합니다. Site Key는 공개 설정으로, Secret Key는 Worker secret으로만 등록합니다.
3. Render 서비스의 실제 `onrender.com` 원본 URL을 확인합니다. [api/wrangler.toml](../api/wrangler.toml)의 `COMPIVOX_ORIGIN`을 그 URL로 수정합니다.
4. Cloudflare D1 데이터베이스를 만들고 생성된 ID를 같은 파일의 `database_id`에 기록합니다.

## 비밀값 설정

Worker와 Render에 동일한 새 32자 이상의 무작위 `EDGE_PROXY_SECRET`을 설정합니다. 값은 저장소에 넣지 않습니다. Worker에서는 `api` 디렉터리에서 다음 명령으로 값을 안전하게 등록합니다.

```powershell
npx wrangler secret put EDGE_PROXY_SECRET
npx wrangler secret put TURNSTILE_SECRET
npx wrangler secret put RATE_LIMIT_PEPPER
```

Render 서비스의 Environment 설정에도 같은 `EDGE_PROXY_SECRET`을 추가합니다. Render의 `JWT_SIGNING_KEY`는 기존 값을 유지합니다. Worker의 일반 변수에는 Turnstile Site Key, `WEB_ORIGIN`, `EXPECTED_HOSTNAME`, `COMPIVOX_ORIGIN`을 설정합니다.

## 데이터베이스 및 Worker

`api` 디렉터리에서 로컬 migration과 Worker를 확인합니다.

```powershell
npm install
npm run migrate:local
npm run dev
```

운영 전 Cloudflare에서 D1 binding 이름이 `DB`인지, `compivox-edge` 원격 D1에 migration이 적용됐는지 확인합니다. 배포는 준비가 끝난 후에만 수행합니다.

```powershell
npm run migrate:remote
npm run deploy
```

Cloudflare Worker의 custom domain/route를 `compivox.xyz/*`에 연결하고, `www`를 운영한다면 같은 Worker로 연결합니다. 이후 사이트의 `/api/health`, `/api/security/turnstile-config` 및 회원가입·로그인·IP 확인·기기 등록을 확인합니다. Render 원본 URL을 공개 클라이언트 API로 사용하지 않습니다.

## 보안 및 롤백 주의

- 운영 배포 전에 Worker secret과 Render `EDGE_PROXY_SECRET`이 일치해야 합니다. Render는 이 값이 production에 없으면 기동을 거부합니다.
- Worker는 `login`, `register`, `ip_verify`, `device_register` 검증을 성공한 경우에만 D1의 일회용 확인을 소비하고 Render에 전달합니다. 검증 토큰은 저장하지 않고 SHA-256 해시만 짧게 보관합니다.
- Render `/api/health`는 플랫폼 health check를 위해 공개 상태로 유지됩니다. 계정 API와 정적 파일은 공유 비밀 헤더 없이는 응답하지 않습니다.
- Worker에서 문제가 생기면 DNS/route를 되돌릴 수 있지만, Worker 경유를 강제한 Render는 `EDGE_PROXY_SECRET`이 없으면 계정 API를 제공하지 않습니다. 원본 직접 공개로 되돌리기 전에 비밀 헤더 검사를 계획적으로 해제해야 합니다.
- 현재 변경은 코드와 배포 설정만 준비합니다. D1 생성, 비밀값 등록, Render 설정 변경, DNS/Worker 배포는 운영자의 승인과 Cloudflare/Render 접근이 필요한 별도 작업입니다.
