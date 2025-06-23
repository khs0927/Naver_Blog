file_content = """{
 \"cells\": [
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"# 네이버 블로그 자동화 시스템 (Google Colab용)\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"## 1. 환경 설정 및 종속성 설치\"
   ]
  },
  {
   \"cell_type\": \"code\",
   \"execution_count\": null,
   \"metadata\": {},
   \"outputs\": [],
   \"source\": [
    \"# Google Drive 마운트 (선택 사항 - 데이터 지속성을 위해)\\\\n\",
    \"# from google.colab import drive\\\\n\",
    \"# drive.mount(\'/content/drive\')\"
   ]
  },
  {
   \"cell_type\": \"code\",
   \"execution_count\": null,
   \"metadata\": {},
   \"outputs\": [],
   \"source\": [
    \"# uv 설치 (Python 종속성 관리 도구)\\\\n\",
    \"!pip install uv\"
   ]
  },
  {
   \"cell_type\": \"code\",
   \"execution_count\": null,
   \"metadata\": {},
   \"outputs\": [],
   \"source\": [
    \"# requirements.txt 파일 생성\\\\n\",
    \"%%writefile requirements.txt\\\\n\",
    \"Flask\\\\n\",
    \"playwright\\\\n\",
    \"APScheduler\\\\n\",
    \"google-generative-ai\"
   ]
  },
  {
   \"cell_type\": \"code\",
   \"execution_count\": null,
   \"metadata\": {},
   \"outputs\": [],
   \"source\": [
    \"# Python 종속성 설치\\\\n\",
    \"!uv pip install -r requirements.txt\"
   ]
  },
  {
   \"cell_type\": \"code\",
   \"execution_count\": null,
   \"metadata\": {},
   \"outputs\": [],
   \"source\": [
    \"# Playwright 브라우저 바이너리 설치\\\\n\",
    \"!playwright install\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"## 2. 프로젝트 파일 업로드\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"로컬 프로젝트 파일을 Colab 환경으로 업로드해야 합니다. 왼쪽 파일 아이콘을 클릭하여 파일을 직접 업로드하거나, Google Drive에 저장한 후 마운트하여 사용할 수 있습니다.\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"**필수 업로드 파일:**\\\\n\",
    \"- `main.py`\\\\n\",
    \"- `automation.py`\\\\n\",
    \"- `encryption.py`\\\\n\",
    \"- `user.py`\\\\n\",
    \"- `package.json` (프론트엔드 관련, Colab에서 직접 실행하지 않을 경우 불필요)\\\\n\",
    \"- `requirements.txt` (위에서 생성했으므로 직접 업로드할 필요 없음)\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"## 3. Python 스크립트 실행\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"### 3.1. `main.py` 실행 (백엔드 서버 시작)\"
   ]
  },
  {
   \"cell_type\": \"code\",
   \"execution_count\": null,
   \"metadata\": {},
   \"outputs\": [],
   \"source\": [
    \"# `main.py` 파일을 실행하여 백엔드 서버를 시작합니다.\\\\n\",
    \"# 서버가 실행되면 터미널에 URL이 표시될 수 있습니다.\\\\n\",
    \"!python main.py\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"### 3.2. 다른 Python 스크립트 실행 (예: `automation.py` 테스트)\"
   ]
  },
  {
   \"cell_type\": \"code\",
   \"execution_count\": null,
   \"metadata\": {},
   \"outputs\": [],
   \"source\": [
    \"# `automation.py` 또는 다른 스크립트를 직접 실행해야 하는 경우 사용합니다.\\\\n\",
    \"# 예시: Playwright 자동화 기능을 테스트하기 위해\\\\n\",
    \"# !python automation.py\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"## 4. 프론트엔드 (선택 사항)\"
   ]
  },
  {
   \"cell_type\": \"markdown\",
   \"metadata\": {},
   \"source\": [
    \"이 프로젝트는 React/Next.js 기반의 프론트엔드를 포함하고 있습니다. Colab은 주로 Python 백엔드 및 데이터 처리 작업에 사용되므로, 프론트엔드는 로컬 환경에서 실행하는 것을 권장합니다.\\\\n\",
    \"\\\\n\",
    \"만약 Colab에서 프론트엔드를 실행해야 한다면, 추가적인 설정 (예: `npm install`, `npm run build`, `npm start` 또는 Next.js 개발 서버 실행)이 필요하며, Colab의 제한된 환경에서 웹 서버를 노출하는 방법을 고려해야 합니다.\"
   ]
  }
 ],
 \"metadata\": {
  \"accelerator\": \"GPU\",
  \"colab\": {
   \"collapsed_sections\": [],
   \"provenance\": []
  },
  \"kernelspec\": {
   \"display_name\": \"Python 3\",
   \"name\": \"python3\"
  },\
  \"language_info\": {
   \"name\": \"python\"
  }
 },
 \"nbformat\": 4,
 \"nbformat_minor\": 0
}"""

with open("Naver_Blog_Automation.ipynb", "w", encoding="utf-8") as f:
    f.write(file_content) 