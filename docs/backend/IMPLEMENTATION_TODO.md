# Implementation To-Do List

A structured checklist of deliverables to realize the full dashboard–node–user flow.

+**Note:** Threefold Foundation runs the official tfcloud-marketplace instance. This repository is open source; anyone can fork it to launch their own marketplace, customize branding, and manage their own node operator co-op associations.

## 0. Overall User Experience Flow
1. **Dashboard Operator**
   - If done outside of ThreeFold: Fork `tfcloud-marketplace`, update branding (logo, domain), deploy instance.
   - Signup as Admin, login → sees **Admin** page in NavBar.
   - Send instance to community; invite Node Operators.
2. **Node Operator**
   - Signup as NodeOperator, login → sees Node page with **Request Access** form.
   - Submit co-op access request → Admin reviews in Admin page.
   - Upon approval, communicate details; bring node online, use maintenance toggle.
3. **Dashboard User**
   - Signup as DashboardUser, login → sees **Dashboard Users** page (deploy apps).
   - Deploy app, pay fiat (Stripe), triggers USDC→TFT swap and TFChain deployment.
4. **Combined Roles & Revenue**
   - Admin can also act as NodeOperator and DashboardUser.
   - Collect fiat → DashboardOperator; swap USDC→TFT → TFChain; track TFChain rewards for NodeOperator.

## 1. Dashboard Operator Instance Setup
- [ ] Fork `tfcloud-marketplace` repo
- [ ] Update branding:
  - [ ] Replace logo files
  - [ ] Configure custom domain in Vite config / DNS
- [ ] Deploy frontend (Vercel/Netlify/Static hosting)
- [ ] Environment variables:
  - [ ] `REACT_APP_API_URL` (backend base URL)
  - [ ] `STRIPE_PUBLISHABLE_KEY`

## 2. Authentication & Roles
- [ ] Implement AuthService (NestJS):
  - [ ] `POST /auth/signup` (role=operator)
  - [ ] `POST /auth/login` → JWT
  - [ ] Role-based guards (`Admin`, `NodeOperator`, `DashboardUser`)
- [ ] Frontend:
  - [ ] Login/register pages
  - [ ] Store JWT, user role in context
  - [ ] Conditionally render NavBar links:
    - [ ] Admin page for `Admin`
    - [ ] Node page for `NodeOperator`
    - [ ] Dashboard page for `DashboardUser`

## 3. Node Operator Onboarding
- [ ] Backend: `POST /nodes/request`
- [ ] Backend: `GET /nodes/pending` (Admin only)
- [ ] Backend: `PUT /nodes/:id/approve` or `/reject`
- [ ] Email/webhook notifications on status change
- [ ] Frontend:
  - [ ] Node request form (NodeOperator)
  - [ ] Pending requests view (Admin)
  - [ ] Approved node list on NodeOperator page

## 4. Maintenance & Availability
- [ ] Backend: `PUT /nodes/:id/maintenance` (status flag)
- [ ] Frontend: Maintenance toggle on NodeOperator dashboard
- [ ] UI: Show node health/status indicators

## 5. Deployment Workflow (Dashboard User)
- [ ] Backend Payments Service (`/payments/...`)
- [ ] Swap Service (USDC→TFT) integration
- [ ] Deployments Service:
  - [ ] `POST /deployments` (collect user inputs)
  - [ ] `DELETE /deployments/:id`
  - [ ] `PUT /deployments/:id`
- [ ] Frontend: Deploy form in Dashboard page
- [ ] Display deployment status and logs

## 6. Combined Roles & Revenue Streams
- [ ] Allow Admin to also act as NodeOperator
- [ ] Finance flows:
  - [ ] Collect fiat via Stripe → DashboardOperator account
  - [ ] Swap USDC→TFT on Stellar → send TFT to TFChain wallet
  - [ ] Track TFChain rewards for NodeOperator role
  - [ ] Configurable profit margin: allow DashboardOperator to set a markup on base deployment cost (e.g., base $4, sell at $15)
  - [ ] Frontend (Ops page): add UI field for markup input and preview final price

## 7. Testing & Validation
- [ ] Write unit tests for all new endpoints
- [ ] E2E tests (Cypress) for full user scenarios
- [ ] Load tests on payment and swap flows

## 8. Documentation & AI Checks
- [ ] Expose OpenAPI spec at `/docs/api`
- [ ] CI step: validate API schema
- [ ] AI lint: enforce checklist completion via script

---
*Each checkbox marks a deliverable. Use this list to track progress and enable AI-based validation.*
