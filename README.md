TaskPilot - Advanced Task Management System


TaskPilot is a modern, feature-rich task management application designed to help individuals and teams organize their work efficiently. With a sleek UI, powerful task organization features, and seamless user experience, TaskPilot takes productivity to the next level.

Key Features
🚀 Task Management: Create, update, and delete tasks with ease

🏷️ Smart Categorization: Organize tasks by category (Work, Personal, Shopping)

🚨 Priority Levels: Mark tasks as High, Medium, or Low priority

✅ Progress Tracking: Mark tasks as complete/incomplete

📅 Due Dates: Set and track deadlines

📊 Dashboard Analytics: Visualize your productivity metrics

🔐 User Authentication: Secure signup/login functionality

📱 Fully Responsive: Works on desktop, tablet, and mobile devices

Technologies Used
Frontend
React 18

Material-UI

React Router

Axios

Date-fns

Backend
Node.js

Express

MongoDB

Mongoose

JWT Authentication

Bcrypt

## Setup Instructions

TaskPilot can be run in multiple ways. Choose the method that best fits your needs:

### 🐳 Docker Setup (Recommended)

**Prerequisites:**
- Docker
- Docker Compose

**Quick Start:**
```bash
# Clone the repository
git clone https://github.com/nyumaeric/taskpilot-devops.git
cd taskpilot-devops

# Start all services with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB: localhost:27017

**Build images separately:**
```bash
# Build backend image
docker build -t taskpilot-backend ./backend

# Build frontend image  
docker build -t taskpilot-frontend ./frontend
```

### 💻 Local Development Setup

**Prerequisites:**
- Node.js 18+ (frontend requires Node 20+ for Vite 7)
- npm v8+
- MongoDB

**Backend Setup:**
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/taskpilot" > .env
echo "PORT=3000" >> .env

npm start
```

**Frontend Setup:**
```bash
cd frontend  
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:3000" > .env

npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
Environment Variables
Backend (.env)
Variable	Description	Example
MONGO_URI	MongoDB connection string	mongodb://localhost:27017/taskpilot
JWT_SECRET	Secret key for JWT authentication	mysecretkey123
PORT	Port for backend server	5000
Frontend (.env)
Variable	Description	Example
REACT_APP_API_BASE_URL	Base URL for API requests	http://localhost:5000
## 🚀 Cloud Deployment

TaskPilot includes Infrastructure as Code (IaC) with Terraform for Azure deployment.

### Azure Infrastructure

**Prerequisites:**
- Azure CLI
- Terraform
- Docker

**Deploy Infrastructure:**
```bash
cd infra

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply

# Get outputs
terraform output
```

**Infrastructure includes:**
- Azure Container Registry (ACR)
- Azure Container Apps
- Azure Cosmos DB (MongoDB API)
- Log Analytics Workspace
- Resource Group

**Manual Deployment Process:**
1. Build and tag images:
```bash
# Get ACR login server from terraform output
ACR_SERVER=$(terraform output -raw container_registry_login_server)

# Tag images
docker tag taskpilot-backend:latest $ACR_SERVER/taskpilot-backend:latest
docker tag taskpilot-frontend:latest $ACR_SERVER/taskpilot-frontend:latest

# Login to ACR
az acr login --name $ACR_SERVER

# Push images
docker push $ACR_SERVER/taskpilot-backend:latest
docker push $ACR_SERVER/taskpilot-frontend:latest
```

2. The Container Apps will automatically deploy the latest images from ACR.

**Alternative Deployment Platforms:**
- **Frontend**: Vercel, Netlify, AWS S3, Firebase Hosting
- **Backend**: Heroku, Railway, AWS Elastic Beanstalk
- **Database**: MongoDB Atlas, AWS DocumentDB

Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'Add some feature')

Push to the branch (git push origin feature/your-feature)

Open a pull request

License
This project is licensed under the MIT License - see the LICENSE file for details.

