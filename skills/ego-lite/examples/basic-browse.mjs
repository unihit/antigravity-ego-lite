// basic-browse.mjs - 기본 웹페이지 탐색 및 스냅샷 예제
const task = await taskSpace("basic-browse-demo");
const page = task.page("p1");

console.log("페이지 이동 중...");
await page.goto("https://news.ycombinator.com", { timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

const title = await page.evaluate(() => document.title);
console.log("페이지 제목:", title);

// 상위 뉴스 헤드라인 추출
const topNews = await page.evaluate(() => {
  const titles = Array.from(document.querySelectorAll('.titleline > a'));
  return titles.slice(0, 5).map(a => ({
    title: a.innerText,
    url: a.href
  }));
});

console.log("Top News:", JSON.stringify(topNews, null, 2));

// 정리
await task.finish({ keep: [] });
console.log("완료 및 리소스 정리 완료");
