# Ego Lite 트러블슈팅 및 주의사항

---

## 1. Windows PowerShell 따옴표 이스케이프 및 인코딩 문제

### 증상
- `SyntaxError: await is only valid in async functions...`
- `ego-browser nodejs -e ...` 실행 시 아무 반응이 없거나 스크립트가 잘려 에러 발생.

### 해결책
- PowerShell 커맨드라인에서 `-e`로 복잡한 JS 코드를 직접 넘기지 않습니다.
- 반드시 로컬에 UTF-8 `.mjs` 파일을 생성한 후 `cmd /c "ego-browser nodejs < file.mjs"` 방식으로 파이프 입력합니다.

---

## 2. `page.url()` TypeError

### 증상
- `TypeError: currentUrl.includes is not a function`

### 원인
- `page.url()`은 동기 문자열이 아닌 `Promise<string>`을 반환합니다.

### 해결책
```javascript
const currentUrl = await page.url();
```

---

## 3. 업데이트 알림 (`[ego-browser:notice]`)

### 증상
- 실행 결과에 `[ego-browser:notice] Ego Lite update is available...` 메시지 출력.

### 해결책
- 현재 진행 중인 브라우저 작업을 마친 뒤, 터미널에서 다음 명령을 실행합니다:
  ```bash
  ego-browser upgrade
  ```

---

## 4. 세션 미유지 또는 로그인 필요 상태

### 증상
- 사내 인트라넷에 접속했으나 로그인 화면으로 리다이렉트됨.

### 원인
- Chrome 프로필 가져오기(Onboarding) 시 해당 사이트의 로그인 세션이 만료되었거나, Ego Lite 브라우저에서 직접 로그인한 적이 없음.

### 해결책
1. `await task.handOff()`를 호출하고 사용자에게 Ego Lite 브라우저 창에서 직접 1회 로그인하도록 요청합니다.
2. 로그인이 완료되면 세션 쿠키가 저장되므로 다음부터는 자동 유지됩니다.
