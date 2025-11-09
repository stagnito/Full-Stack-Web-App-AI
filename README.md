# Full-Stack-Web-App
SE ZG503 Full Stack Application Development Assignment by J Rakesh (2024TM93061)

## Description
A full-stack web application for equipment lending management system with user roles (admin, staff, student) and equipment tracking functionality.

## Features
- User authentication with multiple roles (admin, staff, student)
- Equipment management (add, edit, view)
- Equipment borrowing system
- Request management system
- Role-based access control

## Tech Stack
- Frontend: React.js with Material-UI
- Backend: Flask with SQLAlchemy
- Database: SQLite
- Authentication: JWT

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Unix/macOS
# or
.\venv\Scripts\activate   # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Edit the `.env` file with your configuration:
```env
FLASK_APP=app
FLASK_ENV=development
FLASK_DEBUG=1
DATABASE_URL=sqlite:///equipment.db
JWT_SECRET_KEY=your-secure-jwt-key
SECRET_KEY=your-secure-secret-key
```

6. Run the Flask server:
```bash
flask run
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| FLASK_APP | Flask application module | app | Yes |
| FLASK_ENV | Flask environment | development | Yes |
| FLASK_DEBUG | Debug mode flag | 1 | No |
| DATABASE_URL | Database connection URL | sqlite:///equipment.db | Yes |
| JWT_SECRET_KEY | Secret key for JWT tokens | None | Yes |
| SECRET_KEY | Flask secret key | None | Yes |

## Default Users

After setup, the following user accounts are available:

| Username | Password | Role |
|----------|----------|------|
| admin | admin | Administrator |
| staff | staff | Staff |
| student | student | Student |

## Access Control

### Admin Rights
- View all equipment
- Add new equipment
- Edit equipment details
- Manage all requests
- Access all features

### Staff Rights
- View all equipment
- Manage borrowing requests
- Approve/reject requests
- Mark equipment as returned

### Student Rights
- View available equipment
- Submit borrowing requests
- View own requests

## Development Guidelines

### Git Ignore
The following files/directories are ignored in git:
- Node modules and npm/yarn logs
- Python virtual environment (venv)
- Environment files (.env)
- Build directories (dist, build)
- Cache files and directories
- IDE settings
- Database files

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as a template
- Keep secrets secure and unique per environment

### Security
- Change default passwords in production
- Use strong, unique keys for JWT_SECRET_KEY and SECRET_KEY
- Keep environment variables secure
- Use HTTPS in production
