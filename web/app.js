const D = {
  en: {
    navHome:"Home",navNetwork:"Network",navDevice:"Device",navNfc:"NFC",navResults:"Results",navSettings:"Settings",language:"Language",menu:"Open menu",
    downloading:"Downloading...",downloaded:"Successfully downloaded!",eyebrow:"YOUR DIGITAL ENVIRONMENT, CLEARER",heroLine:"Check your device.\nUnderstand your connection.",heroNote:"A considered collection of device and network checks, built around real measurements.",exploreNetwork:"Explore diagnostics",privacyNote:"No account. No invented results.",platformNote:"Browser-based diagnostics",nfcBadge:"NFC ACCESS",webBadge:"WEB ACCESS",nfcDetected:"NFC-specific URL opened",redirectObserved:"Redirect to HTTPS observed",redirectNotObserved:"No HTTPS redirect observed",redirectUnknown:"Could not confirm the redirect.",
    networkKicker:"01 / CONNECTIVITY",networkTitle:"Network diagnostics",networkIntro:"Understand reachability, performance, and the quality of your connection.",deviceKicker:"02 / HARDWARE & BROWSER",deviceTitle:"Device diagnostics",deviceIntro:"Explore display behavior, input, and browser capabilities.",nfcKicker:"03 / TAP TO CONNECT",nfcTitle:"NFC access",nfcIntro:"Open a tag-specific link or read an NDEF tag on supported Android browsers.",resultsKicker:"04 / HISTORY",resultsTitle:"Results",resultsIntro:"Review and manage the tests you have run in this browser.",settingsKicker:"05 / PREFERENCES",settingsTitle:"Settings",settingsIntro:"Adjust your diagnostic preferences and keep your browser data local.",clearResults:"Clear saved results",deleteResult:"Delete",noSavedResults:"No saved results yet.",localStorageMode:"Local device storage",storageMode:"Storage",resetDefaults:"Reset default settings",serverNote:"Tag registration, management, and access counts need a trusted server; this browser-only site will not simulate them.",
    footerNote:"Quietly useful diagnostics. Measurements stay in your browser.",backTop:"Back to top ↑",startTest:"Start test",shareResults:"Share result",close:"Close",ready:"Ready when you are.",running:"Running test…",complete:"Test complete",failed:"The test could not be completed. Check the connection and try again.",invalidDomain:"Enter a valid public domain name.",invalidUrl:"Enter a valid public HTTP or HTTPS website URL.",browserLimited:"The browser could not expose this response. CORS, network, or server policy may be responsible.",notMeasured:"Not measured",notAvailable:"Not available",supported:"Supported",notSupported:"Not supported",reachable:"Reachable",unavailable:"Could not confirm",noRecords:"No records returned.",resolverUnavailable:"Resolver unavailable",selectType:"Record type",domain:"Domain",url:"Website URL",answer:"DNS answer",resolver:"Resolver",responseTime:"Response time",httpStatus:"HTTP status",redirect:"Redirect information",publicAddress:"Public address",connection:"Connectivity",loading:"Checking…",shareFailed:"Could not share the result.",copied:"Result copied.",cancelled:"Test cancelled.",approximate:"Estimate based on the measurements shown.",browserTls:"The browser accepted the HTTPS connection.",certificatePrivate:"Certificate issuer and expiry are not exposed to this page.",noServer:"This function requires a server, so no result is reported.",nfcPhysicalLimit:"A URL identifier does not prove that a tag was physically tapped.",offlineSignal:"Browser online status is a hint, not proof of internet access.",noSpeed:"Run a speed test first.",nfcUnavailable:"Web NFC is unavailable. Use a tag URL; direct reading requires supported Android Chrome over HTTPS.",nfcReady:"Ready to scan. Press start and hold an NFC tag near the device.",nfcScanning:"Scanning for a tag…",nfcReadFailed:"Could not read the NFC tag.",nfcPermission:"NFC scan was not permitted.",noNfcTag:"No NFC-specific URL identifier was found.",tagOpened:"NFC-specific URL opened",webOpened:"Opened as a regular web visit",nfcIntro:"Successfully opened through an NFC-specific URL. Physical tag contact cannot be verified.",webIntro:"No NFC-specific URL identifier is present.",tagId:"Tag identifier",serverRegistry:"Registration status is server-managed and unavailable here.",serverCount:"Access count is server-managed and unavailable here.",online:"Online (browser signal)",offline:"Offline (browser signal)",events:"Connection changes",reconnects:"Reconnect events",qualityScore:"Connection quality score",latency:"Latency",jitter:"Jitter",download:"Download",upload:"Upload",packetLoss:"Failed samples",stability:"Stability",gameScope:"Scope",notGameServer:"General test endpoint — not a game server.",streamTier:"Estimated streaming tier",streamEstimate:"Estimate only; not a playback guarantee.",fps:"Average FPS",frameTime:"Frame time",frameVariance:"Frame-time variation",frameStability:"Frame stability",orientation:"Orientation",angle:"Orientation angle",changes:"Orientation changes",touchCount:"Active touch points",touchMax:"Maximum detected points",touchPositions:"Touch positions",touchPrompt:"Touch this area with multiple fingers",displayManual:"Inspect the screen yourself; this page cannot diagnose pixels.",colorGuide:"Change colors to inspect the panel for unevenness or stuck pixels.",fullscreen:"Full screen",exitFullscreen:"Exit full screen",previous:"Previous",next:"Next",noTouch:"No active touch",accessMethod:"Access method",registry:"Registration status",created:"Created date",lastAccessed:"Last accessed",accessCount:"Access count",ndefData:"NDEF data",measurementScope:"Measurement scope",qualityMethod:"Score uses available measured values only.",note:"Note",method:"Method",tlsValidation:"TLS validation",certificateDetails:"Certificate details",httpRedirect:"HTTP to HTTPS redirect",noRedirectObserved:"No redirect observed",redirectTarget:"Redirect target",ipv4Endpoint:"Public IPv4 lookup endpoint",speedEndpoint:"Cloudflare speed-test endpoint",sampleEndpoint:"Six requests to the public measurement endpoint",refreshScope:"Estimated browser animation cadence; not a hardware panel specification.",
    ipTitle:"IP verification",ipDesc:"Check your public address and browser-visible connection.",speedTitle:"Internet speed test",speedDesc:"Measure real transfer time for a download and upload sample.",stabilityTitle:"Network stability",stabilityDesc:"Sample round-trip response time and failed requests.",ipvTitle:"IPv4 / IPv6 connectivity",ipvDesc:"Check public reachability over each IP version.",dnsTitle:"DNS lookup",dnsDesc:"Query A, AAAA, CNAME, MX, TXT, and NS records.",propTitle:"DNS propagation",propDesc:"Compare live DNS answers from Google, Cloudflare, and Quad9.",responseTitle:"Website response time",responseDesc:"Measure a CORS-readable HEAD response from a public website.",httpsTitle:"HTTPS security check",httpsDesc:"Check HTTPS reachability and HTTP-to-HTTPS redirects where visible.",qualityTitle:"Connection quality",qualityDesc:"Score only real network measurements already collected.",gamingTitle:"Gaming connection",gamingDesc:"Review measured latency and jitter; this does not ping game servers.",streamTitle:"Streaming readiness",streamDesc:"Estimate video tiers from the measured download speed.",disconnectTitle:"Disconnect monitor",disconnectDesc:"Track browser online/offline events while this page is open.",
    refreshTitle:"Refresh rate test",refreshDesc:"Estimate frame cadence with requestAnimationFrame.",deviceInfoTitle:"Device information",deviceInfoDesc:"Review browser-reported screen and platform details.",frameTitle:"Frame stability",frameDesc:"Measure frame times, average FPS, and variation.",colorTitle:"Display color test",colorDesc:"Cycle through colors and a gradient to inspect the panel.",pixelTitle:"Dead pixel inspection",pixelDesc:"Use full-screen colors to inspect pixels yourself.",orientationTitle:"Screen orientation",orientationDesc:"Show the current orientation and watch for changes.",multiTitle:"Multi-touch test",multiDesc:"Detect multiple simultaneous touch points.",compatTitle:"Browser compatibility",compatDesc:"Check support for selected browser APIs.",touchTitle:"Touch test",touchDesc:"Check touch and pointer input on this device.",
    nfcAccessTitle:"NFC access",nfcAccessDesc:"See whether this page was opened with an NFC URL identifier.",nfcScanTitle:"NFC scan",nfcScanDesc:"Read NDEF data on supported Android browsers after permission.",nfcInfoTitle:"NFC tag information",nfcInfoDesc:"View the URL identifier; registration requires a server.",
    keyReady:"Ready",keyScanning:"Scanning",keyDetected:"NFC tag detected",keyFailed:"Scan failed",keyPixel:"Color",keyExpected:"Expected threshold",keyBlue:"Blue",keyGreen:"Green",keyRed:"Red",keyWhite:"White",keyBlack:"Black",keyGray:"Gray",keyGradient:"Gradient",deviceBrowser:"Browser",devicePlatform:"Platform",deviceScreen:"Screen",deviceViewport:"Viewport",devicePixelRatio:"Pixel ratio",deviceLanguage:"Browser language",deviceCores:"Logical cores",deviceMemory:"Approx. memory",copy:"Copy result",
    stable:"Stable",variable:"Variable",unstable:"Unstable",portrait:"Portrait",landscape:"Landscape",stream4k:"4K",stream1080:"1080p",stream720:"720p",streamBelow:"Below 720p",measuringPing:"Measuring latency…",measuringDownload:"Measuring download…",measuringUpload:"Measuring upload…",
    labels:{ipv4:"IPv4 connectivity",ipv6:"IPv6 connectivity",download:"Download speed",upload:"Upload speed",ping:"Latency",result:"Result",actual:"Measurement",stability:"Stability"}
  },
  ko: {
    navHome:"홈",navNetwork:"네트워크",navDevice:"기기",navNfc:"NFC",language:"언어",menu:"메뉴 열기",
    downloading:"다운로드 중...",downloaded:"다운로드가 완료되었습니다!",eyebrow:"내 디지털 환경을 더 명확하게",heroLine:"기기를 확인하고,\n연결 상태를 이해하세요.",heroNote:"실제 측정에 기반해 기기와 네트워크 상태를 살펴봅니다.",exploreNetwork:"진단 시작하기",privacyNote:"가입 없이, 가짜 결과 없이.",platformNote:"브라우저 기반 진단",nfcBadge:"NFC 접속",webBadge:"웹 접속",nfcDetected:"NFC 전용 URL로 접속했습니다",redirectObserved:"HTTPS 리디렉션을 확인했습니다",redirectNotObserved:"HTTPS 리디렉션을 확인하지 못했습니다",redirectUnknown:"리디렉션을 확인할 수 없습니다.",
    networkKicker:"01 / 연결",networkTitle:"네트워크 진단",networkIntro:"연결 가능 여부와 속도, 네트워크 품질을 확인하세요.",deviceKicker:"02 / 기기 및 브라우저",deviceTitle:"기기 진단",deviceIntro:"화면과 입력 장치, 브라우저 지원 기능을 살펴보세요.",nfcKicker:"03 / 태그 연결",nfcTitle:"NFC 접속",nfcIntro:"태그 전용 링크로 접속하거나 지원되는 Android 브라우저에서 NDEF 태그를 읽습니다.",serverNote:"태그 등록·관리와 접속 횟수는 신뢰할 수 있는 서버가 필요합니다. 이 웹사이트는 결과를 꾸며내지 않습니다.",
    footerNote:"필요한 진단만 간결하게. 측정값은 브라우저에 남습니다.",backTop:"맨 위로 ↑",startTest:"검사 시작",shareResults:"결과 공유",close:"닫기",ready:"준비되었습니다.",running:"검사 중…",complete:"검사가 완료되었습니다",failed:"검사를 완료하지 못했습니다. 연결을 확인하고 다시 시도해 주세요.",invalidDomain:"올바른 공개 도메인을 입력해 주세요.",invalidUrl:"올바른 공개 HTTP 또는 HTTPS 주소를 입력해 주세요.",browserLimited:"브라우저가 응답을 읽지 못했습니다. CORS, 네트워크 또는 서버 정책의 제한일 수 있습니다.",notMeasured:"측정되지 않음",notAvailable:"사용할 수 없음",supported:"지원됨",notSupported:"지원되지 않음",reachable:"접속 가능",unavailable:"확인할 수 없음",noRecords:"레코드가 반환되지 않았습니다.",resolverUnavailable:"DNS 리졸버에 연결할 수 없습니다.",selectType:"레코드 유형",domain:"도메인",url:"웹사이트 주소",answer:"DNS 응답",resolver:"리졸버",responseTime:"응답 시간",httpStatus:"HTTP 상태",redirect:"리디렉션 정보",publicAddress:"공인 IP 주소",connection:"연결 상태",loading:"확인 중…",shareFailed:"결과를 공유하지 못했습니다.",copied:"결과를 복사했습니다.",cancelled:"검사가 취소되었습니다.",approximate:"표시된 측정값에 기반한 추정치입니다.",browserTls:"브라우저가 HTTPS 연결을 정상 수립했습니다.",certificatePrivate:"인증서 발급자와 만료일은 이 페이지에서 확인할 수 없습니다.",noServer:"서버가 필요한 기능으로, 확인 결과를 표시하지 않습니다.",nfcPhysicalLimit:"URL 접속 정보만으로 실제 NFC 태그를 터치했는지는 확인할 수 없습니다.",offlineSignal:"브라우저 온라인 상태는 인터넷 연결을 보장하지 않습니다.",noSpeed:"먼저 속도 테스트를 실행해 주세요.",nfcUnavailable:"이 환경에서는 Web NFC를 사용할 수 없습니다. 태그 URL로 접속해 주세요. 직접 읽기는 HTTPS의 지원되는 Android Chrome에서 가능합니다.",nfcReady:"준비되었습니다. 검사를 시작한 뒤 NFC 태그를 기기에 가까이 대세요.",nfcScanning:"태그를 찾는 중…",nfcReadFailed:"NFC 태그를 읽지 못했습니다.",nfcPermission:"NFC 읽기 권한이 허용되지 않았습니다.",noNfcTag:"NFC 전용 URL 식별자가 없습니다.",tagOpened:"NFC 전용 URL로 접속",webOpened:"일반 웹사이트로 접속",nfcIntro:"NFC 전용 URL로 접속했습니다. 실제 태그 접촉 여부는 확인할 수 없습니다.",webIntro:"NFC 전용 URL 식별자가 없습니다.",tagId:"태그 식별자",serverRegistry:"등록 상태는 서버에서 관리하며 여기서는 확인할 수 없습니다.",serverCount:"접속 횟수는 서버에서 관리하며 여기서는 확인할 수 없습니다.",online:"온라인 (브라우저 신호)",offline:"오프라인 (브라우저 신호)",events:"연결 상태 변경",reconnects:"재연결 횟수",qualityScore:"연결 품질 점수",latency:"지연 시간",jitter:"지터",download:"다운로드",upload:"업로드",packetLoss:"실패한 요청",stability:"안정성",gameScope:"측정 범위",notGameServer:"일반 검사 서버입니다. 게임 서버 핑이 아닙니다.",streamTier:"예상 스트리밍 화질",streamEstimate:"예상치이며 실제 재생 품질을 보장하지 않습니다.",fps:"평균 FPS",frameTime:"프레임 시간",frameVariance:"프레임 시간 변동",frameStability:"프레임 안정성",orientation:"화면 방향",angle:"방향 각도",changes:"방향 변경 횟수",touchCount:"현재 터치 지점",touchMax:"최대 감지 지점",touchPositions:"터치 위치",touchPrompt:"여러 손가락으로 이 영역을 터치하세요",displayManual:"화면을 직접 확인해 주세요. 웹사이트가 불량 화소를 판정하지 않습니다.",colorGuide:"색상을 바꾸어 화면의 얼룩이나 고정 화소를 살펴보세요.",fullscreen:"전체 화면",exitFullscreen:"전체 화면 종료",previous:"이전",next:"다음",noTouch:"활성화된 터치 없음",accessMethod:"접속 방식",registry:"등록 상태",created:"등록 날짜",lastAccessed:"최근 접속",accessCount:"접속 횟수",ndefData:"NDEF 데이터",measurementScope:"측정 범위",qualityMethod:"사용 가능한 실제 측정값만 점수에 반영합니다.",note:"참고",method:"산정 방식",tlsValidation:"TLS 검증",certificateDetails:"인증서 정보",httpRedirect:"HTTP → HTTPS 리디렉션",noRedirectObserved:"리디렉션을 확인하지 못했습니다",redirectTarget:"리디렉션 대상",ipv4Endpoint:"공개 IPv4 조회 엔드포인트",speedEndpoint:"Cloudflare 속도 측정 엔드포인트",sampleEndpoint:"공개 측정 엔드포인트 6회 요청",refreshScope:"브라우저 프레임 추정치이며 디스플레이 패널 사양이 아닙니다.",
    ipTitle:"IP 인증",ipDesc:"공인 IP 주소와 브라우저에서 확인 가능한 연결을 살펴봅니다.",speedTitle:"인터넷 속도 테스트",speedDesc:"실제 다운로드와 업로드 전송 시간을 측정합니다.",stabilityTitle:"네트워크 안정성",stabilityDesc:"응답 시간을 여러 차례 측정하고 실패 요청을 확인합니다.",ipvTitle:"IPv4 / IPv6 연결 테스트",ipvDesc:"IP 버전별 외부 연결을 확인합니다.",dnsTitle:"DNS 조회",dnsDesc:"A, AAAA, CNAME, MX, TXT, NS 레코드를 조회합니다.",propTitle:"DNS 전파 확인",propDesc:"Google, Cloudflare, Quad9의 DNS 응답을 비교합니다.",responseTitle:"웹사이트 응답 시간",responseDesc:"응답을 읽을 수 있는 공개 웹사이트의 HEAD 요청을 측정합니다.",httpsTitle:"HTTPS 보안 확인",httpsDesc:"HTTPS 접속과 확인 가능한 HTTP→HTTPS 이동을 살펴봅니다.",qualityTitle:"연결 품질",qualityDesc:"이미 측정된 실제 네트워크 값만으로 점수를 계산합니다.",gamingTitle:"게임 연결 상태",gamingDesc:"실제 지연과 지터를 확인합니다. 게임 서버를 검사하지 않습니다.",streamTitle:"스트리밍 준비도",streamDesc:"측정된 다운로드 속도를 기준으로 영상 화질을 추정합니다.",disconnectTitle:"연결 끊김 모니터",disconnectDesc:"페이지가 열린 동안 브라우저의 온라인·오프라인 이벤트를 기록합니다.",
    refreshTitle:"주사율 테스트",refreshDesc:"requestAnimationFrame으로 프레임 간격을 추정합니다.",deviceInfoTitle:"기기 정보",deviceInfoDesc:"브라우저가 제공하는 화면 및 기기 정보를 확인합니다.",frameTitle:"프레임 안정성",frameDesc:"프레임 시간과 평균 FPS, 변동 폭을 측정합니다.",colorTitle:"디스플레이 색상 테스트",colorDesc:"단색과 그라데이션으로 화면을 확인합니다.",pixelTitle:"불량 화소 확인",pixelDesc:"전체 화면 색상을 바꾸며 직접 화소를 살펴보세요.",orientationTitle:"화면 방향 테스트",orientationDesc:"현재 방향을 표시하고 방향 전환을 감지합니다.",multiTitle:"멀티터치 테스트",multiDesc:"여러 손가락의 동시 입력을 감지합니다.",compatTitle:"브라우저 호환성",compatDesc:"브라우저 API 지원 여부를 확인합니다.",touchTitle:"터치 테스트",touchDesc:"이 기기의 터치와 포인터 입력을 확인합니다.",
    nfcAccessTitle:"NFC 접속",nfcAccessDesc:"NFC URL 식별자로 이 페이지가 열렸는지 확인합니다.",nfcScanTitle:"NFC 스캔",nfcScanDesc:"권한을 허용한 뒤 지원되는 Android 브라우저에서 NDEF 데이터를 읽습니다.",nfcInfoTitle:"NFC 태그 정보",nfcInfoDesc:"URL 식별자를 확인합니다. 등록 정보에는 서버가 필요합니다.",
    keyReady:"준비",keyScanning:"스캔 중",keyDetected:"NFC 태그가 감지되었습니다",keyFailed:"스캔 실패",keyPixel:"색상",keyExpected:"기준",keyBlue:"파랑",keyGreen:"초록",keyRed:"빨강",keyWhite:"흰색",keyBlack:"검정",keyGray:"회색",keyGradient:"그라데이션",deviceBrowser:"브라우저",devicePlatform:"플랫폼",deviceScreen:"화면 크기",deviceViewport:"뷰포트",devicePixelRatio:"픽셀 비율",deviceLanguage:"브라우저 언어",deviceCores:"논리 코어",deviceMemory:"메모리 추정치",copy:"결과 복사",
    stable:"안정적",variable:"변동 있음",unstable:"불안정",portrait:"세로",landscape:"가로",stream4k:"4K",stream1080:"1080p",stream720:"720p",streamBelow:"720p 미만",measuringPing:"지연 시간을 측정하는 중…",measuringDownload:"다운로드 속도를 측정하는 중…",measuringUpload:"업로드 속도를 측정하는 중…",
    labels:{ipv4:"IPv4 연결",ipv6:"IPv6 연결",download:"다운로드 속도",upload:"업로드 속도",ping:"지연 시간",result:"결과",actual:"측정",stability:"안정성"}
  },
  ja: {
    navHome:"ホーム",navNetwork:"ネットワーク",navDevice:"デバイス",navNfc:"NFC",language:"言語",menu:"メニューを開く",
    downloading:"ダウンロード中...",downloaded:"ダウンロードが完了しました",eyebrow:"デジタル環境を、もっと明確に",heroLine:"デバイスを確認し、\n接続を理解する。",heroNote:"実測に基づいて、デバイスとネットワークの状態を確認できます。",exploreNetwork:"診断を始める",privacyNote:"アカウント不要。結果を捏造しません。",platformNote:"ブラウザー診断",nfcBadge:"NFC アクセス",webBadge:"ウェブアクセス",nfcDetected:"NFC 専用 URL からアクセス",redirectObserved:"HTTPS へのリダイレクトを確認",redirectNotObserved:"HTTPS へのリダイレクトは未確認",redirectUnknown:"リダイレクトを確認できません。",
    networkKicker:"01 / 接続",networkTitle:"ネットワーク診断",networkIntro:"接続状況、性能、ネットワーク品質を確認できます。",deviceKicker:"02 / デバイスとブラウザー",deviceTitle:"デバイス診断",deviceIntro:"画面、入力、ブラウザー機能を確認できます。",nfcKicker:"03 / NFC 接続",nfcTitle:"NFC アクセス",nfcIntro:"タグ固有のリンクを開くか、対応する Android ブラウザーで NDEF タグを読み取ります。",serverNote:"タグの登録・管理・アクセス数には安全なサーバーが必要です。このサイトでは値を作りません。",
    footerNote:"必要な診断をシンプルに。測定値はブラウザー内に保存されます。",backTop:"トップへ ↑",startTest:"テスト開始",shareResults:"結果を共有",close:"閉じる",ready:"準備ができました。",running:"測定中…",complete:"測定が完了しました",failed:"測定を完了できませんでした。接続を確認して再試行してください。",invalidDomain:"有効な公開ドメインを入力してください。",invalidUrl:"有効な公開 HTTP または HTTPS URL を入力してください。",browserLimited:"ブラウザーが応答を読み取れませんでした。CORS、ネットワーク、サーバーの制限が考えられます。",notMeasured:"未測定",notAvailable:"利用できません",supported:"対応",notSupported:"非対応",reachable:"接続可能",unavailable:"確認できません",noRecords:"レコードが返されませんでした。",resolverUnavailable:"DNS リゾルバーに接続できません。",selectType:"レコードタイプ",domain:"ドメイン",url:"ウェブサイト URL",answer:"DNS 応答",resolver:"リゾルバー",responseTime:"応答時間",httpStatus:"HTTP ステータス",redirect:"リダイレクト情報",publicAddress:"公開 IP アドレス",connection:"接続状況",loading:"確認中…",shareFailed:"結果を共有できませんでした。",copied:"結果をコピーしました。",cancelled:"テストを中止しました。",approximate:"表示された実測値に基づく推定です。",browserTls:"ブラウザーが HTTPS 接続を受け入れました。",certificatePrivate:"証明書の発行者と有効期限はこのページから確認できません。",noServer:"サーバーが必要な機能のため、結果は表示しません。",nfcPhysicalLimit:"URL 識別子だけでは、タグに物理的に触れたかどうかは確認できません。",offlineSignal:"ブラウザーのオンライン状態は、インターネット接続を保証しません。",noSpeed:"先に速度テストを実行してください。",nfcUnavailable:"この環境では Web NFC を利用できません。タグの URL を開いてください。読み取りには HTTPS 対応の Android Chrome が必要です。",nfcReady:"準備完了です。開始を押して NFC タグを近づけてください。",nfcScanning:"タグをスキャン中…",nfcReadFailed:"NFC タグを読み取れませんでした。",nfcPermission:"NFC の読み取りが許可されませんでした。",noNfcTag:"NFC 専用 URL の識別子がありません。",tagOpened:"NFC 専用 URL からアクセス",webOpened:"通常のウェブアクセス",nfcIntro:"NFC 専用 URL で開きました。タグへの物理的な接触は確認できません。",webIntro:"NFC 専用 URL の識別子はありません。",tagId:"タグ識別子",serverRegistry:"登録状態はサーバー管理のため、ここでは確認できません。",serverCount:"アクセス数はサーバー管理のため、ここでは確認できません。",online:"オンライン（ブラウザーの信号）",offline:"オフライン（ブラウザーの信号）",events:"接続状態の変化",reconnects:"再接続回数",qualityScore:"接続品質スコア",latency:"遅延",jitter:"ジッター",download:"ダウンロード",upload:"アップロード",packetLoss:"失敗したリクエスト",stability:"安定性",gameScope:"測定範囲",notGameServer:"一般のテスト先です。ゲームサーバーへの Ping ではありません。",streamTier:"推定ストリーミング品質",streamEstimate:"推定値であり、再生品質を保証するものではありません。",fps:"平均 FPS",frameTime:"フレーム時間",frameVariance:"フレーム時間の変動",frameStability:"フレーム安定性",orientation:"画面の向き",angle:"角度",changes:"向きの変更回数",touchCount:"現在のタッチ数",touchMax:"最大検出数",touchPositions:"タッチ位置",touchPrompt:"複数の指でこの領域に触れてください",displayManual:"画面を直接確認してください。このページは不良画素を診断しません。",colorGuide:"色を切り替えて画面のムラや画素を確認してください。",fullscreen:"全画面表示",exitFullscreen:"全画面を終了",previous:"前へ",next:"次へ",noTouch:"タッチなし",accessMethod:"アクセス方法",registry:"登録状態",created:"登録日",lastAccessed:"最終アクセス",accessCount:"アクセス数",ndefData:"NDEF データ",measurementScope:"測定範囲",qualityMethod:"利用可能な実測値のみをスコアに反映します。",note:"注記",method:"算出方法",tlsValidation:"TLS 検証",certificateDetails:"証明書情報",httpRedirect:"HTTP から HTTPS へのリダイレクト",noRedirectObserved:"リダイレクトは確認できませんでした",redirectTarget:"リダイレクト先",ipv4Endpoint:"公開 IPv4 確認エンドポイント",speedEndpoint:"Cloudflare 速度測定エンドポイント",sampleEndpoint:"公開測定エンドポイントへの 6 回の要求",refreshScope:"ブラウザーのフレーム間隔の推定であり、ディスプレイ仕様ではありません。",
    ipTitle:"IP 確認",ipDesc:"公開 IP アドレスとブラウザーから確認できる接続を調べます。",speedTitle:"インターネット速度テスト",speedDesc:"実際のダウンロードとアップロードの時間を測定します。",stabilityTitle:"ネットワーク安定性",stabilityDesc:"応答時間を複数回測定し、失敗したリクエストを確認します。",ipvTitle:"IPv4 / IPv6 接続テスト",ipvDesc:"IP バージョンごとの外部接続を確認します。",dnsTitle:"DNS ルックアップ",dnsDesc:"A、AAAA、CNAME、MX、TXT、NS レコードを検索します。",propTitle:"DNS 伝播チェック",propDesc:"Google、Cloudflare、Quad9 の DNS 応答を比較します。",responseTitle:"ウェブサイト応答時間",responseDesc:"応答を読み取れる公開サイトへの HEAD 要求を測定します。",httpsTitle:"HTTPS セキュリティ確認",httpsDesc:"HTTPS 接続と確認可能な HTTP からのリダイレクトを調べます。",qualityTitle:"接続品質",qualityDesc:"収集済みの実測ネットワーク値のみで評価します。",gamingTitle:"ゲーム接続テスト",gamingDesc:"実測遅延とジッターを確認します。ゲームサーバーへの Ping ではありません。",streamTitle:"動画配信の準備状況",streamDesc:"実測ダウンロード速度から画質を推定します。",disconnectTitle:"切断モニター",disconnectDesc:"ページを開いている間のオンライン・オフラインイベントを記録します。",
    refreshTitle:"リフレッシュレート",refreshDesc:"requestAnimationFrame でフレーム間隔を推定します。",deviceInfoTitle:"デバイス情報",deviceInfoDesc:"ブラウザーが提供する画面と端末情報を確認します。",frameTitle:"フレーム安定性",frameDesc:"フレーム時間、平均 FPS、変動を測定します。",colorTitle:"ディスプレイカラー",colorDesc:"単色とグラデーションで画面を確認します。",pixelTitle:"ドット抜け確認",pixelDesc:"全画面の色を切り替えて、自分で画素を確認します。",orientationTitle:"画面の向き",orientationDesc:"現在の向きを表示し、変更を検出します。",multiTitle:"マルチタッチ",multiDesc:"複数の同時タッチを検出します。",compatTitle:"ブラウザー互換性",compatDesc:"ブラウザー API の対応状況を確認します。",touchTitle:"タッチテスト",touchDesc:"端末のタッチ・ポインター入力を確認します。",
    nfcAccessTitle:"NFC アクセス",nfcAccessDesc:"NFC URL 識別子で開かれたかを確認します。",nfcScanTitle:"NFC スキャン",nfcScanDesc:"許可後、対応する Android ブラウザーで NDEF を読み取ります。",nfcInfoTitle:"NFC タグ情報",nfcInfoDesc:"URL 識別子を確認します。登録情報にはサーバーが必要です。",
    keyReady:"準備完了",keyScanning:"スキャン中",keyDetected:"NFC タグを検出",keyFailed:"スキャン失敗",keyPixel:"色",keyExpected:"基準",keyBlue:"青",keyGreen:"緑",keyRed:"赤",keyWhite:"白",keyBlack:"黒",keyGray:"グレー",keyGradient:"グラデーション",deviceBrowser:"ブラウザー",devicePlatform:"プラットフォーム",deviceScreen:"画面",deviceViewport:"ビューポート",devicePixelRatio:"ピクセル比",deviceLanguage:"ブラウザー言語",deviceCores:"論理コア数",deviceMemory:"メモリー概算",copy:"結果をコピー",
    stable:"安定",variable:"変動あり",unstable:"不安定",portrait:"縦向き",landscape:"横向き",stream4k:"4K",stream1080:"1080p",stream720:"720p",streamBelow:"720p 未満",measuringPing:"遅延を測定中…",measuringDownload:"ダウンロードを測定中…",measuringUpload:"アップロードを測定中…",
    labels:{ipv4:"IPv4 接続",ipv6:"IPv6 接続",download:"ダウンロード速度",upload:"アップロード速度",ping:"遅延",result:"結果",actual:"測定",stability:"安定性"}
  },
  zh: {
    navHome:"首页",navNetwork:"网络",navDevice:"设备",navNfc:"NFC",language:"语言",menu:"打开菜单",
    downloading:"正在加载…",downloaded:"加载完成！",eyebrow:"清晰了解你的数字环境",heroLine:"检查设备，\n了解网络连接。",heroNote:"基于真实测量，检查设备与网络状态。",exploreNetwork:"开始诊断",privacyNote:"无需注册，不伪造结果。",platformNote:"基于浏览器的诊断",nfcBadge:"NFC 访问",webBadge:"网页访问",nfcDetected:"已通过 NFC 专属 URL 访问",redirectObserved:"已观察到跳转至 HTTPS",redirectNotObserved:"未观察到跳转至 HTTPS",redirectUnknown:"无法确认跳转情况。",
    networkKicker:"01 / 网络连接",networkTitle:"网络诊断",networkIntro:"了解网络可达性、性能与连接质量。",deviceKicker:"02 / 设备与浏览器",deviceTitle:"设备诊断",deviceIntro:"检查屏幕、输入方式与浏览器功能支持。",nfcKicker:"03 / NFC 连接",nfcTitle:"NFC 访问",nfcIntro:"通过标签专属链接访问，或在受支持的 Android 浏览器中读取 NDEF 标签。",serverNote:"标签注册、管理和访问次数需要可信服务器；本网站不会伪造这些数据。",
    footerNote:"简洁实用的诊断工具。测量结果保留在浏览器中。",backTop:"返回顶部 ↑",startTest:"开始测试",shareResults:"分享结果",close:"关闭",ready:"准备就绪。",running:"正在测试…",complete:"测试完成",failed:"无法完成测试，请检查连接后重试。",invalidDomain:"请输入有效的公网域名。",invalidUrl:"请输入有效的公网 HTTP 或 HTTPS 网站地址。",browserLimited:"浏览器无法读取响应，可能受到 CORS、网络或服务器策略限制。",notMeasured:"未测量",notAvailable:"不可用",supported:"支持",notSupported:"不支持",reachable:"可连接",unavailable:"无法确认",noRecords:"未返回记录。",resolverUnavailable:"DNS 解析器不可用。",selectType:"记录类型",domain:"域名",url:"网站地址",answer:"DNS 响应",resolver:"解析器",responseTime:"响应时间",httpStatus:"HTTP 状态",redirect:"重定向信息",publicAddress:"公网 IP 地址",connection:"连接状态",loading:"检查中…",shareFailed:"无法分享结果。",copied:"结果已复制。",cancelled:"测试已取消。",approximate:"根据显示的实测数据估算。",browserTls:"浏览器已接受 HTTPS 连接。",certificatePrivate:"此页面无法读取证书颁发者和到期日期。",noServer:"此功能需要服务器，因此不会显示伪造结果。",nfcPhysicalLimit:"仅凭 URL 标识无法确认用户是否实际触碰了 NFC 标签。",offlineSignal:"浏览器在线状态不代表互联网一定可用。",noSpeed:"请先运行速度测试。",nfcUnavailable:"当前环境不支持 Web NFC。请使用标签 URL；直接读取需要 HTTPS 环境下受支持的 Android Chrome。",nfcReady:"准备扫描。点击开始并将 NFC 标签靠近设备。",nfcScanning:"正在扫描标签…",nfcReadFailed:"无法读取 NFC 标签。",nfcPermission:"未获得 NFC 扫描权限。",noNfcTag:"未检测到 NFC 专属 URL 标识。",tagOpened:"通过 NFC 专属 URL 访问",webOpened:"普通网页访问",nfcIntro:"通过 NFC 专属 URL 打开；无法验证是否实际触碰标签。",webIntro:"未检测到 NFC 专属 URL 标识。",tagId:"标签标识",serverRegistry:"注册状态由服务器管理，此处无法查询。",serverCount:"访问次数由服务器管理，此处无法查询。",online:"在线（浏览器信号）",offline:"离线（浏览器信号）",events:"连接状态变化",reconnects:"重新连接次数",qualityScore:"连接质量评分",latency:"延迟",jitter:"抖动",download:"下载",upload:"上传",packetLoss:"失败请求",stability:"稳定性",gameScope:"测量范围",notGameServer:"普通测试端点，不是游戏服务器 Ping。",streamTier:"预计流媒体画质",streamEstimate:"仅为估算，不代表实际播放效果。",fps:"平均 FPS",frameTime:"帧时间",frameVariance:"帧时间波动",frameStability:"帧稳定性",orientation:"屏幕方向",angle:"方向角度",changes:"方向变化次数",touchCount:"当前触点",touchMax:"最多检测触点",touchPositions:"触点位置",touchPrompt:"请用多根手指触摸此区域",displayManual:"请自行检查屏幕；本网站无法自动诊断坏点。",colorGuide:"切换颜色，检查屏幕是否存在不均匀或异常像素。",fullscreen:"全屏",exitFullscreen:"退出全屏",previous:"上一个",next:"下一个",noTouch:"没有活动触点",accessMethod:"访问方式",registry:"注册状态",created:"创建日期",lastAccessed:"最近访问",accessCount:"访问次数",ndefData:"NDEF 数据",measurementScope:"测量范围",qualityMethod:"仅根据可用的实测数据评分。",note:"说明",method:"计算方式",tlsValidation:"TLS 验证",certificateDetails:"证书信息",httpRedirect:"HTTP 到 HTTPS 跳转",noRedirectObserved:"未观察到跳转",redirectTarget:"跳转目标",ipv4Endpoint:"公网 IPv4 查询端点",speedEndpoint:"Cloudflare 速度测试端点",sampleEndpoint:"对公网测量端点的 6 次请求",refreshScope:"浏览器动画帧率估算，不代表显示面板规格。",
    ipTitle:"IP 验证",ipDesc:"查看公网 IP 地址和浏览器可读取的连接信息。",speedTitle:"网络速度测试",speedDesc:"测量实际下载和上传样本的传输时间。",stabilityTitle:"网络稳定性",stabilityDesc:"多次测量响应时间并统计失败请求。",ipvTitle:"IPv4 / IPv6 连接测试",ipvDesc:"分别检查 IPv4 和 IPv6 的公网连接能力。",dnsTitle:"DNS 查询",dnsDesc:"查询 A、AAAA、CNAME、MX、TXT 和 NS 记录。",propTitle:"DNS 传播检查",propDesc:"比较 Google、Cloudflare 和 Quad9 的实时响应。",responseTitle:"网站响应时间",responseDesc:"测量浏览器可读取的公网网站 HEAD 响应。",httpsTitle:"HTTPS 安全检查",httpsDesc:"检查 HTTPS 连通性和可见的 HTTP 跳转。",qualityTitle:"连接质量",qualityDesc:"仅根据已经采集的真实网络数据评分。",gamingTitle:"游戏连接测试",gamingDesc:"查看实际延迟和抖动；不会 Ping 游戏服务器。",streamTitle:"视频流媒体就绪度",streamDesc:"根据实测下载速度估算视频画质。",disconnectTitle:"断网监测",disconnectDesc:"记录页面打开期间浏览器的在线/离线事件。",
    refreshTitle:"刷新率测试",refreshDesc:"使用 requestAnimationFrame 估算帧间隔。",deviceInfoTitle:"设备信息",deviceInfoDesc:"查看浏览器提供的屏幕与平台信息。",frameTitle:"帧稳定性",frameDesc:"测量帧时间、平均 FPS 和波动。",colorTitle:"屏幕色彩测试",colorDesc:"切换纯色和渐变来检查屏幕。",pixelTitle:"坏点检查",pixelDesc:"使用全屏颜色自行检查屏幕像素。",orientationTitle:"屏幕方向",orientationDesc:"显示当前方向并检测方向变化。",multiTitle:"多点触控测试",multiDesc:"检测同时触摸的多个触点。",compatTitle:"浏览器兼容性",compatDesc:"检查常用浏览器 API 的支持情况。",touchTitle:"触摸测试",touchDesc:"检查设备的触摸和指针输入。",
    nfcAccessTitle:"NFC 访问",nfcAccessDesc:"查看页面是否通过 NFC 专属 URL 标识打开。",nfcScanTitle:"NFC 扫描",nfcScanDesc:"授权后在受支持的 Android 浏览器中读取 NDEF 数据。",nfcInfoTitle:"NFC 标签信息",nfcInfoDesc:"查看 URL 标识；注册信息需要服务器。",
    keyReady:"准备就绪",keyScanning:"扫描中",keyDetected:"已检测到 NFC 标签",keyFailed:"扫描失败",keyPixel:"颜色",keyExpected:"参考值",keyBlue:"蓝色",keyGreen:"绿色",keyRed:"红色",keyWhite:"白色",keyBlack:"黑色",keyGray:"灰色",keyGradient:"渐变",deviceBrowser:"浏览器",devicePlatform:"平台",deviceScreen:"屏幕",deviceViewport:"视口",devicePixelRatio:"像素比例",deviceLanguage:"浏览器语言",deviceCores:"逻辑核心数",deviceMemory:"估算内存",copy:"复制结果",
    stable:"稳定",variable:"有波动",unstable:"不稳定",portrait:"竖屏",landscape:"横屏",stream4k:"4K",stream1080:"1080p",stream720:"720p",streamBelow:"低于 720p",measuringPing:"正在测量延迟…",measuringDownload:"正在测量下载速度…",measuringUpload:"正在测量上传速度…",
    labels:{ipv4:"IPv4 连接",ipv6:"IPv6 连接",download:"下载速度",upload:"上传速度",ping:"延迟",result:"结果",actual:"测量",stability:"稳定性"}
  }
};

