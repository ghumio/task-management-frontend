# 📋 Pre-Deployment Checklist

## ✅ Code Preparation

### Backend (/task-manager-backend)

- [ ] `package.json` has correct engines and scripts
- [ ] `DEPLOYMENT.md` exists with instructions
- [ ] `render.yaml` configuration file created
- [ ] CORS settings updated for production
- [ ] Environment variables template created
- [ ] All routes tested locally
- [ ] No sensitive data in code (passwords, keys)

### Frontend (/taskmanager-frontend)

- [ ] `netlify.toml` configuration created
- [ ] `.env.production` file created
- [ ] `.env.development` file created
- [ ] API base URL uses environment variables
- [ ] Build command works: `npm run build`
- [ ] No console errors in production build
- [ ] All features tested locally

## 🌐 External Services

### MongoDB Atlas

- [ ] Free cluster created
- [ ] Database user created with strong password
- [ ] IP address 0.0.0.0/0 whitelisted
- [ ] Connection string obtained
- [ ] Database name: `taskmanager`

### GitHub Repositories

- [ ] Backend repository created and pushed
- [ ] Frontend repository created and pushed
- [ ] README files updated
- [ ] `.gitignore` files exclude node_modules and .env
- [ ] All commits have meaningful messages

## 🚀 Deployment Process

### Render.com (Backend)

- [ ] Account created on Render.com
- [ ] Web service connected to GitHub backend repo
- [ ] Build/start commands configured
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=<your_connection_string>`
  - [ ] `JWT_SECRET=<32_character_secret>`
  - [ ] `PORT=10000`
- [ ] Deployment successful
- [ ] Backend URL obtained and tested

### Netlify (Frontend)

- [ ] Account created on Netlify
- [ ] Site connected to GitHub frontend repo
- [ ] Build settings configured (build/publish)
- [ ] Environment variables set:
  - [ ] `REACT_APP_API_URL=<backend_url>`
- [ ] Deployment successful
- [ ] Frontend URL obtained and tested

## 🔧 Post-Deployment Configuration

### CORS Update

- [ ] Backend CORS updated with actual frontend URL
- [ ] Backend redeployed after CORS update
- [ ] CORS test: frontend can call backend API

### End-to-End Testing

- [ ] User registration works
- [ ] User login works
- [ ] JWT token authentication works
- [ ] Task creation works
- [ ] Task editing works
- [ ] Task completion toggle works
- [ ] Task deletion works
- [ ] User-specific tasks (security) works

## 🎯 Final Verification

### Performance

- [ ] Backend API responds within 2 seconds
- [ ] Frontend loads within 3 seconds
- [ ] No console errors in browser
- [ ] Mobile responsive design works

### Security

- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables not exposed in client
- [ ] JWT tokens expire appropriately
- [ ] Users can only access their own tasks

### Monitoring

- [ ] Backend logs accessible in Render dashboard
- [ ] Frontend deployment logs accessible in Netlify
- [ ] Database usage visible in MongoDB Atlas
- [ ] Error tracking set up (optional)

---

## 🚨 Rollback Plan

If something goes wrong:

1. **Backend Issues**:

   - Check Render logs
   - Verify environment variables
   - Test database connection
   - Rollback to previous working commit

2. **Frontend Issues**:

   - Check Netlify deploy logs
   - Verify build process locally
   - Test API connections
   - Rollback to previous working commit

3. **Database Issues**:
   - Check MongoDB Atlas status
   - Verify connection string
   - Check IP whitelist settings
   - Contact MongoDB support if needed

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Both URLs work in incognito/private browser
✅ New user can register and login
✅ All CRUD operations work end-to-end
✅ No console errors in browser developer tools
✅ Mobile and desktop versions work correctly

**Your live app URLs:**

- Frontend: `https://your-app-name.netlify.app`
- Backend: `https://task-manager-backend-xxxx.onrender.com`

---

_Estimated deployment time: 30-60 minutes_
_Cost: $0 (using free tiers)_
