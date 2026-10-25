# Ego Lite 핵심 API 가이드

Ego Lite Node.js 런타임에서 사용할 수 있는 전역 함수 및 객체 메서드 레퍼런스입니다.
(Playwright의 모든 API를 지원하는 것이 아니라 Ego Lite 전용 경량 API 셋을 사용합니다.)

---

## 1. 전역 함수 (Global Functions)

* `taskSpace(name: string): Promise<TaskSpace>`
  - 새로운 격리 작업 공간을 생성합니다.
* `listTaskSpaces(): Promise<TaskSpaceSummary[]>`
  - 현재 활성화된 작업 공간 목록(id, name, ownership, recentTabTitles 등)을 조회합니다.
* `claimTaskSpace(spaceId: number): Promise<TaskSpace>`
  - 사용자가 소유하고 있거나 이전에 생성된 작업 공간의 제어권을 가져옵니다.
* `takeOverTaskSpace(spaceId: number): Promise<TaskSpace>`
  - 사용자 작업 공간을 에이전트 작업 공간으로 전환하여 이어받습니다.
* `help(topic?: string)`
  - 내장 도움말 및 함수 시그니처를 콘솔에 출력합니다.

---

## 2. TaskSpace 객체

* `task.spaceId`: `number` (작업 공간 ID)
* `task.page(label: string): Page`
  - 작업 공간 내 특정 라벨(예: `"p1"`)을 가진 Page 인스턴스를 가져오거나 생성합니다.
* `task.userPage(): Page`
  - 사용자가 보고 있는 현재 페이지를 가져옵니다.
* `task.handOff(): Promise<void>`
  - 브라우저 제어권을 사용자에게 넘깁니다 (OTP, 로그인, 캡차 등 사용자 수동 작업 대기).
* `task.finish(options: { keep: string[] }): Promise<void>`
  - 작업 공간을 종료하고 리소스를 해제합니다. 기본값은 `{ keep: [] }` (모든 에이전트 탭 닫기).

---

## 3. Page 객체

### 탐색 및 상태
* `await page.goto(url: string, options?: { timeout?: number, waitUntil?: string })`
  - 지정한 URL로 이동합니다.
* `await page.url(): Promise<string>`
  - 현재 페이지 URL을 반환합니다. (**주의**: Promise를 반환하므로 반드시 `await` 필요)
* `await page.snapshot(): Promise<PageSnapshot>`
  - 현재 뷰의 접근성 트리 및 DOM 요약 스냅샷을 반환합니다.
* `await page.evaluate(fn: Function, ...args): Promise<any>`
  - 브라우저 컨텍스트 내에서 JavaScript를 실행하고 반환값을 직렬화하여 가져옵니다.

### 사용자 입력 및 상호작용
* `await page.click(selector: string, options?: { label?: string, timeout?: number })`
  - 셀렉터에 해당하는 요소를 클릭합니다 (`label`은 AI 커서 옆에 표시될 간결한 3~6단어 설명).
* `await page.dblclick(selector: string, options?: { label?: string })`
  - 더블 클릭합니다.
* `await page.fill(selector: string, value: string, options?: { timeout?: number })`
  - 입력 폼(input, textarea)을 비우고 텍스트를 입력합니다.
* `await page.press(selector: string, key: string)`
  - 특정 요소에서 키(예: `"Enter"`, `"Tab"`, `"Escape"`)를 입력합니다.
* `await page.selectOption(selector: string, values: string | string[])`
  - `<select>` 태그의 옵션을 선택합니다.
* `await page.hover(selector: string, options?: { label?: string })`
  - 마우스를 특정 요소 위에 올립니다.

### 파일 및 다운로드
* `await page.setInputFiles(selector: string, filePaths: string[])`
  - 파일 인풋에 로컬 파일의 절대 경로를 전달합니다.
* `await page.waitForFileChooser(options?: { timeout?: number }): Promise<FileChooser>`
  - 파일 선택창 대기.
* `await page.waitForEvent("download", options?: { timeout?: number }): Promise<Download>`
  - 브라우저 다운로드 이벤트를 대기하고 `download.saveAs(absolutePath)`로 저장합니다.
