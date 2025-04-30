# The Big Picture

This document provides visual representations of the ThreeFold Cloud Marketplace ecosystem, illustrating the relationships between Cloud Providers, Cloud Operators, and Cloud Users.

## Ecosystem Layers

The ThreeFold Cloud Marketplace implements a three-layer system to deliver a decentralized cloud economy. This diagram shows the hierarchical relationship between the three main participants, with Cloud Providers forming the foundation, Cloud Operators building the marketplace layer, and Cloud Users consuming services at the top.

```mermaid
graph BT
  CP["Cloud Providers\nProvision and maintain TFGrid nodes"] --> CO["Cloud Operators\nHost and configure marketplace interface"] --> CU["Cloud Users\nDeploy and manage applications"]
```

## Interaction Flow

This sequence diagram illustrates the chronological flow of interactions between the three participants, showing how they communicate and collaborate throughout the setup, deployment, and operational phases of the marketplace.

```mermaid
sequenceDiagram
  participant CP as Cloud Provider
  participant CO as Cloud Operator
  participant CU as Cloud User
  
  CP->>CO: Register nodes & form alliance
  CO->>CP: Approve alliance participation
  CU->>CO: Select app & deployment options
  CO->>CU: Display pricing & SLA
  CU->>CO: Confirm deployment
  CO->>CP: Deploy workload on provider nodes
  CP->>CO: Allocate resources
  CO->>CU: Provide deployment access
```

## Deployment Flow

This diagram shows the step-by-step process of deploying an application, from the user's initial selection to the final access provision. It highlights how the three participants work together to create a seamless deployment experience.

```mermaid
graph LR
  U["User"] -->|"1. Select app"| O["Operator"]
  O -->|"2. Process payment"| U
  O -->|"3. Deploy workload"| P["Provider"]
  P -->|"4. Allocate resources"| O
  O -->|"5. Provide access"| U
```

## Token Economics

This diagram illustrates the flow of payments and token conversions in the ecosystem. It shows how fiat payments from users are converted to TFT tokens by operators, and how providers receive a portion of these tokens as payment for their resources.

```mermaid
graph LR
  U["User"] -->|"Pay in Fiat $"| O["Operator"]
  O -->|"Convert to TFT"| T["TFChain"]
  T -->|"50% of TFChain portion"| P["Provider"]
```

## Cloud Alliances

This diagram depicts how Cloud Alliances form strategic partnerships between providers with different node specializations and operators. These alliances enable the delivery of specialized services to users with specific requirements.

```mermaid
graph TD
  P1["Provider 1\nStorage Nodes"] --- O["Operator"]
  P2["Provider 2\nGPU Nodes"] --- O
  P3["Provider 3\nHigh Bandwidth"] --- O
  
  O --> U1["User 1"]
  O --> U2["User 2"]
  O --> U3["User 3"]
```

## Node Types

This diagram showcases the various types of nodes that Cloud Providers can offer, each optimized for different workloads and use cases. The diversity of node types enables a wide range of applications to be deployed on the ThreeFold Grid.

```mermaid
graph TD
  NT["Node Types"]
  VM["VM Nodes\n8+ CPU cores, 32+ GB RAM"]
  K8S["Kubernetes Nodes\n16+ CPU cores, 64+ GB RAM"]
  STOR["Storage Nodes\nHigh-capacity NVMe/HDD"]
  GPU["GPU Nodes\nNVIDIA RTX 4090/5090"]
  NET["High Bandwidth Nodes\n1+ Gbps symmetric"]
  
  NT --- VM
  NT --- K8S
  NT --- STOR
  NT --- GPU
  NT --- NET
```

## User Deployment Options

This diagram illustrates the two deployment modes available to users: Basic mode with automatic node selection for simplicity, and Advanced mode with custom filters for more control. Both paths lead to successful deployments with different levels of user involvement.

```mermaid
graph TD
  U["User"] --> B["Basic Mode\nAuto node selection"]
  U --> A["Advanced Mode\nCustom filters"]
  
  B --> D["Deployment"]
  A --> D
```

## Circular Economy Benefits

This diagram represents the circular nature of the ThreeFold ecosystem, showing how decentralization leads to open participation, which enables transparency, which in turn reinforces decentralization. This virtuous cycle creates a sustainable and equitable cloud economy.

```mermaid
graph LR
  D["Decentralized"] --> O["Open Participation"] --> T["Transparent"] --> D
```

## Complete Ecosystem Overview

This comprehensive diagram brings together all aspects of the ThreeFold Cloud Marketplace, showing the relationships between participants, their key functions, and how they interact to create a complete cloud ecosystem. It provides a bird's-eye view of the entire marketplace structure.

```mermaid
graph BT
  CP["Cloud Providers"] --> CO["Cloud Operators"] --> CU["Cloud Users"]
  
  CP --- NODES["TFGrid Nodes"]
  CP --- ALLIANCE1["Form Cloud Alliances"]
  
  CO --- DASH["Marketplace Dashboard"]
  CO --- PAY["Payment Processing"]
  CO --- ALLIANCE2["Join Cloud Alliances"]
  
  CU --- DEPLOY["Deployment Options"]
  CU --- MONITOR["Monitoring & Management"]