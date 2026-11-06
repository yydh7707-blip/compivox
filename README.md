# Compivox: KeyRush

COMPIVOX 웹사이트와 API입니다. 기본 웹 화면은 PC와 모바일에서 플레이하는 싱글 플레이 키 입력 게임 KeyRush입니다.

## 구조

- `web/`: KeyRush 게임 UI와 정책 페이지
- `api/`: Cloudflare Worker, 정적 자산 라우팅, KeyRush API 및 D1 마이그레이션
- `server/`: Render에 배포하도록 구성된 비공개 계정 API와 SQLite

## 로컬 확인

```powershell
cd api
npm install
npm run migrate:local
npm run dev
```

게임 화면은 Worker 정적 자산으로 제공되며, 게임 계정·공식 맵·플레이 기록은 로컬 D1에 저장됩니다. 브라우저 번들은 `web` 폴더에서 `npm install` 및 `npm run build`로 생성합니다.

로컬 Worker에서 계정 가입 및 API를 시험하려면 `api/.dev.vars`에 개발용 `ENVIRONMENT=development`, `KEYRUSH_DEV_ORIGINS`와 필수 Worker 비밀값을 설정합니다. 실제 비밀값을 저장소에 커밋하지 마세요.

```powershell
cd web
npm install
npm run build
```

## 계정 및 공식 맵 관리

- 가입 계정은 플레이 기록을 저장하고 Keyboard 및 Touch 랭킹에 참가합니다. 점수는 완료된 입력 이벤트를 서버에서 검증해 계산합니다.
- 맵 생성·수정·공개·삭제와 비공개 맵 테스트는 서버가 소유자 권한을 확인합니다. 삭제한 맵은 기록의 참조를 유지하기 위해 보관 처리되고 공개 랭킹에서는 제외됩니다.
- 소유자 계정을 처음 등록하기 전에 `KEYRUSH_OWNER_CLAIM_SECRET`을 Cloudflare Worker secret으로 설정하세요. 한 번만 사용할 긴 무작위 코드를 가입 화면에 입력해 최초 소유자 계정을 만들고, 초기 설정 후 secret을 교체하거나 제거하세요.
- API D1 설정은 `api/wrangler.toml`의 예시 ID를 실제 데이터베이스 ID로 바꾸고 `npm run migrate:remote`를 실행해야 합니다. 저장소 설정만으로 운영 데이터베이스가 생성되거나 서비스가 배포되지는 않습니다.

## 배포

- 웹과 API: Cloudflare Worker가 정적 웹과 API 게이트웨이를 함께 제공합니다.
- Worker는 Cloudflare Turnstile을 서버에서 확인하고, 짧은 수명의 일회용 확인을 D1에 저장합니다.
- 계정·기기 데이터는 기존 Render SQLite 데이터베이스에 유지됩니다. Worker는 공유 비밀 헤더로만 Render API에 전달하며, 공개 요청은 Worker에서 검증합니다.
- `docs/cloudflare-deploy-ko.md`에 D1, 비밀값, Render 원본 보호 및 도메인 연결 절차가 있습니다.

## Accounts backend (server/)

The Node 24 / SQLite service remains the private account-data origin to preserve existing accounts. It is not a public application endpoint: production startup requires `EDGE_PROXY_SECRET`, and requests are accepted only from the Cloudflare Worker. Accounts use an ID and password, and sign-up/sign-in require confirming the IP observed by the server.

## 기존 계정 API 및 정책 문서

- `/privacy`, `/terms`, `/service-information`, `/legal-information`, `/faq`에서 개인정보 처리방침, 이용약관 및 공식 안내를 제공합니다.
- 신규 계정 생성은 이용약관 동의와 개인정보 처리방침 확인을 요구하며, 두 문서의 버전과 동의 시각을 SQLite의 `policy_acceptances`에 기록합니다.
- 운영자 법적 정보, 비공개 개인정보 문의 채널, 실제 호스팅·국외 이전 정보, 보유기간 및 미성년자 보호 절차는 운영자가 확인해야 합니다. 확인 목록과 정책 버전 변경 절차는 `docs/legal-operations-ko.md`를 참조하세요.
- 법률 안내는 일반 정보이며, 운영 전 구체적인 법률 전문가 확인을 대체하지 않습니다.

기존 식당 NFC 데모 파일은 저장소에 남아 있지만 현재 기본 진입점과 게임 기록 API에서는 사용되지 않습니다. 기존 Render 계정 API 및 그 계정 데이터와 KeyRush 계정은 별도입니다.
