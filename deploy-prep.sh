#!/bin/bash

# Task Manager Deployment Script
echo "🚀 Preparing Task Manager for Deployment..."

# Backend preparations
echo "📦 Preparing Backend..."
cd ../task-manager-backend

# Remove node_modules and reinstall for clean state
rm -rf node_modules package-lock.json
npm install

# Create production .env template
cat > .env.production << EOF
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=10000
EOF

echo "✅ Backend prepared for deployment"

# Frontend preparations
echo "📦 Preparing Frontend..."
cd ../taskmanager-frontend

# Remove node_modules and reinstall for clean state
rm -rf node_modules package-lock.json build
npm install

# Test build
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push both projects to separate GitHub repositories"
echo "2. Deploy backend to Render.com"
echo "3. Deploy frontend to Netlify or Vercel"
echo "4. Update environment variables with actual URLs"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
