# 🚀 Complete Deployment Guide

## Step-by-Step Instructions

### 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Render.com account (free)
- Netlify account (free)

---

## 🗃️ Step 1: Prepare GitHub Repositories

### Create Backend Repository

1. Go to GitHub.com → Create new repository
2. Name: `task-manager-backend`
3. Initialize with README
4. Clone to your local machine

### Create Frontend Repository

1. Go to GitHub.com → Create new repository
2. Name: `task-manager-frontend`
3. Initialize with README
4. Clone to your local machine

### Push Your Code

```bash
# Backend
cd task-manager-backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/yourusername/task-manager-backend.git
git push -u origin main

# Frontend
cd ../taskmanager-frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/yourusername/task-manager-frontend.git
git push -u origin main
```

---

## 🗄️ Step 2: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free cluster
3. Create database user
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs)
5. Get connection string
6. Save it for environment variables

---

## 🌐 Step 3: Deploy Backend (Render.com)

### Create Web Service

1. Go to [Render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository (`task-manager-backend`)
4. Configure settings:
   - **Name**: `task-manager-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Set Environment Variables

In Render dashboard, add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
PORT=10000
```

### Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Get your backend URL: `https://task-manager-backend-xxxx.onrender.com`
4. Test: Visit `https://your-backend-url.onrender.com` - should show welcome message

---

## 💻 Step 4: Deploy Frontend (Netlify)

### Update Frontend Configuration

1. Edit `netlify.toml` and replace `xxxx` with your actual backend URL:

```toml
[build.environment]
  REACT_APP_API_URL = "https://task-manager-backend-xxxx.onrender.com"
```

2. Update `.env.production`:

```
REACT_APP_API_URL=https://task-manager-backend-xxxx.onrender.com
REACT_APP_ENV=production
```

3. Commit and push changes:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Deploy to Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Click "Add new site" → "Import from Git"
3. Choose GitHub and select `task-manager-frontend`
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Click "Deploy site"
6. Get your frontend URL: `https://amazing-name-xxxx.netlify.app`

---

## 🔧 Step 5: Update CORS Settings

### Update Backend CORS

1. Edit your backend `server.js`
2. Replace the corsOptions with your actual frontend URL:

```javascript
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://amazing-name-xxxx.netlify.app"]
      : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

3. Commit and push:

```bash
git add .
git commit -m "Update CORS for production frontend URL"
git push
```

4. Render will automatically redeploy your backend

---

## ✅ Step 6: Test Your Live Application

### Test Backend API

1. Visit: `https://your-backend-url.onrender.com`
2. Should show: `{"message": "🚀 Welcome to the Task Manager API", ...}`

### Test Frontend

1. Visit: `https://your-frontend-url.netlify.app`
2. Register a new account
3. Login
4. Create, edit, complete, and delete tasks
5. Check that all features work

---

## 🚨 Troubleshooting

### Common Issues:

**🔴 CORS Error**

- Update backend CORS settings with correct frontend URL
- Redeploy backend after changes

**🔴 API Connection Failed**

- Check REACT_APP_API_URL in frontend environment
- Ensure backend is running and accessible

**🔴 Authentication Issues**

- Check JWT_SECRET is set in backend environment
- Clear browser localStorage and try again

**🔴 Database Connection Failed**

- Verify MongoDB connection string
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0

**🔴 Frontend Build Fails**

- Fix any linting errors
- Check all dependencies are installed
- Remove node_modules and reinstall

---

## 🎉 Congratulations!

Your Task Manager app is now live!

**Backend**: `https://task-manager-backend-xxxx.onrender.com`
**Frontend**: `https://amazing-name-xxxx.netlify.app`

### 🔄 Future Updates

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Both platforms will auto-deploy your changes

### 📊 Monitoring

- **Render**: Check logs and metrics in dashboard
- **Netlify**: View deployment logs and analytics
- **MongoDB Atlas**: Monitor database usage

### 💡 Next Steps

- Add custom domain
- Implement additional features
- Set up monitoring and alerts
- Consider upgrading to paid plans for better performance
