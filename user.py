from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'

class BlogPost(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    image_urls = Column(Text)  # JSON string of image URLs
    topic = Column(String(100), nullable=False)
    writing_style = Column(String(50), nullable=False)
    status = Column(String(20), default='pending')  # pending, uploaded, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    uploaded_at = Column(DateTime)
    error_message = Column(Text)

    def __repr__(self):
        return f'<BlogPost {self.title}>'

class AutomationSettings(db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    naver_id = Column(String(100), nullable=False)
    naver_password = Column(Text, nullable=False)  # Change to Text for encrypted password
    blog_url = Column(String(200), nullable=False)
    topics = Column(Text, nullable=False)  # JSON string of topics
    writing_styles = Column(Text, nullable=False)  # JSON string of styles
    upload_interval = Column(Integer, default=5)  # minutes
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<AutomationSettings {self.user_id}>'

