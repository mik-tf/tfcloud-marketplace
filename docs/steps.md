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

> **Note:** GitHub Pages supports two site types:
> - **User/Organization site:** repository must be named `<username>.github.io`.
> - **Project site:** repository can have any name (e.g., `tfcloud-marketplace`) and is served at `https://<username>.github.io/<repo>`.

> We’ll use **main** for production (`cloud.domain.com`) and **development** for staging (`cloud.dev.domain.com`).

1. Configure your custom FQDN:
   - Create a file `CNAME` at project root containing your **production subdomain**, e.g.: 
     ```
     cloud.domain.com
     ```
   - In the **development** branch, update `CNAME` to your **staging subdomain**, e.g.: 
     ```
     cloud.dev.domain.com
     ```

2. Add a GitHub Actions workflow (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches:
         - main
         - development
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Install dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
             # Auto-set CNAME based on branch
             cname: ${{ github.ref == 'refs/heads/main' && 'cloud.domain.com' || 'cloud.dev.domain.com' }}
   ```

3. Configure DNS records at your registrar:
   - For an **apex** domain (e.g., `yourdomain.com`), add **A** records:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For **subdomains** on GitHub Pages (e.g., `cloud.threefold.pro`, `cloud.dev.threefold.pro`), add **CNAME** records:
     ```
     Host: cloud
     Type: CNAME
     Value: <username>.github.io

     Host: cloud.dev
     Type: CNAME
     Value: <username>.github.io
     ```

4. Push to `main`. GitHub Actions builds and publishes to `gh-pages` branch. Your site is live at `https://www.yourdomain.com`.
   
Enjoy automated CI/CD and custom-domain hosting!  

---
*Last updated: 2025-04-27*
