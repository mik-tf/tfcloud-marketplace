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

> We’ll use **main** for production (`example.com`) and **development** for staging (`dev.example.com`).

1. Configure your custom FQDN (manual method):
   - Create a file `CNAME` at project root containing your **production subdomain**, e.g.:
     ```
     example.com
     ```
   - In the **development** branch, update `CNAME` to your **staging subdomain**, e.g.:
     ```
     dev.example.com
     ```
   **Note:** If you’re using the **Fully Automated Deployment** workflow (PAT-based), you can **skip** this manual CNAME step. The CI workflow will automatically generate a `CNAME` file in `frontend/dist` at build time based on the branch.

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
             cname: ${{ github.ref == 'refs/heads/main' && 'example.com' || 'dev.example.com' }}
   ```

### Fully Automated Deployment with Personal Access Token

For end-to-end automation (including initial site creation), use a GitHub PAT:

1. Create a PAT with `repo` and `workflow` scopes.
2. Add the PAT as a repository secret `PAGES_PAT`.
3. Update your workflow to use `actions/configure-pages@v3` and pass the PAT:

   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18.x'
         - name: Install dependencies
           working-directory: frontend
           run: npm ci
         - name: Build
           working-directory: frontend
           run: npm run build
         - name: Configure Pages
           uses: actions/configure-pages@v3
           with:
             token: ${{ secrets.PAGES_PAT }}
         - name: Upload Pages Artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: frontend/dist
         - name: Deploy Pages
           uses: actions/deploy-pages@v1
           with:
             token: ${{ secrets.PAGES_PAT }}
   ```

#### Creating a Fine-Grained Personal Access Token

To create a fine-grained PAT for fully automated Pages deployment:

1. In GitHub, go to **Settings > Developer settings > Personal access tokens > Fine-grained tokens**.
2. Set **Token name** to `PAGES_PAT`.
3. Choose **Resource owner** as your GitHub account.
4. Under **Repository access**, select **Only select repositories** and pick `tfcloud-marketplace`.
5. Expand **Permissions > Repository permissions** and set:
   - **Pages**: Write
   - **Actions**: Write
6. Set the desired **Expiration** date.
7. Click **Generate token**, copy it, and add it under **Settings > Secrets and variables > Actions** as `PAGES_PAT`.

#### Troubleshooting `Get Pages site failed`

- If you see `Error: Unable to get ACTIONS_ID_TOKEN_REQUEST_URL`, ensure the `permissions` block in your workflow includes `id-token: write`.
- If you see `Error: Get Pages site failed` in your workflow logs, ensure your `PAGES_PAT` secret has **repo**, **workflow**, and **pages: write** scopes.
- If the error persists, manually bootstrap your Pages site:
  1. Go to **Settings → Pages → Build and deployment**.
  2. Under **Source**, select **GitHub Actions** and click **Save**.
  3. Rerun the workflow; subsequent runs will now succeed without manual steps.

3. Configure DNS records at your registrar (`example.com`):
   | Type         | Host | Value             | TTL       |
   | ------------ | ---- | ----------------- | --------- |
   | A Record     | @    | 185.199.108.153   | Automatic |
   | A Record     | @    | 185.199.109.153   | Automatic |
   | A Record     | @    | 185.199.110.153   | Automatic |
   | A Record     | @    | 185.199.111.153   | Automatic |
   | CNAME Record | www  | mik-tf.github.io. | Automatic |

   > **Note:** Point the CNAME value to `<username>.github.io` without `/repo-name`.

4. Push to `main`. GitHub Actions builds and deploys via the Pages Actions workflow—**no `gh-pages` branch** is created. You can verify deployment in **Settings → Pages** under **Build and Deployment** or visit your custom domain (e.g., `https://threefold.store`) once the job completes.
5. Enable HTTPS:
   - In **Settings → Pages**, under **Custom domain**, toggle on **Enforce HTTPS**.
   - Wait a few minutes for GitHub to issue and install your TLS certificate.

Enjoy automated CI/CD and custom-domain hosting!  

---
*Last updated: 2025-04-27*
