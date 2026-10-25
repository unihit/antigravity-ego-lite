// iframe-and-download.mjs - 중첩 iframe 탐색 및 파일 다운로드 예제
const task = await taskSpace("iframe-download-demo");
const page = task.page("p1");

await page.goto("https://example.com", { timeout: 30000 });

// iframe 내부 문서 접근 예시
const iframeData = await page.evaluate(() => {
  const iframe = document.querySelector('iframe');
  if (!iframe) return null;
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  return doc ? doc.body.innerText.slice(0, 300) : null;
});

// 파일 다운로드 이벤트 대기 및 저장 패턴
/*
const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
await page.click("button.export-excel", { label: "click export button" });
const download = await downloadPromise;
const savePath = "C:/Users/<Username>/Downloads/export.xlsx";
await download.saveAs(savePath);
console.log(`다운로드 완료: ${savePath}`);
*/

await task.finish({ keep: [] });
