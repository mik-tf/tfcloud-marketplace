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

- **Virtual Machine Nodes**: Balanced CPU cores (e.g., 8+), ample RAM (≥32 GB), and NVMe SSD storage for general compute workloads.
- **Kubernetes Nodes**: Container-optimized with multiple CPU cores (e.g., 16+), high RAM (≥64 GB), fast SSD storage, and reliable networking.
- **Basic Storage Nodes**: SSD-focused with high-capacity NVMe drives, moderate CPU and RAM for simple storage services.
- **Quantum Safe Storage (QSFS) Nodes**: HDD-heavy configuration for large-scale data, with SSD caching for metadata and improved I/O.
- **Nextcloud Nodes**: All-around nodes with gigabit network, ample RAM (≥32 GB), SSD storage, and optional GPU for Nextcloud AI features.
- **Open WebUI Nodes**: GPU-equipped (e.g., NVIDIA RTX 4090/5090) with sufficient RAM and SSD for serving interactive WebUI applications.
- **LiveKit / Video Conference Nodes**: High-bandwidth (≥1 Gbps symmetric), low-latency network, moderate compute, and memory for real-time video.

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
