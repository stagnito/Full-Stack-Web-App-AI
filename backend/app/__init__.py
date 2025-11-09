from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_swagger_ui import get_swaggerui_blueprint
from datetime import timedelta
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///equipment.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Initialize extensions with CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Add CORS headers
    @app.after_request
    def after_request(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = '*'
        response.headers['Access-Control-Allow-Headers'] = '*'
        return response
    
    JWTManager(app)
    db.init_app(app)

    # Error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": str(e)}), 400

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    # Swagger UI configuration
    SWAGGER_URL = '/api/docs'
    API_URL = '/static/swagger.json'
    swagger_ui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "School Equipment Lending API",
            'validatorUrl': None  # Disable validator
        }
    )
    app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

    @app.route("/static/swagger.json")
    def specs():
        return app.send_static_file("swagger.json")

    # Register blueprints
    from .routes import auth, equipment, borrowing
    app.register_blueprint(auth.bp)
    app.register_blueprint(equipment.bp)
    app.register_blueprint(borrowing.bp)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app