# Welcome

The ThreeFold Cloud Marketplace is built on a three-layer ecosystem to ensure a cohesive and complete circular economy—by the people, for the people. Below is a three-layer vertical flow from bottom to top, illustrating how each layer builds upon the previous one:

```mermaid
graph BT
  NO["Node Operators<br/>Provide nodes: Internet & cloud resources"]
  DO["Dashboard Operators<br/>Provide app platform for users built on the nodes"]
  DU["Dashboard Users<br/>Deploy apps on the cloud marketplace"]

  NO --> DO
  DO --> DU

  click NO "/docs/node-operator"
  click DO "/docs/dashboard-operator"
  click DU "/docs/dashboard-user"
```

## Overview

The ThreeFold Cloud Marketplace is an open, decentralized platform that unites community-driven infrastructure with streamlined application services. Node Operators supply the underlying compute and storage resources, Dashboard Operators deploy and manage applications on that infrastructure, and Dashboard Users leverage these applications to deliver workloads globally.