# Development Steps

This document outlines the modular and evolutive roadmap for the **tfcloud-platform** project.

## 1. Interface & Flow Integration

- Design and implement the core UI/UX interface.
- Integrate the end-to-end workflow for a mock deployment:
  - User authentication (mocked).
  - Project creation and management flows.
  - Display status and logs.
- Ensure components are modular to allow easy extension.

## 2. Connect to TFChain

- Integrate TFChain SDK for real deployments.
- Implement wallet management:
  - Generate/import keys.
  - Query balances and account info.
- Issue deployment transactions on TFChain.
- Handle transaction confirmation and errors.

## 3. Stripe Integration

- Set up Stripe SDK for fiat payments.
- Implement payment flow:
  - Create payment intents.
  - Securely collect payment details.
  - Handle webhooks for payment success/failure.
- Link payments to TFChain deployment credits.

## 4. Architecture Breakdown

### Frontend

- Framework: React/Vue (TBD).
- Component library setup.
- Routing and state management.
- API client abstraction.

### Backend

- Framework: Node.js/Express (TBD).
- RESTful API endpoints:
  - Auth, projects, deployments, payments.
- Database schema design (e.g., PostgreSQL).
- Integration adapters:
  - TFChain service.
  - Stripe service.

## 5. Documentation & CI

- Update documentation at each milestone.
- Set up linting and formatting.
- Configure CI pipeline for automatic tests and builds.

## 6. Deployment

Host the site as a static website on GitHub Pages with a custom domain and CI/CD:

1. Configure your custom FQDN:
   - Create a file `CNAME` at project root containing your domain, e.g.:
     ```
     www.yourdomain.com
     ```
   - Commit and push. GitHub Pages reads this for custom domains.

2. Add a GitHub Actions workflow (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches:
         - main
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Install dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. Configure DNS records at your registrar:
   - **A** records pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME** record for `www` pointing to `yourdomain.com`.

4. Push to `main`. GitHub Actions builds and publishes to `gh-pages` branch. Your site is live at `https://www.yourdomain.com`.
   
Enjoy automated CI/CD and custom-domain hosting!  

---
*Last updated: 2025-04-27*