D.en.nfcSectionIntro="Open a tag-specific link or read an NDEF tag on supported Android browsers.";
D.ko.nfcSectionIntro="태그 전용 링크로 접속하거나 지원되는 Android 브라우저에서 NDEF 태그를 읽어 보세요.";
D.ja.nfcSectionIntro="タグ専用リンクでアクセスするか、対応する Android ブラウザーで NDEF タグを読み取れます。";
D.zh.nfcSectionIntro="可通过标签专属链接访问，也可在支持的 Android 浏览器中读取 NDEF 标签。";

const icons = {
  globe:"<circle cx='12' cy='12' r='9'/><path d='M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18'/>",
  speed:"<path d='M4 17a8 8 0 1 1 16 0'/><path d='m12 13 4-4M7 17h.01M17 17h.01'/>",
  pulse:"<path d='M3 12h4l3-7 4 14 3-7h4'/>",
  dns:"<circle cx='12' cy='12' r='9'/><path d='M8 9h8M8 12h8M8 15h5'/>",
  shield:"<path d='M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z'/><path d='m9 12 2 2 4-4'/>",
  chart:"<path d='M4 19V5M4 19h16M7 15l4-4 3 2 5-7'/>",
  game:"<path d='M6 9h12a3 3 0 0 1 2.8 4l-1.2 3a2 2 0 0 1-3.2.8L14 14h-4l-2.4 2.8a2 2 0 0 1-3.2-.8l-1.2-3A3 3 0 0 1 6 9Z'/><path d='M7 11v4M5 13h4M16 12h.01M18 14h.01'/>",
  video:"<rect x='3' y='5' width='18' height='14' rx='3'/><path d='m10 9 5 3-5 3V9Z'/>",
  wifi:"<path d='M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15a4.5 4.5 0 0 1 6 0M12 19h.01'/>",
  screen:"<rect x='3' y='4' width='18' height='14' rx='2'/><path d='M8 22h8M12 18v4'/>",
  touch:"<path d='M8 12V6a2 2 0 0 1 4 0v5-2a2 2 0 0 1 4 0v3-1a2 2 0 0 1 4 0v4c0 4-2 7-6 7h-1c-2 0-3-.8-4-2l-3-4a2 2 0 0 1 2-3l2 2'/>",
  nfc:"<path d='M7 8a6 6 0 0 1 0 8M11 5a10 10 0 0 1 0 14M15 3a13 13 0 0 1 0 18M4 10v4'/>",
  phone:"<rect x='6' y='2' width='12' height='20' rx='2'/><path d='M11 18h2'/>",
  eye:"<path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/>",
  compass:"<circle cx='12' cy='12' r='9'/><path d='m15.5 8.5-2 5-5 2 2-5 5-2Z'/>",
  layers:"<path d='m12 3 9 5-9 5-9-5 9-5Z'/><path d='m3 12 9 5 9-5M3 16l9 5 9-5'/>",
  mouse:"<rect x='5' y='3' width='14' height='18' rx='7'/><path d='M12 3v6'/>",
  arrow:"<path d='M5 12h14M13 6l6 6-6 6'/>"
};
const featureDefs = [
  ["network","ip","ipTitle","ipDesc","globe"],["network","speed","speedTitle","speedDesc","speed"],
  ["network","stability","stabilityTitle","stabilityDesc","pulse"],["network","ipv","ipvTitle","ipvDesc","globe"],
  ["network","dns","dnsTitle","dnsDesc","dns"],["network","propagation","propTitle","propDesc","layers"],
  ["network","response","responseTitle","responseDesc","chart"],["network","https","httpsTitle","httpsDesc","shield"],
  ["network","quality","qualityTitle","qualityDesc","chart"],["network","gaming","gamingTitle","gamingDesc","game"],
  ["network","streaming","streamTitle","streamDesc","video"],["network","disconnect","disconnectTitle","disconnectDesc","wifi"],
  ["device","refresh","refreshTitle","refreshDesc","speed"],["device","info","deviceInfoTitle","deviceInfoDesc","phone"],
  ["device","frame","frameTitle","frameDesc","chart"],["device","color","colorTitle","colorDesc","eye"],
  ["device","pixel","pixelTitle","pixelDesc","screen"],["device","orientation","orientationTitle","orientationDesc","compass"],
  ["device","multi","multiTitle","multiDesc","touch"],["device","compat","compatTitle","compatDesc","layers"],
  ["device","touch","touchTitle","touchDesc","mouse"],["nfc","nfc-access","nfcAccessTitle","nfcAccessDesc","nfc"],
  ["nfc","nfc-scan","nfcScanTitle","nfcScanDesc","nfc"],["nfc","nfc-info","nfcInfoTitle","nfcInfoDesc","phone"]
];
const dnsTypes = {A:1,AAAA:28,CNAME:5,MX:15,TXT:16,NS:2};
const colorNames = ["keyRed","keyGreen","keyBlue","keyWhite","keyBlack","keyGray","keyGradient"];
const colorValues = ["#ff0000","#00c000","#0000ff","#ffffff","#000000","#808080","linear-gradient(110deg,#f8e5f2,#dcc8f5 36%,#c9e9fa 72%,#bdeef2)"];
const NFC_TAGS = {
  CVX001: {name:"Compivox Tag 001",url:"https://compivox.xyz/?source=nfc&tag=CVX001",description:"Static example tag configuration",registrationState:"Configured"},
  CVX002: {name:"Compivox Tag 002",url:"https://compivox.xyz/?source=nfc&tag=CVX002",description:"Static example tag configuration",registrationState:"Configured"}
};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let lang = localStorage.getItem("compivox-language") || "en";
if (!D[lang]) lang = "en";
const t = key => D[lang][key] ?? D.en[key] ?? key;
const storedPreferences = (() => {
  try { return JSON.parse(localStorage.getItem("compivox-settings") || "{}"); }
  catch { return {}; }
})();
const preferences = {
  animations: storedPreferences.animations !== false,
  reduceMotion: storedPreferences.reduceMotion === true
};
const measured = {speed:null,stability:null,orientationChanges:0,offlineEvents:0,reconnects:0};
const resultsKey = "compivox-results";

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function getSavedResults(){
  const parsed = JSON.parse(localStorage.getItem(resultsKey) || "[]");
  if (!Array.isArray(parsed)) throw new Error("Saved test history has an invalid format.");
  return parsed.filter(item => item && typeof item === "object" && Array.isArray(item.rows));
}
function saveSavedResults(results){
  localStorage.setItem(resultsKey, JSON.stringify(results));
}
function recordResult(group, title, rows){
  const saved = getSavedResults();
  const publicRows = (Array.isArray(rows) ? rows : []).filter(([label, , privateValue]) =>
    !privateValue && label !== t("publicAddress") && !/IPv[46]/i.test(String(label)),
  );
  const device = [
    [t("deviceType"), /Mobi|Android/i.test(navigator.userAgent) ? t("mobileDevice") : t("desktopDevice")],
    [t("deviceScreen"), `${screen.width} × ${screen.height}`]
  ];
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2,8)}`,
    group,
    title,
    createdAt: new Date().toISOString(),
    status: t("complete"),
    device,
    rows: publicRows.slice(0, 10)
  };
  saved.unshift(entry);
  const trimmed = saved.slice(0, 50);
  saveSavedResults(trimmed);
  renderResultsPage();
}

function renderResultsPage(){
  const list = document.getElementById("resultsList");
  if (!list) return;
  let results;
  try { results = getSavedResults(); }
  catch {
    list.innerHTML = `<div class="empty-state">${escapeHtml(t("historyUnavailable"))}</div>`;
    return;
  }
  if (!results.length) {
    list.innerHTML = `<div class="empty-state">${t("noSavedResults")}</div>`;
    return;
  }
  list.innerHTML = results.map(result => {
    const rows = (result.rows || []).slice(0, 4).map(([label, value]) => `<div class="result-pill"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
    const device = (result.device || []).slice(0, 2).map(([label, value]) => `<div class="result-pill"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
    const timestamp = new Date(result.createdAt);
    const date = Number.isNaN(timestamp.getTime()) ? t("notAvailable") : timestamp.toLocaleString();
    return `
      <article class="result-card">
        <div class="result-card-head">
          <div>
            <span class="result-badge">${escapeHtml(result.group || "Test")}</span>
            <h3>${escapeHtml(result.title)}</h3>
          </div>
          <time>${escapeHtml(date)}</time>
        </div>
        <div class="result-summary">${rows || `<div class="result-pill"><span>${t("note")}</span><strong>${t("notMeasured")}</strong></div>`}${device}</div>
        <p class="result-status">${escapeHtml(result.status || t("complete"))}</p>
        <div class="result-actions">
          <button class="button button-secondary result-share" data-result-id="${escapeHtml(result.id)}" type="button">${t("shareResults")}</button>
          <button class="button button-secondary result-download" data-result-id="${escapeHtml(result.id)}" type="button">${t("downloadImage")}</button>
          <button class="button button-text result-delete" data-result-id="${escapeHtml(result.id)}" type="button">${t("deleteResult")}</button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll(".result-delete").forEach(button => {
    button.addEventListener("click", () => {
      const filtered = getSavedResults().filter(item => item.id !== button.dataset.resultId);
      saveSavedResults(filtered);
      renderResultsPage();
    });
  });
  list.querySelectorAll(".result-share").forEach(button => {
    button.addEventListener("click", () => shareSavedResult(button.dataset.resultId));
  });
  list.querySelectorAll(".result-download").forEach(button => {
    button.addEventListener("click", () => {
      const result=getSavedResults().find(item=>item.id===button.dataset.resultId);
      if(result)downloadShareImage(result).catch(()=>setStatus(t("shareFailed")));
    });
  });
}

