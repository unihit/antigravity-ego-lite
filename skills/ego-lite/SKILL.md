---
name: ego-lite
description: >-
  Ego Lite(Chromium 기반 AI 에이전트 브라우저)를 활용한 웹 자동화, 로그인 세션 유지 브라우징,
  사내망/그룹웨어 및 웹 서비스 탐색, 데이터 추출, 폼 입력, 스크린샷 캡처 스킬.
  사용자가 웹 브라우저를 통한 탐색, 로그인 상태가 필요한 페이지 작업, 사내 포털/ERP/메일함 확인,
  웹 자동화 또는 QA 작업을 요청할 때 활성화됩니다.
---

# Ego Lite 브라우저 자동화 스킬 (Ego Lite Automation)

Ego Lite(`ego-browser`)는 사용자와 AI 에이전트가 브라우저를 공유하며 **동시에(병렬로)** 작업할 수 있도록 설계된 Chromium 기반 AI 브라우저입니다.

기존 자동화 도구(Playwright 등)와 달리, 사용자가 이미 로그인한 브라우저 세션(쿠키, 계정 인증)을 상속받으면서도 사용자의 작업 화면을 방해하지 않는 **격리된 백그라운드 작업 공간(Task Space)**에서 안전하게 동작합니다.

---

## 1. 핵심 특징 및 원칙

1. **로그인 세션 상속 (Shared State)**
   - 사용자의 Chrome/Ego 프로필 쿠키와 세션이 유지되므로 사내 인트라넷, 사내 메일(그룹웨어), 유료 대시보드 등에 별도 로그인 절차 없이 즉시 접근할 수 있습니다.
2. **독립된 작업 공간 (Task Space)**
   - 에이전트는 독립된 Task Space에서 페이지를 띄우므로 사용자가 현재 보고 있는 메인 탭이나 창을 가로채지 않습니다.
3. **명확한 리소스 정리 (Cleanup)**
   - 작업이 완료되면 반드시 `await task.finish({ keep: [] })`를 호출하여 백그라운드 브라우저 리소스를 정리합니다.
   - 사용자가 직접 확인해야 하는 탭이 있는 특수한 경우에만 `keep: ["p1"]` 옵션을 지정합니다.

---

## 2. Windows 환경 실행 규칙 (중요)

Windows의 PowerShell 환경에서는 인라인 문자열의 따옴표 및 UTF-8 인코딩 손실 문제가 발생할 수 있습니다. 따라서 **반드시 아래 규칙**을 준수합니다.

1. **작업별 `.mjs` 파일 생성**:
   - 한 번의 작업(Goal)마다 고유한 디렉터리를 생성하고 라운드별 파일로 작성합니다.
   - 경로 예시: `C:/Users/<Username>/ego/<task-name>-<YYYYMMDD-HHmm>/round-01.mjs`
2. **cmd 표준 입력 리디렉션 실행**:
   ```powershell
   cmd /c "ego-browser nodejs < C:\Users\<Username>\ego\<task-name>-<YYYYMMDD-HHmm>\round-01.mjs"
   ```
   또는
   ```powershell
   ego-browser nodejs -e "await import('file:///C:/Users/<Username>/ego/<task-name>/round-01.mjs')"
   ```
3. **새 라운드 파일 작성**:
   - 이전 단계를 수정하지 않고 `round-02.mjs`, `round-03.mjs`로 새로 작성하여 이전 상태를 이어받거나(`claimTaskSpace`), 다음 액션을 수행합니다.

---

## 3. 표준 작업 절차 (Lifecycle)

### Step 1: 작업 공간 생성 또는 이어받기
```javascript
// 신규 작업 공간 시작
const task = await taskSpace("task-name");
const page = task.page("p1");

// 기존 작업 공간 이어받기 (연속 작업 시)
// const task = await claimTaskSpace(spaceId);
// const page = task.page("p1");
```

### Step 2: 페이지 이동 및 대기
```javascript
// page.url()은 Promise를 반환하므로 반드시 await 필요
await page.goto("https://target-url.com", { timeout: 30000 });
await new Promise(r => setTimeout(r, 2000)); // DOM 렌더링 안정화 대기

const currentUrl = await page.url();
const title = await page.evaluate(() => document.title);
console.log("Loaded:", { currentUrl, title });
```

### Step 3: 페이지 상태 파악 (Snapshot)
```javascript
// 전체 DOM 구조와 접근성 트리를 경량 텍스트로 취득
const snapshot = await page.snapshot();
// ref 번호, loc, 텍스트 등을 확인하여 타겟 엘리먼트 식별
```

### Step 4: 엘리먼트 조작 및 상호작용
```javascript
// 클릭 (label은 3~6단어 간결한 설명 지정)
await page.click("button#submit", { label: "click submit button" });

// 텍스트 입력
await page.fill("input[name=keyword]", "검색어");

// 엔터 키 입력
await page.press("input[name=keyword]", "Enter");

// 브라우저 내부 JS 실행 (데이터 수집)
const extractedData = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.item')).map(el => el.innerText.trim());
});
```

### Step 5: iframe 및 중첩 프레임 다루기
그룹웨어나 복합 웹앱의 경우 메인 뷰가 `iframe` 내부에 위치할 수 있습니다.
```javascript
// 스냅샷에서 iframe 내부 구조를 확인하거나 evaluate로 접근
const iframeContent = await page.evaluate(() => {
  const frame = document.querySelector('iframe');
  return frame ? frame.contentDocument?.body?.innerText : null;
});
```

### Step 6: 2차 인증 또는 사용자 조작 필요 시 (Handoff)
OTP 입력, 보안 문자, 기기 인증 등 사람의 직접 개입이 필요한 경우:
```javascript
await task.handOff();
// 라운드를 종료하고 사용자에게 브라우저에서 인증을 진행하도록 안내
// 사용자가 완료했다고 답변하면 다음 라운드에서 claimTaskSpace/takeOverTaskSpace로 재개
```

### Step 7: 최종 정리 (Finish)
```javascript
// 모든 작업 완료 시 반드시 호출
await task.finish({ keep: [] });
```

---

## 4. 디렉터리 구조 및 참고 자료

- [API 가이드 및 치트시트](./references/api-guide.md)
- [트러블슈팅 및 예외 대응](./references/troubleshooting.md)
- [기본 탐색 예제](./examples/basic-browse.mjs)
- [로그인 세션 기반 업무 처리 예제](./examples/session-workflow.mjs)
- [iframe 및 파일 다운로드 예제](./examples/iframe-and-download.mjs)
