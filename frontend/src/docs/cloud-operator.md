# Cloud Operator Documentation

The **Cloud Operator** plays a critical role in powering the ThreeFold Cloud Marketplace for end users. Responsibilities include:

- Hosting and configuring public or private dashboards with **Basic** and **Advanced** modes for application deployments.
- Setting pricing structures and integrating **fiat payment gateways** (e.g., Stripe).
- Automating token purchases and conversions using **TF Connect**.
- Forming **Cloud alliances** with Cloud Providers to pool infrastructure and share revenue.
- Receiving up to **60% discount** on deployment costs when holding tokens, improving competitiveness and margins.

**Best Practices:**

- Establish clear **Service Level Agreements (SLAs)** covering availability, performance, and backups.
- Define transparent revenue-sharing models and governance rules within Cloud alliances.
- Monitor dashboard performance and user feedback to continuously optimize the UI and pricing.

## Deployment Costs & Automated Fiat Flow

Cloud Operators run deployments on the TFGrid using USD-denominated pricing. Each resource (e.g., a VM) has a fixed USD cost (e.g., $5 USD/month), with the required TFT amount varying according to the current USD/TFT rate.

Operators can automate USDC→TFT swaps via TF Connect to maintain predictable fiat-like finance operations for marketplace maintenance.

## Staking Discounts

By staking TFT in their TFChain wallet, Cloud Operators (and TFGrid users) gain discounts up to 60% on TFChain costs:

| Type       | Discount Level | Months of TFT Stake Required |
| ---------- | -------------- | ----------------------------- |
| No staking | 0%             | 0                             |
| Default    | 20%            | 3                             |
| Bronze     | 30%            | 6                             |
| Silver     | 40%            | 12                            |
| Gold       | 60%            | 36                            |

TFChain charges for `proof_of_utilization` hourly and automatically applies the discount based on the TFT balance in the TFChain wallet (not other chains). For network services, the maximum discount is 40%.

## Example: 40% Discount

- Usage: 10 TFT/hour → 86,400 TFT/year (10 × 24 × 30 × 12)
- Three-year consumption: 259,200 TFT (10 × 24 × 30 × 36)
- With 120,000 TFT staked, qualifies for 40% discount (Silver tier)
- Not enough tokens to reach Gold (60%) tier

## Cloud Operator Interface

### 1. Review Cloud Provider Join Requests
- Go to the **Operator** page and locate **Cloud Provider Join Requests**.
- View each request's **Node ID**, **Network**, **Apps**, **Email**, **SLA Agreed**, **Comment**, and **Requested At**.
- Use the comment box below each request to communicate with Cloud Providers.
- Approve or deny requests (API integration pending).

### 2. View Pending Maintenance Windows
- Scroll to **Pending Maintenance Windows** to see scheduled windows by Node ID.
- Each entry shows **Start**, **End**, **Comment**, and **Requested At**.
- After scheduling, notify affected Cloud Users.

### 3. Manage Alliance Providers
- In **Accepted Cloud Alliance Providers**, see active alliance members with **Name**, **Node ID**, **Apps Accepted**, and any scheduled **Maintenance** windows.
- Use the **Schedule Maintenance** button to plan maintenance windows.

### 4. Notify Cloud Users
- Trigger in-app and email notifications when maintenance windows are scheduled.
- Ensure users receive clear timings and comments to plan accordingly.