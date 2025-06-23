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

