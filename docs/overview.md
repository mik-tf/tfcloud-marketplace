# ThreeFold Cloud Marketplace
FOSS GitHub repo for a three-layer Cloud Marketplace on the ThreeFold Grid, enabling users to deploy cloud apps via fiat payments, co-op collaborations, and automated TFT top-ups.

---

## 1. Goals & MVP  
1. Public GitHub repo, Apache 2.0 license  
2. Dashboard User can:  
   - Sign up / log in  
   - Register credit/debit card (Stripe)  
   - **Deploy Apps** (default or advanced node selection)  
   - Pay fiat → backend deploys VM on TFGrid  
3. Dashboard Operator can:  
   - Host dashboard, **collect fiat** via Stripe  
   - Auto-top TFT wallet (USDC→TFT via TF Connect)  
   - Earn margin and up to **60% discount** on deployments  
   - Expose selected Node IDs to users  
4. Node Operator can:  
   - Register TFGrid nodes, opt into dashboard pools  
   - Earn **50% of the TFChain deployment cost** whenever a user deploys on their node  

### 1.1 App Roadmap
- Phase 1: Virtual Machines (VM) with optional backup:
  - App backup VM (failover secondary VM)
  - App QSFS backup storage swarm (e.g. 20 QSFS nodes, tolerates 8 failures)
- Future offerings:
  - Kubernetes clusters
  - Nextcloud instances
  - LiveKit (video conferencing)
  - Open WebUI AI chat on GPU nodes

### 1.2 Co-op Collaborations
- Node Operators and Dashboard Operators can form co-ops (associations) to pool resources and deliver specialized offerings.
- e.g. GPU Node Operators could team with Dashboard Operators to provide Open WebUI AI chat leveraging GPU infrastructure.
- e.g. Node Operators with storage-focused (HDD) nodes can form co-ops with Dashboard Operators to deliver QSFS backup storage swarms.
- e.g. Node Operators with high-bandwidth nodes can form co-ops with Dashboard Operators to deliver LiveKit/video conferencing services.
- e.g. Multi-role co-ops combining GPU, storage, and high-bandwidth Node Operators to deliver integrated services (e.g., Nextcloud with in-built video conferencing and AI agents).

---

## 2. Roles & Revenue  
- **Dashboard User** (Layer 3)  
  - Roles loaded via JWT / serverless API  
  - Pays fiat & deploys apps  
- **Node Operator** (Role)  
  - Runs TFGrid nodes, opts into dashboard pools  
  - Requests access via UI; approval managed via serverless functions  
  - Receives 50% of TFT portion per deployment  
- **Dashboard Operator** (Admin, Layer 2)  
  - Hosts dashboard & collects fiat via Stripe  
  - Auto-top TFT via TF Connect  
  - Configures node pools & discount tiers  
  - Approves Node Operator requests & manages roles  

---

## 3. User Flows

### 3.1 Dashboard User  
1. Browse → “Deploy Apps"  
2. Sign up / log in  
3. Add card via Stripe Elements  
4. VM form: name, OS image, size, default vs advanced (pick Node IDs), backup options (none / simple backup VM / QSFS backup storage swarm)  
5. Confirm & Pay → Stripe charge → **VM is deployed**  

> TFT purchases & wallet top-ups happen asynchronously by the Operator.

### 3.2 Dashboard Operator (Admin)  
1. Admin login (2FA)  
2. **Wallet**: add TFChain mnemonic → view TFT balance & discount tiers  
3. **Billing**: connect Stripe webhook + TF Connect creds → schedule top-ups  
4. **Node Pool**: fetch TFGrid Node IDs → toggle exposure in UI  

### 3.3 Node Operator  
1. Login as Node Operator  
2. **My Nodes**: register new node (ID, metadata)  
3. Toggle “Expose on Dashboard” per dashboard  

---

## 4. Tech Stack & Architecture  
**Frontend**  
- Create React App + TypeScript  
- React Router for navigation  
- Tailwind CSS + React Icons  
- Context API (AuthContext) for roles & settings  
- Stripe Elements & ethers.js for deployments & TFT interactions  

**Backend (Serverless)**  
- AWS Lambda / Vercel Functions for API endpoints (`/me`, `/request-node-operator`, `/approve-request`)  
- JWT auth for stateless sessions & roles  
- Database (DynamoDB / Fauna) for users, roles, requests  
- Stripe webhooks & TF Connect integration  

**Infrastructure & CI**  
- Docker & docker-compose for local dev  
- GitHub Actions for build, lint, test  
- HTTPS (Let’s Encrypt) & env-vars for secrets  

---

## 5. Repo Structure

```
fiatdashboard/
├─ frontend/             
│   ├─ pages/            
│   ├─ components/       
│   └─ styles/           
├─ backend/              
│   ├─ src/              
│   │   ├─ auth/         
│   │   ├─ billing/      
│   │   ├─ deploy/       
│   │   └─ node-pool/    
│   ├─ prisma/│migrations/ 
│   └─ tests/            
├─ docs/                
│   └─ overview.md       ← this file  
├─ docker-compose.yml    
├─ LICENSE               
├─ README.md             
└─ .github/              
    └─ workflows/        
```

---

## 6. Next Steps  
1. Lock in MVP & flows  
2. Choose UI framework (Next.js vs CRA), backend framework  
3. Scaffold repo, add CI, auth & Stripe boilerplate  
4. Implement TF Connect integration & deploy tests  
