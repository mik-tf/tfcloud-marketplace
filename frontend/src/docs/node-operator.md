# Node Operator Documentation

**Node Operators** run and maintain TFGrid nodes to provide compute and storage resources.

## Role and Responsibilities

- Run TFGrid nodes and maintain uptime, updates, and security.
- Provide compute and storage resources to the ThreeFold Grid.
- Earn **50%** of the TFChain portion of each deployment cost.
- Collaborate in co-ops with Dashboard Operators to pool infrastructure and share revenue.

## Best Practices

- Keep nodes online, updated, and monitored for reliability.
- Use monitoring tools to track performance and health metrics.
- Establish SLAs with co-op members for clear availability and service guarantees.
- Participate in governance and feedback to improve node operations.

## Types of Nodes

- **QSFS-Focused Nodes**: Optimized for Quantum Safe File System storage, with large HDD capacity and basic SSD.
- **AI / LLM Chat Nodes**: Equipped with high-performance GPUs (e.g., NVIDIA RTX 4090, 5090) and ample VRAM (≥24GB), plus SSDs for fast model loading and checkpointing.
- **LiveKit / Video Conference Nodes**: Provisioned with high-bandwidth (e.g., 1 Gbps symmetric) network connections and low-latency routing to handle real-time video streams.

## Node Operator Interface

### 1. Request Participation in Co-op
- Go to the **Nodes** page and click **Submit Request**.
- Fill in **Node ID**, select **Network** (Main/Test), check one or more **Apps** to deploy, enter your **Contact Email**, agree to the **SLA**, and add any **Comment**.

### 2. View Pending Participation Requests
- Below the form, see **Pending Participation Requests** listing each request’s Node ID, Network, Apps, Email, SLA status, Comment, and date.

### 3. View Accepted Nodes (Nodes in Co-ops)
- Review the **Nodes in Co-ops** table showing each member’s **Name**, **Node ID**, **Apps Accepted**, and any scheduled **Maintenance** windows.

### 4. Schedule Maintenance Windows
- In the **Nodes in Co-ops** table, click **Schedule Maintenance** for a node.
- Enter **Start** and **End** date/time and an optional **Comment**, then submit.

### 5. View Pending Maintenance Windows
- See **Pending Maintenance Windows** section listing each scheduled window with Node ID, Start, End, Comment, and request date.
