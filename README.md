# Ego Lite Browser Automation Plugin for Antigravity

[![Antigravity Plugin](https://img.shields.io/badge/Antigravity-Plugin-blue.svg)](https://github.com/unihit/antigravity-ego-lite)
[![Ego Lite](https://img.shields.io/badge/Ego%20Lite-v0.6.1+-emerald.svg)](https://lite.ego.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Google Antigravity 에이전트가 **Ego Lite(Chromium 기반 AI 에이전트 브라우저)**를 제어하여, 사용자의 활성 로그인 세션을 그대로 활용하면서도 사용자의 화면을 방해하지 않는 **격리된 백그라운드 작업 공간(Task Space)**에서 웹 자동화를 수행할 수 있도록 지원하는 공식 플러그인입니다.

---

## 🌟 주요 특징 (Key Features)

1. **로그인 세션 상속 (Shared State)**
   - 평소 사용하는 브라우저(Chrome/Ego)의 쿠키 및 인증 세션이 그대로 유지됩니다.
   - 사내 그룹웨어, 인트라넷, 유료 대시보드 등에 별도의 로그인이나 2FA/CAPTCHA 입력 없이 에이전트가 즉시 작업할 수 있습니다.
2. **비침해 백그라운드 병렬 작업 (Task Space)**
   - 에이전트는 독립된 Task Space에서 페이지를 띄우므로 사용자가 현재 보고 있는 메인 브라우저 화면이나 활성 탭을 가로채지 않습니다.
3. **코드 기반 고속 일괄 실행 (Code-Driven Batching)**
   - 한 단계씩 LLM과 왕복하는 기존 브라우저 자동화 방식 대신, Node.js 환경에서 자바스크립트로 일괄 처리하여 **토큰 소모를 극적으로 줄이고 실행 속도를 극대화**했습니다.
4. **Windows 환경 완벽 호환**
   - Windows PowerShell 환경에서 자주 발생하는 따옴표 손실 및 UTF-8 인코딩 문제를 방지하는 표준 `.mjs` 실행 파이프라인이 내장되어 있습니다.

---

## 📁 디렉터리 구조 (Plugin Structure)

```text
ego-lite/
├── plugin.json                 # 플러그인 메타데이터 정의
├── README.md                   # 사용자 안내 및 설치 가이드
├── rules/
│   └── AGENTS.md               # 에이전트 판단 규칙 (로그인 세션 필요 시 Ego Lite 우선 사용)
└── skills/
    └── ego-lite/
        ├── SKILL.md            # 핵심 절차, 실행 지침 및 라이프사이클 정의
        ├── examples/
        │   ├── basic-browse.mjs        # 일반 웹페이지 탐색 및 데이터 추출
        │   ├── session-workflow.mjs    # 사내망/그룹웨어 로그인 세션 기반 작업
        │   └── iframe-and-download.mjs # 중첩 iframe 및 다운로드 대기
        └── references/
            ├── api-guide.md            # TaskSpace, Page, Selector API 레퍼런스
            └── troubleshooting.md      # 주요 트러블슈팅 및 예외 처리
```

---

## 🚀 다른 PC에서 설치 및 적용 방법 (Installation)

### 1단계: 사전 요구사항 (Ego Lite 설치)
새로운 PC에도 실제 브라우저인 **Ego Lite**가 설치되어 있어야 합니다.
- [Ego Lite 공식 홈페이지](https://lite.ego.app/)에서 다운로드 및 설치
- 첫 실행 시 Chrome 프로필 가져오기(Onboarding) 완료

### 2단계: 플러그인 다운로드 및 설치
원하는 PC의 Antigravity 전역 플러그인 디렉터리에 이 저장소를 클론하거나 복사합니다:

#### Windows (PowerShell):
```powershell
# Antigravity 플러그인 디렉터리로 이동
cd $HOME\.gemini\config\plugins

# 저장소 클론
git clone https://github.com/unihit/antigravity-ego-lite.git ego-lite
```

#### macOS / Linux:
```bash
cd ~/.gemini/config/plugins
git clone https://github.com/unihit/antigravity-ego-lite.git ego-lite
```

### 3단계: Antigravity 재시작
Antigravity를 재시작하면 플러그인이 자동으로 인식되어 즉시 활성화됩니다.

---

## 💬 사용 예시 (Suggested Prompts)

대화창에서 자연어로 편하게 지시하면 에이전트가 자동으로 Ego Lite 스킬을 활성화하여 작업을 수행합니다:

* *"Ego Lite로 사내 그룹웨어 접속해서 내 메일함 최신 목록 가져와줘"*
* *"Ego Lite로 AWS 대시보드 들어가서 현재 청구 예상 비용 확인해줘"*
* *"/ego-lite [작업 내용]"*

---

## 📄 License
MIT License. Free to use and distribute.
