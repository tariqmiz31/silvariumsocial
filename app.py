from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)
    platform_connections = db.relationship('PlatformConnection', backref='user', lazy=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    platforms = db.Column(db.JSON, nullable=False)
    scheduled_for = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    analytics = db.relationship('Analytics', backref='post', lazy=True)

class PlatformConnection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    access_token = db.Column(db.String(255), nullable=False)
    refresh_token = db.Column(db.String(255))
    expires_at = db.Column(db.DateTime)

class Analytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    likes = db.Column(db.Integer, default=0)
    shares = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)
    reach = db.Column(db.Integer, default=0)
    engagement_rate = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([{
        'id': post.id,
        'content': post.content,
        'platforms': post.platforms,
        'scheduled_for': post.scheduled_for.isoformat(),
        'status': post.status
    } for post in posts])

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    post = Post(
        content=data['content'],
        platforms=data['platforms'],
        scheduled_for=datetime.fromisoformat(data.get('scheduled_for', datetime.utcnow().isoformat())),
        status='scheduled',
        user_id=1  # TODO: Get from auth session
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({
        'id': post.id,
        'content': post.content,
        'platforms': post.platforms,
        'scheduled_for': post.scheduled_for.isoformat(),
        'status': post.status
    })

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    analytics = Analytics.query.all()
    return jsonify([{
        'post_id': analytic.post_id,
        'platform': analytic.platform,
        'likes': analytic.likes,
        'shares': analytic.shares,
        'comments': analytic.comments,
        'engagement_rate': analytic.engagement_rate
    } for analytic in analytics])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)