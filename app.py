from flask import Flask, jsonify, request, render_template, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_dance.contrib.facebook import make_facebook_blueprint, facebook
from flask_cors import CORS
import os
import logging
from datetime import datetime
import requests 

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Facebook Blueprint Setup
facebook_bp = make_facebook_blueprint(
    client_id='1013162440855972',
    client_secret='7c8c46598021633053604d0bd86f8d18',
    redirect_to='facebook_login'  
)
app.register_blueprint(facebook_bp, url_prefix='/facebook')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///socialpulse.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)

logger.info("Initializing database connection...")

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = "login"

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    platform_connections = db.relationship('PlatformConnection', backref='user', lazy=True)

class PlatformConnection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    access_token = db.Column(db.String(255), nullable=False)
    refresh_token = db.Column(db.String(255))
    expires_at = db.Column(db.DateTime)

# Load user from session
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            login_user(user)
            return redirect(url_for('profile'))
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/profile')
@login_required
def profile():
    return jsonify({"message": f"Welcome {current_user.username}"})

@app.route('/facebook_login')
def facebook_login():
    if not facebook.authorized:
        return redirect(url_for('facebook.login'))
    response = facebook.get('/me?fields=name,email')
    if response.ok:
        user_info = response.json()
        return jsonify({"message": f"Logged in to Facebook as {user_info['name']}"})
    return jsonify({"error": "Failed to log in to Facebook"})


@app.route('/instagram_login')
def instagram_login():
    if 'instagram_token' not in session:
        # Replace '1101542361469876' with the Instagram OAuth URL
        return redirect('aafb6adffbb275534d35f94b1255399d')

    access_token = session['instagram_token']
    response = requests.get(
        f'https://graph.instagram.com/me?fields=id,username&access_token={access_token}'
    )
    if response.ok:
        user_info = response.json()
        platform_connection = PlatformConnection(
            user_id=current_user.id,
            platform='instagram',
            access_token=access_token
        )
        db.session.add(platform_connection)
        db.session.commit()
        return jsonify({"message": f"Logged in to Instagram as {user_info['username']}"})
    return jsonify({"error": "Failed to log in to Instagram"})

if __name__ == '__main__':
    with app.app_context():
        logger.info("Creating database tables...")
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