function renderSettingsPage(){
  const settingsSelect = document.getElementById("settingsLanguage");
  if (settingsSelect) settingsSelect.value = lang;
  const animations = document.getElementById("animationsSetting");
  const reduceMotion = document.getElementById("reduceMotionSetting");
  if (animations) animations.checked = preferences.animations;
  if (reduceMotion) reduceMotion.checked = preferences.reduceMotion;
  document.body.classList.toggle("animations-off", !preferences.animations);
  document.body.classList.toggle("reduce-motion", preferences.reduceMotion || !preferences.animations);
}
let current = null, activeController = null, stopLive = null, introTimer = null;
const dialog = $("#testDialog");

function trMarkup() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  $$("[data-t]").forEach(el => { const val=t(el.dataset.t); if(el.tagName==="OPTION") el.textContent=val; else el.textContent=val; });
  $$("[data-t-aria]").forEach(el => el.setAttribute("aria-label",t(el.dataset.tAria)));
  $("#language").value = lang;
  renderCards();
  renderAccess();
  renderResultsPage();
  renderSettingsPage();
  if(current) {
    $("#dialogCategory").textContent=t(current.group==="network"?"networkKicker":current.group==="device"?"deviceKicker":"nfcKicker");
    $("#dialogTitle").textContent=t(current.title);
    $("#dialogDescription").textContent=t(current.desc);
  }
}
function renderCards() {
  for(const [group,id,title,desc,icon] of featureDefs) {
    const root = $(`#${group}Grid`);
    if(!root || root.querySelector(`[data-id="${id}"]`)) continue;
    const button=document.createElement("button");
    button.className="feature-card"; button.type="button"; button.dataset.id=id;
    button.innerHTML=`<span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[icon]}</svg></span><span class="feature-copy"><h3></h3><p></p></span><span class="feature-arrow" aria-hidden="true">›</span>`;
    $("h3",button).textContent=t(title); $("p",button).textContent=t(desc);
    button.addEventListener("click",()=>openTest({group,id,title,desc}));
    root.appendChild(button);
  }
  $$(".feature-card").forEach(card=>{const def=featureDefs.find(row=>row[1]===card.dataset.id);if(def){$("h3",card).textContent=t(def[2]);$("p",card).textContent=t(def[3]);}});
}
function renderAccess() {
  const params=new URLSearchParams(location.search);
  const path=location.pathname.match(/\/nfc\/([^/]+)/i);
  const source=params.get("source");
  const tag=((source==="nfc" ? params.get("tag") : "")||params.get("nfc")||path?.[1]||sessionStorage.getItem("compivox-nfc-tag")||"").trim();
  const safeTag=tag.slice(0,120);
  if(safeTag) {
    sessionStorage.setItem("compivox-nfc-tag",safeTag);
    sessionStorage.setItem("compivox-nfc-access","true");
  }
  const isNfc=safeTag ? sessionStorage.getItem("compivox-nfc-access")==="true" : false;
  const badge=$("#accessBadge");
  badge.textContent=t(isNfc?"nfcBadge":"webBadge");
  badge.classList.toggle("nfc",isNfc);
  $("#accessNotice").hidden=!isNfc;
  $("#accessDescription").textContent=t(isNfc?"nfcIntro":"webIntro");
  const configured=NFC_TAGS[safeTag];
  $("#tagIdentifier").textContent=isNfc?`${t("tagId")}: ${safeTag}${configured?` · ${configured.name}`:""}`:"";
}
function addField(label,key,type="text",placeholder="",options=[]) {
  const wrap=document.createElement("label"); wrap.className="field-wrap";
  const title=document.createElement("span"); title.textContent=label;
  let input;
  if(options.length) {
    input=document.createElement("select");
    for(const option of options){const el=document.createElement("option");el.value=option;el.textContent=option;input.append(el);}
  } else {
    input=document.createElement("input");input.type=type;input.autocomplete="off";input.spellcheck=false;input.placeholder=placeholder;
  }
  input.id=key;wrap.append(title,input);$("#toolFields").append(wrap);return input;
}
function addRow(label,value,privacy=false) {
  const row=document.createElement("div");row.className="result-row";if(privacy)row.dataset.private="true";
  const name=document.createElement("div");name.className="result-label";name.textContent=label;
  const data=document.createElement("div");data.className="result-value";data.textContent=String(value);
  row.append(name,data);$("#resultGrid").append(row);
}
function addRows(rows) { for(const [label,value,privacy] of rows)addRow(label,value,privacy); }
function clearResults() { $("#resultGrid").replaceChildren(); $("#toolFields").replaceChildren(); $("#finePrint").textContent=""; }
function setStatus(text){$("#testStatus").textContent=text;}
function progress(value){const track=$("#progressTrack"),bar=$("#progressBar");track.hidden=false;bar.style.width=`${Math.max(0,Math.min(100,value))}%`;}
function finishStatus(message=t("complete")){setStatus(message);progress(100);$("#shareResult").disabled=false;$("#downloadResult").disabled=false;$("#copyResult").disabled=false;$("#runTest").disabled=false;}
function makeMeter() {
  const wrap=document.createElement("div");wrap.className="meter-wrap";
  wrap.innerHTML="<svg class='meter' viewBox='0 0 240 150' role='img' aria-label='Speed test meter'><defs><linearGradient id='meterGradient' x1='0' x2='1'><stop stop-color='#f0cbea'/><stop offset='.55' stop-color='#cdbcf5'/><stop offset='1' stop-color='#bde8f2'/></linearGradient></defs><path d='M35 119a85 85 0 0 1 170 0' fill='none' stroke='rgba(130,115,165,.12)' stroke-width='12' stroke-linecap='round'/><path class='meter-arc' d='M35 119a85 85 0 0 1 170 0'/><text class='meter-value' x='120' y='93'>—</text><text class='meter-unit' x='120' y='114'>Mbps</text></svg>";
  $("#toolFields").append(wrap);return wrap.querySelector(".meter-value");
}
function openTest(def) {
  current=def;activeController?.abort();activeController=new AbortController();
  clearResults();$("#dialogCategory").textContent=t(def.group==="network"?"networkKicker":def.group==="device"?"deviceKicker":"nfcKicker");
  $("#dialogTitle").textContent=t(def.title);$("#dialogDescription").textContent=t(def.desc);
  $("#progressTrack").hidden=true;$("#progressBar").style.width="0";$("#shareResult").disabled=true;$("#downloadResult").disabled=true;$("#copyResult").disabled=true;
  $("#runTest").disabled=false;$("#runTest span").textContent=t("startTest");setStatus(t("ready"));
  $("#finePrint").textContent="";stopLive?.();stopLive=null;
  addControls(def.id);
  if(def.id==="nfc-scan")setStatus(window.isSecureContext&&typeof window.NDEFReader==="function"?t("nfcReady"):t("nfcUnavailable"));
  if(!dialog.open)dialog.showModal();
}
function addControls(id) {
  if(id==="ip")$("#finePrint").textContent=t("ipProviderNotice");
  if(id==="speed")$("#finePrint").textContent=`${t("dataSaverNote")} ${t("speedPrivacyNote")}`;
  if(id==="dns"||id==="propagation") {
    addField(t("domain"),"domainInput","text","example.com");
    addField(t("selectType"),"dnsType","text","",Object.keys(dnsTypes));
  }
  if(id==="response"||id==="https")addField(t("url"),"urlInput","url","https://example.com");
  if(id==="speed")makeMeter();
  if(id==="stability") {
    const graph=document.createElementNS("http://www.w3.org/2000/svg","svg");
    graph.setAttribute("class","stability-graph");graph.setAttribute("viewBox","0 0 360 116");graph.setAttribute("role","img");graph.setAttribute("aria-label",t("stability"));
    graph.innerHTML="<path class='graph-grid' d='M8 20h344M8 58h344M8 96h344'/><polyline id='stabilityLine' points='' />";
    $("#toolFields").append(graph);
  }
  if(id==="color"||id==="pixel") {
    const stage=document.createElement("div");stage.id="displayStage";stage.className="display-stage";stage.tabIndex=0;
    stage.setAttribute("aria-label",t(id==="pixel"?"displayManual":"colorGuide"));
    const caption=document.createElement("p");caption.id="displayCaption";caption.className="display-caption";caption.textContent=t(id==="pixel"?"displayManual":"colorGuide");
    $("#toolFields").append(stage,caption);
    const tools=document.createElement("div");tools.className="display-tools";
    const previous=actionButton(t("previous"),"button-secondary",()=>changeColor(-1));
    const next=actionButton(t("next"),"button-primary",()=>changeColor(1));
    const full=actionButton(t("fullscreen"),"button-secondary",async()=>{try{await $("#toolFields").requestFullscreen();}catch{setStatus(t("notSupported"));}});
    const exit=actionButton(t("exitFullscreen"),"button-secondary",async()=>{if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});});
    tools.append(previous,next,full,exit);$("#toolFields").append(tools);$("#toolFields").dataset.colorIndex="0";changeColor(0);
  }
  if(id==="multi"||id==="touch") {
    const area=document.createElement("div");area.className="touch-area";area.id="touchArea";area.textContent=t("touchPrompt");$("#toolFields").append(area);
  }
  if(id==="nfc-scan")$("#finePrint").textContent=t("nfcPhysicalLimit");
}
function actionButton(text,style,handler){const b=document.createElement("button");b.type="button";b.className=`button ${style}`;b.textContent=text;b.addEventListener("click",handler);return b;}
function changeColor(delta) {
  const fields=$("#toolFields"),stage=$("#displayStage");if(!stage)return;
  const i=(Number(fields.dataset.colorIndex||0)+delta+colorValues.length)%colorValues.length;fields.dataset.colorIndex=String(i);
  stage.style.background=colorValues[i];stage.textContent="";stage.setAttribute("aria-label",t(colorNames[i]));
  $("#displayCaption").textContent=`${t(colorNames[i])} · ${i+1}/${colorValues.length}`;
}
function drawLatencyGraph(values) {
  const line=$("#stabilityLine");if(!line||!values.length)return;
  const min=Math.min(...values),max=Math.max(...values),range=Math.max(max-min,1);
  const points=values.map((value,index)=>{
    const x=8+(index*(344/Math.max(values.length-1,1)));
    const y=96-((value-min)/range)*68;
    return `${x},${y}`;
  }).join(" ");
  line.setAttribute("points",points);
}
async function fetchBounded(url,options={},ms=8000,signal=activeController?.signal) {
  const controller=new AbortController();let timedOut=false;
  const cancel=()=>controller.abort();
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},ms);
  signal?.addEventListener("abort",cancel,{once:true});
  try{
    const response=await fetch(url,{...options,signal:controller.signal,cache:"no-store"});
    const body=[204,205,304].includes(response.status)?null:await response.arrayBuffer();
    const bounded=new Response(body,{status:response.status,statusText:response.statusText,headers:response.headers});
    for(const key of ["url","redirected","type"])Object.defineProperty(bounded,key,{value:response[key]});
    return bounded;
  }
  catch(error){if(timedOut)throw new DOMException("Timed out","TimeoutError");throw error;}
  finally{clearTimeout(timer);signal?.removeEventListener("abort",cancel);}
}
function checkHost(host) {
  const h=host.toLowerCase().replace(/^\[|\]$/g,"").replace(/\.$/,"");
  if(!h||h==="localhost"||h.endsWith(".localhost")||h.endsWith(".local")||h.endsWith(".internal")||h.endsWith(".home"))return false;
  if(h.includes(":"))return !["::","::1"].includes(h)&&!/^f[cd]/.test(h)&&!/^fe[89ab]/.test(h)&&!h.startsWith("::ffff:");
  const parts=h.split(".");
  if(parts.length===4&&parts.every(p=>/^\d+$/.test(p)&&Number(p)<=255)){
    const [a,b]=parts.map(Number);if(a===0||a===10||a===127||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&b===168)||(a===100&&b>=64&&b<=127)||a>=224)return false;
  }
  return true;
}
function publicUrl(raw) {
  let u;try{u=new URL(/^[a-z][\w+.-]*:\/\//i.test(raw.trim())?raw.trim():`https://${raw.trim()}`);}catch{throw Error("invalidUrl");}
  if(!["https:","http:"].includes(u.protocol)||u.username||u.password||!checkHost(u.hostname))throw Error("invalidUrl");
  return u;
}
function domainName(raw) {
  if(!raw.trim()||/[\/?#@]/.test(raw))throw Error("invalidDomain");
  let u;try{u=new URL(`https://${raw.trim()}`);}catch{throw Error("invalidDomain");}
  if(u.port||!u.hostname.includes(".")||!checkHost(u.hostname))throw Error("invalidDomain");
  return u.hostname;
}
function encodeQuery(name,type) {
  const id=Math.floor(Math.random()*65535),bytes=[id>>8,id&255,1,0,0,1,0,0,0,0,0,0];
  for(const part of name.split(".")){const data=[...new TextEncoder().encode(part)];if(!data.length||data.length>63)throw Error("invalidDomain");bytes.push(data.length,...data);}
  const code=dnsTypes[type];bytes.push(0,code>>8,code&255,0,1);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
function readName(bytes,start) {
  const labels=[];let offset=start,next=null,loops=0;
  while(offset<bytes.length&&loops++<128){
    const n=bytes[offset++];if(n===0){if(next===null)next=offset;break;}
    if((n&192)===192){if(offset>=bytes.length)throw Error("dns");const ptr=((n&63)<<8)|bytes[offset++];if(next===null)next=offset;offset=ptr;continue;}
    if(n&192||offset+n>bytes.length)throw Error("dns");
    labels.push(new TextDecoder().decode(bytes.slice(offset,offset+n)));offset+=n;
  }
  return {name:labels.join("."),offset:next??offset};
}
function decodeDns(buffer) {
  const bytes=new Uint8Array(buffer);if(bytes.length<12)throw Error("dns");
  const view=new DataView(buffer),rcode=view.getUint16(2)&15,qd=view.getUint16(4),an=view.getUint16(6);let off=12;
  for(let i=0;i<qd;i++){off=readName(bytes,off).offset+4;}
  const answers=[];
  for(let i=0;i<an&&i<100;i++){
    const rr=readName(bytes,off);off=rr.offset;if(off+10>bytes.length)break;
    const type=view.getUint16(off),len=view.getUint16(off+8);off+=10;if(off+len>bytes.length)break;
    let data="";
    if(type===1&&len===4)data=[...bytes.slice(off,off+4)].join(".");
    else if(type===28&&len===16)data=Array.from({length:8},(_,j)=>view.getUint16(off+j*2).toString(16)).join(":");
    else if([2,5,12].includes(type))data=readName(bytes,off).name;
    else if(type===15&&len>=3)data=`${view.getUint16(off)} ${readName(bytes,off+2).name}`;
    else if(type===16){let p=off,parts=[];while(p<off+len){const n=bytes[p++];parts.push(new TextDecoder().decode(bytes.slice(p,p+n)));p+=n;}data=parts.join("");}
    else data=[...bytes.slice(off,off+len)].map(x=>x.toString(16).padStart(2,"0")).join("");
    answers.push({type,data});off+=len;
  }
  return {rcode,answers};
}
async function queryDns(resolver,name,type,signal=activeController?.signal) {
  if(resolver==="Quad9") {
    const q=encodeQuery(name,type),res=await fetchBounded(`https://dns.quad9.net/dns-query?dns=${q}`,{headers:{accept:"application/dns-message"}},8000,signal);
    if(!res.ok)throw Error("dns");return decodeDns(await res.arrayBuffer());
  }
  const host=resolver==="Google"?"https://dns.google/resolve":"https://cloudflare-dns.com/dns-query";
  const res=await fetchBounded(`${host}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,{headers:{accept:"application/dns-json"}},8000,signal);
  if(!res.ok)throw Error("dns");const data=await res.json();return {rcode:data.Status,answers:(data.Answer||[]).map(a=>({type:a.type,data:String(a.data).replace(/^"|"$/g,"")}))};
}
function dnsRows(data,type) {
  if(data.answers){if(!data.answers.length)return [[t("answer"),data.rcode===3?"NXDOMAIN":t("noRecords")]];return data.answers.map(a=>[`${t("answer")} · ${Object.keys(dnsTypes).find(k=>dnsTypes[k]===a.type)||a.type}`,a.data]);}
  const a=data.Answer||[];return a.length?a.map(x=>[`${t("answer")} · ${type}`,String(x.data).replace(/^"|"$/g,"")]):[[t("answer"),data.Status===3?"NXDOMAIN":t("noRecords")]];
}
async function measureDownload(signal) {
  const size=4_000_000,url=`https://speed.cloudflare.com/__down?bytes=${size}`;
  const start=performance.now(),res=await fetchBounded(url,{},15000,signal);
  if(!res.ok)throw Error("network");
  const reader=res.body?.getReader();let received=0;
  if(reader){for(;;){const {done,value}=await reader.read();if(done)break;received+=value.byteLength;}}
  else received=(await res.arrayBuffer()).byteLength;
  const seconds=(performance.now()-start)/1000;if(!received||seconds<=0)throw Error("network");
  return received*8/seconds/1e6;
}
async function measureUpload(signal) {
  const payload=new Uint8Array(300_000);crypto.getRandomValues(payload.subarray(0,65536));
  for(let i=65536;i<payload.length;i+=65536)payload.set(payload.subarray(0,Math.min(65536,payload.length-i)),i);
  const start=performance.now(),res=await fetchBounded("https://speed.cloudflare.com/__up",{method:"POST",body:new Blob([payload]),headers:{"content-type":"application/octet-stream"}},15000,signal);
  if(!res.ok)throw Error("network");
  const seconds=(performance.now()-start)/1000;return payload.length*8/seconds/1e6;
}
async function latencySample(signal) {
  const start=performance.now();const res=await fetchBounded("https://api4.ipify.org?format=json",{},6000,signal);
  if(!res.ok)throw Error("network");const json=await res.json();if(!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(json.ip||""))throw Error("network");return performance.now()-start;
}
function metricRows(measurement) {
  const rows=[];
  if(Number.isFinite(measurement.download))rows.push([t("download"),`${measurement.download.toFixed(2)} Mbps`]);
  if(Number.isFinite(measurement.upload))rows.push([t("upload"),`${measurement.upload.toFixed(2)} Mbps`]);
  if(Number.isFinite(measurement.ping))rows.push([t("latency"),`${measurement.ping.toFixed(1)} ms`]);
  if(Number.isFinite(measurement.jitter))rows.push([t("jitter"),`${measurement.jitter.toFixed(1)} ms`]);
  if(Number.isFinite(measurement.minPing))rows.push([t("minimumResponse"),`${measurement.minPing.toFixed(1)} ms`]);
  if(Number.isFinite(measurement.maxPing))rows.push([t("maximumResponse"),`${measurement.maxPing.toFixed(1)} ms`]);
  if(Number.isFinite(measurement.packetLoss))rows.push([t("failedRequests"),`${measurement.packetLoss}%`]);
  if(measurement.stability)rows.push([t("stability"),measurement.stability]);
  return rows;
}
async function run(id) {
  const signal=activeController.signal;
  if(id==="ipv"){
    const endpoints=[["IPv4","https://api4.ipify.org?format=json"],["IPv6","https://api6.ipify.org?format=json"]];
    return Promise.all(endpoints.map(async([label,url])=>{try{const r=await fetchBounded(url,{},7000,signal);if(!r.ok)throw Error();const v=await r.json();if(typeof v.ip!=="string"||!v.ip.trim())throw Error();return [`${label} ${t("connection")}`,t("reachable")];}catch{return [`${label} ${t("connection")}`,t("unavailable")];}}));
  }
  if(id==="ip"){
    const r=await fetchBounded("https://ipwho.is/",{},8000,signal);if(!r.ok)throw Error("network");const d=await r.json();
    if(d.success===false||typeof d.ip!=="string"||!d.ip.trim())throw Error("network");
    const rows=[[t("publicAddress"),d.ip,true],[t("connection"),t("reachable")]];
    if(d.connection?.isp)rows.push([t("isp"),d.connection.isp]);
    if(d.connection?.asn)rows.push([t("asn"),String(d.connection.asn)]);
    const location=[d.city,d.region,d.country].filter(value=>typeof value==="string"&&value.trim()).join(", ");
    if(location)rows.push([t("approxLocation"),location,true]);
    rows.push([t("measurementScope"),t("ipProviderNotice")]);
    return rows;
  }
  if(id==="dns"||id==="propagation"){
    const name=domainName($("#domainInput").value),type=$("#dnsType").value;
    if(id==="dns"){const data=await queryDns("Cloudflare",name,type);return [[t("domain"),name],[t("selectType"),type],...dnsRows(data,type),[t("resolver"),"Cloudflare DNS"]];}
    const results=await Promise.all(["Google","Cloudflare","Quad9"].map(async resolver=>{try{const data=await queryDns(resolver,name,type,signal);return [resolver==="Google"?"Google Public DNS":resolver==="Cloudflare"?"Cloudflare DNS":"Quad9 DNS",data.answers?.length?data.answers.map(a=>a.data).join(", "):data.Answer?.length?data.Answer.map(a=>a.data).join(", "):t("noRecords")];}catch{return [resolver==="Google"?"Google Public DNS":resolver==="Cloudflare"?"Cloudflare DNS":"Quad9 DNS",t("resolverUnavailable")];}}));
    return [[t("domain"),name],[t("selectType"),type],...results];
  }
  if(id==="response"||id==="https"){
    let u=publicUrl($("#urlInput").value);const original=u.href;
    if(id==="https")u.protocol="https:";
    const started=performance.now();let res;
    try{res=await fetchBounded(u.href,{method:"HEAD",mode:"cors",redirect:"follow"},8000,signal);}catch(e){if(e.name==="TimeoutError")throw e;throw Error("browserLimited");}
    const elapsed=performance.now()-started;const rows=[[t("url"),u.origin],[t("responseTime"),`${elapsed.toFixed(0)} ms`],[t("httpStatus"),String(res.status)],[t("connection"),res.ok?t("reachable"):`HTTP ${res.status}`],[t("redirect"),res.url!==u.href?`${t("redirectTarget")}: ${res.url}`:t("noRedirectObserved")]];
    if(id==="https"){
      rows.push(["HTTPS",res.url.startsWith("https:")?t("supported"):t("unavailable")],[t("tlsValidation"),t("browserTls")],[t("certificateDetails"),t("certificatePrivate")]);
      if(new URL(original).protocol==="http:"){
        const httpUrl=new URL(original);httpUrl.protocol="http:";
        try {
          const httpResponse=await fetchBounded(httpUrl.href,{method:"HEAD",mode:"cors",redirect:"follow"},8000,signal);
          rows.push([t("httpRedirect"),httpResponse.url.startsWith("https:")?t("redirectObserved"):t("redirectNotObserved")]);
        } catch(error) {
          if(error.name==="AbortError")throw error;
          rows.push([t("httpRedirect"),t("redirectUnknown")]);
        }
      }
    }
    return rows;
  }
  if(id==="speed"){
    const value=$(".meter-value");value.textContent=t("loading");
    let ping=null,download=null,upload=null;
    let jitter=null;
    try{
      setStatus(t("measuringPing"));progress(15);
      const samples=[];
      for(let i=0;i<3;i++){try{samples.push(await latencySample(signal));}catch(e){if(e.name==="AbortError")throw e;}}
      if(samples.length){ping=samples.reduce((sum,sample)=>sum+sample,0)/samples.length;jitter=samples.length>1?samples.slice(1).reduce((sum,sample,index)=>sum+Math.abs(sample-samples[index]),0)/(samples.length-1):null;}
    }catch(e){if(e.name==="AbortError")throw e;}
    try{setStatus(t("measuringDownload"));progress(38);download=await measureDownload(signal);value.textContent=download.toFixed(1);$(".meter-arc").style.strokeDashoffset=String(283*(1-Math.min(download,100)/100));}catch(e){value.textContent="—";if(e.name==="AbortError")throw e;}
    try{setStatus(t("measuringUpload"));progress(76);upload=await measureUpload(signal);}catch(e){if(e.name==="AbortError")throw e;}
    const out={ping,jitter,download,upload};measured.speed=out;localStorage.setItem("compivox-measurements",JSON.stringify({speed:out,stability:measured.stability}));
    const rows=metricRows(out);if(upload===null)rows.push([t("upload"),t("notAvailable")]);if(!rows.length)throw Error("network");return [...rows,[t("measurementScope"),t("speedEndpoint")]];
  }
  if(id==="stability"){
    const values=[];let failed=0;setStatus(t("running"));
    for(let i=0;i<6;i++){if(signal.aborted)throw new DOMException("Aborted","AbortError");progress((i/6)*90);try{values.push(await latencySample(signal));}catch(e){if(e.name==="AbortError")throw e;failed++;}drawLatencyGraph(values);if(i<5)await new Promise(r=>setTimeout(r,220));}
    if(!values.length)throw Error("network");const avg=values.reduce((a,b)=>a+b,0)/values.length,jitter=values.length>1?values.slice(1).reduce((a,b,i)=>a+Math.abs(b-values[i]),0)/(values.length-1):0;
    const out={ping:avg,minPing:Math.min(...values),maxPing:Math.max(...values),jitter,packetLoss:Math.round(failed/6*100),stability:t(failed===0?"stable":failed<2?"variable":"unstable")};measured.stability=out;localStorage.setItem("compivox-measurements",JSON.stringify({speed:measured.speed,stability:out}));
    return [...metricRows(out),[t("measurementScope"),t("sampleEndpoint")]];
  }
  if(id==="quality"||id==="gaming"||id==="streaming"){
    const saved=JSON.parse(localStorage.getItem("compivox-measurements")||"{}"),speed=saved.speed||{},stability=saved.stability||{};
    const values={...speed,...stability},rows=metricRows(values);
    if(id==="quality"){
      const scores=[];if(Number.isFinite(values.ping))scores.push(Math.max(0,100-values.ping/2.5));if(Number.isFinite(values.jitter))scores.push(Math.max(0,100-values.jitter*1.25));if(Number.isFinite(values.download))scores.push(Math.min(100,values.download*2));if(Number.isFinite(values.upload))scores.push(Math.min(100,values.upload*5));if(Number.isFinite(values.packetLoss))scores.push(Math.max(0,100-values.packetLoss));
      if(!scores.length)throw Error("noSpeed");return [[t("qualityScore"),`${Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}/100`],[t("method"),t("qualityMethod")],...rows];
    }
    if(id==="gaming"){
      const gamingRows=[];
      if(Number.isFinite(values.ping))gamingRows.push([t("latency"),`${values.ping.toFixed(1)} ms`]);else gamingRows.push([t("latency"),t("notMeasured")]);
      if(Number.isFinite(values.jitter))gamingRows.push([t("jitter"),`${values.jitter.toFixed(1)} ms`]);else gamingRows.push([t("jitter"),t("notMeasured")]);
      if(Number.isFinite(values.packetLoss))gamingRows.push([t("failedRequests"),`${values.packetLoss}%`]);else gamingRows.push([t("failedRequests"),t("notMeasured")]);
      gamingRows.push([t("stability"),stability.stability||t("notMeasured")],[t("gameScope"),t("notGameServer")]);
      if(!Number.isFinite(values.ping)&&!Number.isFinite(values.jitter)&&!Number.isFinite(values.packetLoss)&&!stability.stability)throw Error("noSpeed");
      return gamingRows;
    }
    if(!Number.isFinite(speed.download))throw Error("noSpeed");const speedValue=speed.download,tier=speedValue>=25?"stream4k":speedValue>=8?"stream1080":speedValue>=3?"stream720":"streamBelow";return [[t("download"),`${speedValue.toFixed(2)} Mbps`],[t("streamTier"),t(tier)],[t("note"),t("streamEstimate")],[t("stability"),stability.stability||t("notMeasured")]];
  }
  if(id==="disconnect")return [[t("connection"),navigator.onLine?t("online"):t("offline")],[t("offlineSignal"),t("offlineSignal")],[t("events"),String(measured.offlineEvents+measured.reconnects)],[t("reconnects"),String(measured.reconnects)]];
  if(id==="info"){
    const ua=navigator.userAgent;
    const browser=navigator.userAgentData?.brands?.map(item=>item.brand).filter(name=>name!=="Not=A?Brand").join(", ")
      ||(/Edg\//.test(ua)?"Microsoft Edge":/Firefox\//.test(ua)?"Firefox":/CriOS|Chrome\//.test(ua)?"Chrome":/Safari\//.test(ua)?"Safari":t("notAvailable"));
    const os=navigator.userAgentData?.platform||(/Windows/i.test(ua)?"Windows":/Android/i.test(ua)?"Android":/iPhone|iPad|iPod/i.test(ua)?"iOS":/Mac OS/i.test(ua)?"macOS":/Linux/i.test(ua)?"Linux":t("notAvailable"));
    const rows=[[t("deviceType"),/Mobi|Android|iPhone/i.test(ua)?t("mobileDevice"):t("desktopDevice")],[t("devicePlatform"),os],[t("deviceBrowser"),browser],[t("deviceScreen"),`${screen.width} × ${screen.height}`],[t("deviceViewport"),`${innerWidth} × ${innerHeight}`],[t("devicePixelRatio"),String(devicePixelRatio)],[t("touchSupport"),t(navigator.maxTouchPoints>0?"supported":"notSupported")],[t("colorScheme"),matchMedia("(prefers-color-scheme: dark)").matches?t("darkScheme"):t("lightScheme")],[t("deviceLanguage"),navigator.language],[t("onlineStatus"),navigator.onLine?t("online"):t("offline")]];
    if(navigator.hardwareConcurrency)rows.push([t("deviceCores"),String(navigator.hardwareConcurrency)]);
    if(navigator.deviceMemory)rows.push([t("deviceMemory"),`${navigator.deviceMemory} GB`]);return rows;
  }
  if(id==="compat"){
    const webgl=(()=>{try{const c=document.createElement("canvas");return !!(c.getContext("webgl")||c.getContext("experimental-webgl"));}catch{return false;}})();
    const features=[["Web NFC",typeof window.NDEFReader==="function"?(window.isSecureContext?"supported":"limited"):"notSupported"],["Web Share",navigator.share?"supported":"notSupported"],["Fullscreen API",document.documentElement.requestFullscreen?"supported":"notSupported"],["Web Workers",window.Worker?"supported":"notSupported"],["WebGL",webgl?"supported":"notSupported"],["Service Worker API","serviceWorker" in navigator?(window.isSecureContext?"supported":"limited"):"notSupported"],["Clipboard API",navigator.clipboard?.writeText?(window.isSecureContext?"supported":"limited"):"notSupported"]];
    return features.map(([name,status])=>[name,t(status)]);
  }
  if(id==="frame"||id==="refresh"){
    const frames=[];let last=null;const start=performance.now(),duration=2800;setStatus(t("running"));
    await new Promise((resolve,reject)=>{
      let frameId;const abort=()=>{cancelAnimationFrame(frameId);reject(new DOMException("Aborted","AbortError"));};
      if(signal.aborted)return abort();signal.addEventListener("abort",abort,{once:true});
      const tick=now=>{if(last!==null)frames.push(now-last);last=now;progress(Math.min(95,(now-start)/duration*100));if(now-start>=duration){signal.removeEventListener("abort",abort);resolve();}else frameId=requestAnimationFrame(tick);};frameId=requestAnimationFrame(tick);
    });
    const mean=frames.reduce((a,b)=>a+b,0)/frames.length,variance=frames.reduce((a,b)=>a+(b-mean)**2,0)/frames.length,sd=Math.sqrt(variance);
    const dropped=frames.filter(frame=>frame>mean*1.5).length;
    const rows=[[t("fps"),(1000/mean).toFixed(1)],[t("frameTime"),`${mean.toFixed(2)} ms`],[t("frameVariance"),`${sd.toFixed(2)} ms`],[t("frameDropsEstimate"),String(dropped)],[t("frameStability"),t(sd<3?"stable":sd<8?"variable":"unstable")]];
    if(id==="refresh")rows.push([t("estimatedRate"),`${Math.round(1000/mean)} Hz · ${t("refreshScope")}`]);return rows;
  }
  if(id==="orientation"){
    const type=screen.orientation?.type||(innerHeight>=innerWidth?"portrait":"landscape");
    return [[t("orientation"),t(type.startsWith("portrait")?"portrait":"landscape")],[t("angle"),`${screen.orientation?.angle??window.orientation??0}°`],[t("changes"),String(measured.orientationChanges)]];
  }
  if(id==="color"||id==="pixel")return [[t("keyPixel"),t("displayManual")],[t("colorGuide"),t("colorGuide")]];
  if(id==="touch"||id==="multi")return touchTest(id,signal);
  if(id==="nfc-access"||id==="nfc-info"){
    const tag=sessionStorage.getItem("compivox-nfc-tag")||new URLSearchParams(location.search).get("nfc")||"";
    const config=NFC_TAGS[tag];
    const rows=[[t("accessMethod"),tag?t("tagOpened"):t("webOpened")],[t("tagId"),tag||t("noNfcTag")]];
    if(config)rows.push([t("tagName"),config.name],[t("tagUrl"),config.url],[t("tagDescription"),config.description],[t("registrationState"),t("configured")]);
    rows.push([t("note"),t("nfcPhysicalLimit")]);
    return rows;
  }
  if(id==="nfc-scan")return readNfc(signal);
  throw Error("failed");
}
function touchTest(id,signal){
  return new Promise(resolve=>{
    const area=$("#touchArea"),points=new Map();let max=0,done=false;
    const drawPoints=()=>{
      area.replaceChildren();
      if(!points.size){area.textContent=t("touchPrompt");return;}
      for(const point of points.values()){
        const marker=document.createElement("span");marker.className="touch-point";marker.style.left=`${point.x}px`;marker.style.top=`${point.y}px`;marker.setAttribute("aria-hidden","true");area.append(marker);
      }
    };
    const render=()=>{
      const active=points.size;max=Math.max(max,active);
      return [[t("touchCount"),String(active)],[t("touchMax"),String(max)],[t("pointerType"),[...new Set([...points.values()].map(p=>p.type))].join(", ")||t("noTouch")],[t("touchPositions"),[...points.values()].map(p=>`${p.x}, ${p.y}`).join(" · ")||t("noTouch")]];
    };
    const finish=()=>{if(done)return;done=true;area.removeEventListener("pointerdown",down);area.removeEventListener("pointermove",move);area.removeEventListener("pointerup",up);area.removeEventListener("pointercancel",up);resolve([...render(),[t("displayManual"),t("displayManual")]]);};
    const pos=e=>{const r=area.getBoundingClientRect();return{x:Math.round(e.clientX-r.left),y:Math.round(e.clientY-r.top),type:e.pointerType||"unknown"};};
    const down=e=>{if(id==="multi"&&e.pointerType!=="touch")return;e.preventDefault();area.setPointerCapture?.(e.pointerId);points.set(e.pointerId,pos(e));drawPoints();$("#resultGrid").replaceChildren();addRows(render());setStatus(t("running"));};
    const move=e=>{if(points.has(e.pointerId)){points.set(e.pointerId,pos(e));drawPoints();$("#resultGrid").replaceChildren();addRows(render());}};
    const up=e=>{points.delete(e.pointerId);drawPoints();$("#resultGrid").replaceChildren();addRows(render());if(points.size===0&&max>0){finishStatus();finish();}};
    area.addEventListener("pointerdown",down);area.addEventListener("pointermove",move);area.addEventListener("pointerup",up);area.addEventListener("pointercancel",up);
    signal.addEventListener("abort",()=>{finish();},{once:true});
    if(id==="touch")setTimeout(()=>{if(!done){finish();finishStatus();}},4500);
  });
}
function readNfc(signal){
  if(!window.isSecureContext||typeof window.NDEFReader!=="function")throw Error("nfcUnavailable");
  const reader=new window.NDEFReader();
  return new Promise((resolve,reject)=>{
    let settled=false;const finish=(error,rows)=>{if(settled)return;settled=true;reader.removeEventListener("reading",reading);reader.removeEventListener("readingerror",readingError);if(error)reject(error);else resolve(rows);};
    const reading=e=>{
      const records=e.message.records.map(r=>{let data="";try{data=r.data?new TextDecoder(r.encoding||"utf-8").decode(r.data):"";}catch{data="(binary data)";}return `${r.recordType}: ${data||"(empty)"}`;});
      finish(null,[[t("tagId"),e.serialNumber||t("notAvailable")],[t("ndefData"),records.join("\n")||"(empty)"]]);
    };
    const readingError=()=>finish(Error("nfcReadFailed"));
    reader.addEventListener("reading",reading);reader.addEventListener("readingerror",readingError);
    setStatus(t("nfcScanning"));progress(35);
    reader.scan({signal}).catch(e=>finish(Error(e.name==="NotAllowedError"?"nfcPermission":"nfcReadFailed")));
    signal.addEventListener("abort",()=>finish(new DOMException("Aborted","AbortError")),{once:true});
  });
}
async function executeTest(){
  if(!current)return;const test=current;activeController?.abort();activeController=new AbortController();const signal=activeController.signal;
  $("#runTest").disabled=true;$("#shareResult").disabled=true;$("#resultGrid").replaceChildren();progress(5);setStatus(t("running"));
  try{const rows=await run(test.id);if(!dialog.open||current!==test||signal.aborted)return;if(rows)addRows(rows);const label = test.title ? t(test.title) : $("#dialogTitle").textContent;recordResult(test.group, label, rows);finishStatus(test.id==="nfc-scan"?t("keyDetected"):t("complete"));}
  catch(error){if(error.name==="AbortError"){setStatus(t("cancelled"));return;}const known=["invalidDomain","invalidUrl","browserLimited","noSpeed","nfcUnavailable","nfcReadFailed","nfcPermission"];setStatus(known.includes(error.message)?t(error.message):t("failed"));$("#runTest").disabled=false;progress(0);}
}
async function share() {
  const text=buildShareText();
  try{
    if(navigator.share){
      const blob=await createShareImage();
      const file=new File([blob],"compivox-result.png",{type:"image/png"});
      if(navigator.canShare?.({files:[file]}))await navigator.share({title:"COMPI VOX",text,files:[file]});
      else await navigator.share({title:"COMPI VOX",text});
    }else{
      await downloadShareImage();
      await copyResult();
    }
  }catch(e){if(e.name!=="AbortError")setStatus(t("shareFailed"));}
}
function buildShareText(){
  const lines=[`COMPI VOX — ${$("#dialogTitle").textContent}`,new Date().toLocaleString(),...$$(".result-row:not([data-private])",$("#resultGrid")).map(row=>`${$(".result-label",row).textContent}: ${$(".result-value",row).textContent}`)];
  return lines.join("\n");
}
function savedResultText(result){
  return [`COMPI VOX — ${result.title}`,new Date(result.createdAt).toLocaleString(),...(result.rows||[]).map(([label,value])=>`${label}: ${value}`)].join("\n");
}
async function shareSavedResult(id){
  const result=getSavedResults().find(item=>item.id===id);
  if(!result)return;
  const text=savedResultText(result);
  try{
    if(navigator.share){
      const blob=await createShareImage(result.title,result.rows,new Date(result.createdAt));
      const file=new File([blob],"compivox-result.png",{type:"image/png"});
      if(navigator.canShare?.({files:[file]}))await navigator.share({title:"COMPI VOX",text,files:[file]});
      else await navigator.share({title:"COMPI VOX",text});
    }else{
      await downloadShareImage(result);
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
    }
  }catch(error){if(error.name!=="AbortError")showToast(t("shareFailed"));}
}
function createShareImage(title=$("#dialogTitle")?.textContent||t("resultsTitle"), rows=$$(".result-row:not([data-private])",$("#resultGrid")).map(row=>[$(".result-label",row).textContent,$(".result-value",row).textContent]), date=new Date()){
  const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=630;
  const context=canvas.getContext("2d");if(!context)throw Error("canvasUnavailable");
  const gradient=context.createLinearGradient(0,0,1200,630);
  gradient.addColorStop(0,"#fffafd");gradient.addColorStop(.48,"#eee5f7");gradient.addColorStop(1,"#dff1f7");
  context.fillStyle=gradient;context.fillRect(0,0,canvas.width,canvas.height);
  context.fillStyle="rgba(255,255,255,.68)";context.beginPath();context.ellipse(850,90,430,200,-.28,0,Math.PI*2);context.fill();
  context.fillStyle="#766a8b";context.font="700 23px Manrope, Segoe UI, sans-serif";context.fillText("COMPI VOX",72,76);
  context.fillStyle="#282536";context.font="600 42px Manrope, Segoe UI, sans-serif";context.fillText(String(title).slice(0,38),72,150);
  context.fillStyle="#797486";context.font="20px Segoe UI, sans-serif";context.fillText(date.toLocaleString(),72,190);
  rows.slice(0,8).forEach(([label,value],index)=>{
    const x=72+(index%2)*540,y=230+Math.floor(index/2)*83;
    context.fillStyle="rgba(255,255,255,.76)";context.beginPath();context.roundRect(x,y,500,66,14);context.fill();
    context.fillStyle="#797486";context.font="16px Segoe UI, sans-serif";context.fillText(String(label).slice(0,48),x+18,y+25);
    context.fillStyle="#282536";context.font="600 20px Segoe UI, sans-serif";context.fillText(String(value).slice(0,48),x+18,y+51);
  });
  context.fillStyle="#8b8299";context.font="15px Segoe UI, sans-serif";context.fillText("Measured in your browser · COMPI VOX",72,596);
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error("imageUnavailable")),"image/png"));
}
async function downloadShareImage(result=null){
  const blob=result
    ? await createShareImage(result.title,result.rows,new Date(result.createdAt))
    : await createShareImage();
  const url=URL.createObjectURL(blob),link=document.createElement("a");
  link.href=url;link.download=`compivox-${result?.id||current?.id||"result"}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function copyResult(){
  const text=buildShareText();
  if(!navigator.clipboard?.writeText)throw Error("clipboardUnavailable");
  await navigator.clipboard.writeText(text);setStatus(t("copied"));
}
function closeDialog(){
  activeController?.abort();activeController=null;stopLive?.();stopLive=null;
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  if(dialog.open)dialog.close();current=null;
}
function intro() {
  const el=$("#intro"),bar=$("#introProgress");if(!el)return;
  const duration=3000,start=performance.now();let done=false;
  const finish=()=>{if(done)return;done=true;bar.style.width="100%";el.classList.add("show-done");setTimeout(()=>el.classList.add("hidden"),650);};
  const tick=now=>{if(done)return;const p=Math.min(1,(now-start)/duration);bar.style.width=`${(p*100).toFixed(1)}%`;if(p<1)requestAnimationFrame(tick);else finish();};
  introTimer=setTimeout(finish,duration+50);requestAnimationFrame(tick);
}
function monitorConnection(){
  let wasOnline=Boolean(navigator.onLine);
  const change=()=>{
    const online=Boolean(navigator.onLine);
    if(wasOnline&&!online)measured.offlineEvents++;
    if(!wasOnline&&online)measured.reconnects++;
    wasOnline=online;
    if(current?.id==="disconnect"&&dialog.open)executeLiveDisconnect();
  };
  window.addEventListener("online",change);window.addEventListener("offline",change);
  return()=>{window.removeEventListener("online",change);window.removeEventListener("offline",change);};
}
function executeLiveDisconnect(){
  $("#resultGrid").replaceChildren();addRows([[t("connection"),navigator.onLine?t("online"):t("offline")],[t("offlineSignal"),t("offlineSignal")],[t("events"),String(measured.offlineEvents+measured.reconnects)],[t("reconnects"),String(measured.reconnects)]]);
}

$("#language").addEventListener("change",e=>{lang=e.target.value;localStorage.setItem("compivox-language",lang);$("#settingsLanguage").value = lang; trMarkup();});
$("#settingsLanguage").addEventListener("change",e=>{lang=e.target.value;localStorage.setItem("compivox-language",lang);$("#language").value = lang; trMarkup();});
$("#menuToggle").addEventListener("click",()=>{const menu=$("#mobileMenu"),open=menu.hidden;menu.hidden=!open;$("#menuToggle").setAttribute("aria-expanded",String(open));});
$("#mobileMenu").addEventListener("click",e=>{if(e.target.closest("a")){$("#mobileMenu").hidden=true;$("#menuToggle").setAttribute("aria-expanded","false");}});
$("#clearResultsBtn").addEventListener("click",()=>{saveSavedResults([]);renderResultsPage();});
$("#clearResultsFromSettingsBtn").addEventListener("click",()=>{saveSavedResults([]);renderResultsPage();});
$("#resetSettingsBtn").addEventListener("click",()=>{lang="en";preferences.animations=true;preferences.reduceMotion=false;localStorage.setItem("compivox-language",lang);localStorage.setItem("compivox-settings",JSON.stringify(preferences));$("#language").value = lang;$("#settingsLanguage").value = lang;trMarkup();});
$("#animationsSetting").addEventListener("change",e=>{preferences.animations=e.target.checked;localStorage.setItem("compivox-settings",JSON.stringify(preferences));renderSettingsPage();});
$("#reduceMotionSetting").addEventListener("change",e=>{preferences.reduceMotion=e.target.checked;localStorage.setItem("compivox-settings",JSON.stringify(preferences));renderSettingsPage();});
$("#runTest").addEventListener("click",executeTest);$("#shareResult").addEventListener("click",share);
$("#downloadResult").addEventListener("click",()=>downloadShareImage().catch(()=>setStatus(t("shareFailed"))));
$("#copyResult").addEventListener("click",()=>copyResult().catch(()=>setStatus(t("shareFailed"))));
$("#closeDialog").addEventListener("click",closeDialog);$("#backHome").addEventListener("click",closeDialog);
dialog.addEventListener("click",e=>{if(e.target===dialog)closeDialog();});
dialog.addEventListener("close",()=>{activeController?.abort();stopLive?.();if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});});
$("#finePrint").addEventListener("click",()=>{});
monitorConnection();
trMarkup();renderCards();intro();

// Keep live device listeners scoped to the corresponding open diagnostic.
const originalOpenTest=openTest;
openTest=function(def){
  originalOpenTest(def);
  if(def.id==="orientation"){
    const onChange=()=>{measured.orientationChanges++;if(dialog.open&&current?.id==="orientation"){const type=screen.orientation?.type||(innerHeight>=innerWidth?"portrait":"landscape");$("#resultGrid").replaceChildren();addRows([[t("orientation"),t(type.startsWith("portrait")?"portrait":"landscape")],[t("angle"),`${screen.orientation?.angle??window.orientation??0}°`],[t("changes"),String(measured.orientationChanges)]]);}};
    screen.orientation?.addEventListener?.("change",onChange);window.addEventListener("orientationchange",onChange);stopLive=()=>{screen.orientation?.removeEventListener?.("change",onChange);window.removeEventListener("orientationchange",onChange);};
  }
  if(def.id==="disconnect"){executeLiveDisconnect();stopLive=()=>{};}
};
D.ko = Object.assign(D.ko || {}, {
  navHome:"홈",navNetwork:"네트워크",navDevice:"기기",navNfc:"NFC",navResults:"결과",navSettings:"설정",
  resultsKicker:"04 / 기록",resultsTitle:"결과",resultsIntro:"브라우저에 저장된 검사 기록을 확인하고 관리하세요.",settingsKicker:"05 / 환경설정",settingsTitle:"설정",settingsIntro:"진단 환경을 조정하고 브라우저에 저장된 데이터를 관리하세요.",clearResults:"저장된 결과 삭제",deleteResult:"삭제",noSavedResults:"저장된 결과가 아직 없습니다.",localStorageMode:"기기 로컬 저장",storageMode:"저장 방식",resetDefaults:"기본값으로 재설정"
});
D.ja = Object.assign(D.ja || {}, {
  navHome:"ホーム",navNetwork:"ネットワーク",navDevice:"デバイス",navNfc:"NFC",navResults:"結果",navSettings:"設定",
  resultsKicker:"04 / 履歴",resultsTitle:"結果",resultsIntro:"このブラウザーで実行した検査結果を確認・管理します。",settingsKicker:"05 / 設定",settingsTitle:"設定",settingsIntro:"診断の設定を調整し、ブラウザー内のデータを管理します。",clearResults:"保存済み結果を削除",deleteResult:"削除",noSavedResults:"保存された結果はまだありません。",localStorageMode:"端末のローカル保存",storageMode:"保存先",resetDefaults:"初期設定に戻す"
});
D.zh = Object.assign(D.zh || {}, {
  navHome:"首页",navNetwork:"网络",navDevice:"设备",navNfc:"NFC",navResults:"结果",navSettings:"设置",
  resultsKicker:"04 / 历史",resultsTitle:"结果",resultsIntro:"查看并管理你在此浏览器中运行过的检测结果。",settingsKicker:"05 / 偏好",settingsTitle:"设置",settingsIntro:"调整诊断偏好并保留本地浏览器数据。",clearResults:"清除已保存结果",deleteResult:"删除",noSavedResults:"暂无已保存结果。",localStorageMode:"本地设备存储",storageMode:"存储方式",resetDefaults:"重置为默认设置"
});
D.en = Object.assign(D.en, {
  nfcDetected:"NFC Tag Detected!",nfcIntro:"Successfully connected through NFC. Physical contact with a tag cannot be verified.",tagUrl:"Tag URL",speedPrivacyNote:"Network tests connect to Cloudflare and ipify to measure transfer and response time.",
  animations:"Animations",reduceMotion:"Reduce motion",dataSaverNote:"Speed tests transfer sample data. Avoid them on metered connections if you want to conserve data.",privacyNoteSettings:"Test history stays in this browser. Public IP lookups send your IP to the selected external provider; IP and location details are not saved.",
  historyUnavailable:"Saved history could not be read. Clear it from Settings to start a new history.",deviceType:"Device type",mobileDevice:"Mobile device",desktopDevice:"Desktop or tablet",touchSupport:"Touch support",colorScheme:"Color scheme",darkScheme:"Dark",lightScheme:"Light",onlineStatus:"Online status",
  isp:"ISP",asn:"ASN",approxLocation:"Approximate location",ipProviderNotice:"This lookup sends your public IP address to ipwho.is. The address and approximate location are not saved in history or shared.",
  downloadImage:"Download image",copyResults:"Copy results",tagName:"Tag name",tagDescription:"Description",registrationState:"Registration state",configured:"Configured",
  minimumResponse:"Minimum HTTP response",maximumResponse:"Maximum HTTP response",failedRequests:"Failed HTTP requests",estimatedRate:"Estimated refresh rate",frameDropsEstimate:"Frame drops estimate"
});
D.ko = Object.assign(D.ko, {
  nfcDetected:"NFC 태그가 감지되었습니다!",nfcIntro:"NFC 전용 URL을 통해 접속했습니다. 실제 태그 접촉 여부는 확인할 수 없습니다.",tagUrl:"태그 URL",speedPrivacyNote:"네트워크 검사에는 전송 및 응답 시간 측정을 위해 Cloudflare와 ipify가 사용됩니다.",
  animations:"애니메이션",reduceMotion:"동작 줄이기",dataSaverNote:"속도 검사는 샘플 데이터를 전송합니다. 데이터 사용량을 아끼려면 종량제 연결에서 검사를 피하세요.",privacyNoteSettings:"검사 기록은 이 브라우저에만 저장됩니다. 공인 IP 조회 시 선택한 외부 서비스에 IP가 전달되며, IP와 위치 정보는 기록에 저장되지 않습니다.",
  historyUnavailable:"저장된 기록을 읽을 수 없습니다. 설정에서 기록을 삭제한 뒤 다시 시작해 주세요.",deviceType:"기기 유형",mobileDevice:"모바일 기기",desktopDevice:"데스크톱 또는 태블릿",touchSupport:"터치 지원",colorScheme:"색상 모드",darkScheme:"다크",lightScheme:"라이트",onlineStatus:"온라인 상태",
  isp:"인터넷 서비스 제공자",asn:"자율 시스템 번호(ASN)",approxLocation:"대략적인 위치",ipProviderNotice:"조회 과정에서 공인 IP 주소가 ipwho.is에 전달됩니다. IP와 대략적인 위치는 검사 기록이나 공유 결과에 저장되지 않습니다.",
  downloadImage:"이미지 저장",copyResults:"결과 복사",tagName:"태그 이름",tagDescription:"설명",registrationState:"등록 상태",configured:"코드에 설정됨",
  minimumResponse:"최소 HTTP 응답 시간",maximumResponse:"최대 HTTP 응답 시간",failedRequests:"실패한 HTTP 요청",estimatedRate:"추정 화면 주사율",frameDropsEstimate:"프레임 드롭 추정 횟수"
});
D.ja = Object.assign(D.ja, {
  nfcDetected:"NFC タグを検出しました！",nfcIntro:"NFC 専用 URL から接続しました。実際にタグへ触れたかどうかは確認できません。",tagUrl:"タグ URL",speedPrivacyNote:"通信テストでは転送量と応答時間の測定に Cloudflare と ipify を使用します。",
  animations:"アニメーション",reduceMotion:"視覚効果を減らす",dataSaverNote:"速度テストでは測定用データを転送します。データ通信量を抑えたい場合は、従量制接続での実行を避けてください。",privacyNoteSettings:"検査履歴はこのブラウザー内に保存されます。パブリック IP の確認では選択した外部サービスに IP が送信されますが、IP と位置情報は履歴に保存されません。",
  historyUnavailable:"保存した履歴を読み込めません。設定から履歴を削除して、もう一度お試しください。",deviceType:"デバイスの種類",mobileDevice:"モバイルデバイス",desktopDevice:"デスクトップまたはタブレット",touchSupport:"タッチ対応",colorScheme:"配色モード",darkScheme:"ダーク",lightScheme:"ライト",onlineStatus:"オンライン状態",
  isp:"インターネットサービスプロバイダー",asn:"ASN",approxLocation:"おおよその位置",ipProviderNotice:"確認のため、パブリック IP アドレスが ipwho.is に送信されます。IP とおおよその位置は履歴や共有結果に保存されません。",
  downloadImage:"画像を保存",copyResults:"結果をコピー",tagName:"タグ名",tagDescription:"説明",registrationState:"登録状態",configured:"コードに設定済み",
  minimumResponse:"最小 HTTP 応答時間",maximumResponse:"最大 HTTP 応答時間",failedRequests:"失敗した HTTP リクエスト",estimatedRate:"推定リフレッシュレート",frameDropsEstimate:"フレーム落ちの推定回数"
});
D.zh = Object.assign(D.zh, {
  nfcDetected:"检测到 NFC 标签！",nfcIntro:"已通过 NFC 专属网址访问。无法验证设备是否实际触碰了标签。",tagUrl:"标签网址",speedPrivacyNote:"网络测试会连接 Cloudflare 和 ipify，以测量传输速度和响应时间。",
  animations:"动画效果",reduceMotion:"减少动态效果",dataSaverNote:"速度测试会传输测量数据。如需节省流量，请避免在按流量计费的网络下进行测试。",privacyNoteSettings:"检测记录仅保存在此浏览器中。查询公网 IP 时，IP 会发送给所选的第三方服务；IP 和位置不会保存在记录中。",
  historyUnavailable:"无法读取已保存的历史记录。请在设置中清除记录后重试。",deviceType:"设备类型",mobileDevice:"移动设备",desktopDevice:"桌面设备或平板",touchSupport:"触控支持",colorScheme:"配色模式",darkScheme:"深色",lightScheme:"浅色",onlineStatus:"在线状态",
  isp:"互联网服务提供商",asn:"ASN",approxLocation:"大致位置",ipProviderNotice:"查询时，公网 IP 地址会发送给 ipwho.is。IP 和大致位置不会保存到历史记录或分享内容中。",
  downloadImage:"下载图片",copyResults:"复制结果",tagName:"标签名称",tagDescription:"说明",registrationState:"配置状态",configured:"已在代码中配置",
  minimumResponse:"最短 HTTP 响应时间",maximumResponse:"最长 HTTP 响应时间",failedRequests:"失败的 HTTP 请求",estimatedRate:"估算刷新率",frameDropsEstimate:"估算掉帧次数"
});
trMarkup();
