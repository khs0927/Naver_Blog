from flask import Flask, send_from_directory
from flask_cors import CORS

import os
import sys

# Add the src directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from models.user import db, User
from routes.user import user_bp

# static_folder 경로를 os.path.join을 사용하여 구성
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "naver-blog-frontend", "dist"), static_url_path="/")
CORS(app)

# SQLite 데이터베이스 설정
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///naver_blog_automation.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Blueprint 등록
app.register_blueprint(user_bp, url_prefix="/api")

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route("/api/status")
def status():
    return {"message": "Naver Blog Automation API Server", "status": "running"}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        # user_id 1인 사용자 생성 (없을 경우)
        if not User.query.filter_by(id=1).first():
            default_user = User(username="default_user", email="default@example.com")
            db.session.add(default_user)
            db.session.commit()
            print("Default user (ID: 1) created.")
        else:
            print("Default user (ID: 1) already exists.")
    app.run(host="0.0.0.0", port=5000, debug=False)


