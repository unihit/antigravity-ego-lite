// session-workflow.mjs - 로그인 세션을 이어받아 사내망/대시보드 조회 예제
const task = await taskSpace("dashboard-check");
const page = task.page("p1");

const targetUrl = "http://gwa.youngwoo.co.kr/gw/userMain.do";
console.log(`페이지 접근: ${targetUrl}`);
await page.goto(targetUrl, { timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

const currentUrl = await page.url();
const title = await page.evaluate(() => document.title);

// 로그인 여부 검증
if (currentUrl.includes("login") || title.includes("로그인")) {
  console.log("로그인이 필요합니다. 사용자에게 브라우저 수동 로그인을 요청합니다.");
  await task.handOff();
  process.exit(0);
}

console.log("로그인 상태 확인 완료:", title);

// 메인 위젯(예: 알림/메일/일정) 텍스트 수집
const snapshot = await page.snapshot();
console.log("스냅샷 텍스트 길이:", snapshot.text?.length);

// 작업 완료 후 정리
await task.finish({ keep: [] });
