# Fleet Tracking Dashboard - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fleet-final

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Vite/React apps.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard:
1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically

**Configuration:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Or use drag-and-drop:
1. Run `npm run build`
2. Drag `dist/` folder to netlify.com/drop

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/fleet-final/', // your repo name
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
npm run deploy
```

3. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

### Option 4: AWS S3 + CloudFront

1. Build the project:
```bash
npm run build
```

2. Upload `dist/` to S3 bucket

3. Enable static website hosting

4. Set up CloudFront distribution

5. Configure error pages to redirect to `index.html`

### Option 5: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and run:**
```bash
docker build -t fleet-dashboard .
docker run -p 8080:80 fleet-dashboard
```

## 🔧 Environment Variables

Create `.env` file for environment-specific configuration:

```env
# API endpoints (if using external APIs)
VITE_API_URL=https://api.example.com

# Analytics
VITE_ANALYTICS_ID=your-analytics-id

# Feature flags
VITE_ENABLE_DEBUG=false
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📊 Performance Optimization

### Pre-deployment Checklist

- ✅ Run production build
- ✅ Check bundle size (`npm run build`)
- ✅ Test on different devices
- ✅ Verify all data files are accessible
- ✅ Check browser console for errors
- ✅ Test playback at different speeds
- ✅ Verify all charts render correctly

### Bundle Size Optimization

Current build is optimized with:
- Code splitting
- Tree shaking
- Minification
- Compression

To analyze bundle:
```bash
npm run build -- --mode analyze
```

## 🔒 Security Considerations

1. **Data Files**: Ensure JSON files are properly served
2. **CORS**: Configure if using external APIs
3. **Headers**: Set security headers in hosting platform
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Never commit sensitive data

## 📱 Mobile Considerations

- Tested on iOS Safari, Chrome Mobile, Firefox Mobile
- Responsive breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly controls
- Optimized for mobile networks

## 🐛 Troubleshooting

### Data Files Not Loading

Check file paths in `DataLoader.js`:
```javascript
const response = await fetch(`/src/data/${metadata.file}`);
```

May need to update to:
```javascript
const response = await fetch(`/data/${metadata.file}`);
```

And move data files to `public/data/` directory.

### Build Errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment 404 Errors

Ensure SPA routing is configured:
- Netlify: `_redirects` file or `netlify.toml`
- Vercel: `vercel.json` with rewrites
- Nginx: `try_files $uri $uri/ /index.html`

## 📈 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics**: Built-in performance monitoring
2. **Google Analytics**: User behavior tracking
3. **Sentry**: Error tracking
4. **LogRocket**: Session replay
5. **Lighthouse**: Performance audits

### Add Analytics

```javascript
// In main.jsx or App.jsx
import ReactGA from 'react-ga4';

ReactGA.initialize('YOUR-GA-ID');
```

## 🔄 CI/CD Setup

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🎯 Post-Deployment

1. **Test Production Build**: Verify all features work
2. **Check Performance**: Run Lighthouse audit
3. **Monitor Errors**: Set up error tracking
4. **Document URL**: Update README with live URL
5. **Share**: Submit assessment with deployment link

## 📝 Deployment Checklist

- [ ] All dependencies installed
- [ ] Production build successful
- [ ] No console errors
- [ ] All charts render correctly
- [ ] Playback controls work
- [ ] Data loads properly
- [ ] Mobile responsive
- [ ] Performance is good (Lighthouse score 90+)
- [ ] HTTPS enabled
- [ ] Live URL accessible
- [ ] README updated with URL

## 🌟 Recommended Hosting

For this project, we recommend:

1. **Vercel** (Best overall)
   - Automatic deployments
   - Built-in analytics
   - Excellent performance
   - Free tier sufficient

2. **Netlify** (Great alternative)
   - Easy drag-and-drop
   - Form handling
   - Function support
   - Free tier generous

3. **GitHub Pages** (Simple & free)
   - Direct GitHub integration
   - Free for public repos
   - Easy setup

## 🎓 Final Notes

- The application is fully static and requires no backend
- All data processing happens client-side
- Data files should be accessible via HTTP
- Consider CDN for large data files
- Gzip compression highly recommended

---

**Ready to deploy! 🚀**

Need help? Check the [main README](README.md) or [ARCHITECTURE](ARCHITECTURE.md) docs.

