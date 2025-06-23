import json
import random
from openai import OpenAI
from cryptography.fernet import Fernet
import os

# 환경 변수에서 암호화 키를 로드합니다.
# 키가 없으면 새로 생성합니다. (실제 운영 환경에서는 안전하게 관리되어야 합니다.)
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY")
if ENCRYPTION_KEY is None:
    ENCRYPTION_KEY = Fernet.generate_key().decode()
    print(f"Generated new encryption key: {ENCRYPTION_KEY}")
    print("Please set this as an environment variable (ENCRYPTION_KEY) for production.")

fernet = Fernet(ENCRYPTION_KEY.encode())

class AutomationScheduler:
    def __init__(self, db, app):
        self.db = db
        self.app = app
        self.openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def encrypt_data(self, data):
        return fernet.encrypt(data.encode()).decode()

    def decrypt_data(self, encrypted_data):
        return fernet.decrypt(encrypted_data.encode()).decode()

    def generate_content(self, topic, writing_style):
        # 실제 콘텐츠 생성 로직 (OpenAI API 호출 등)
        # 여기서는 더미 데이터를 반환합니다.
        title = f"{topic}에 대한 {writing_style} 스타일의 게시물"
        content = f"안녕하세요! 오늘은 {topic}에 대해 {writing_style} 스타일로 이야기해볼게요. 흥미로운 정보가 가득합니다!"
        return title, content

    def post_to_naver_blog(self, naver_id, naver_password, blog_url, title, content):
        # Playwright를 이용한 네이버 블로그 포스팅 로직
        # 여기서는 더미 성공을 반환합니다.
        print(f"네이버 블로그에 게시물 업로드 시도: {title}")
        return True

    def run_automation(self, user_id):
        with self.app.app_context():
            from src.models.user import AutomationSettings, BlogPost
            settings = AutomationSettings.query.filter_by(user_id=user_id).first()

            if not settings or not settings.is_active:
                return

            try:
                decrypted_password = self.decrypt_data(settings.naver_password)
                topic = random.choice(json.loads(settings.topics))
                writing_style = random.choice(json.loads(settings.writing_styles))

                title, content = self.generate_content(topic, writing_style)

                success = self.post_to_naver_blog(settings.naver_id, decrypted_password, settings.blog_url, title, content)

                status = "uploaded" if success else "failed"
                error_message = None if success else "게시물 업로드 실패"

                post = BlogPost(
                    title=title,
                    content=content,
                    topic=topic,
                    writing_style=writing_style,
                    status=status,
                    error_message=error_message
                )
                self.db.session.add(post)
                self.db.session.commit()

            except Exception as e:
                print(f"자동화 실행 중 오류 발생: {e}")
                # 오류 로깅 또는 사용자에게 알림



