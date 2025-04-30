# Welcome

The ThreeFold Cloud Marketplace is built on a three-layer ecosystem to ensure a cohesive and complete circular economy—by the people, for the people. Below is a three-layer vertical flow from bottom to top, illustrating how each layer builds upon the previous one:

```mermaid
graph BT
  CP["Cloud Providers<br/>Provide nodes: Internet & cloud resources"]
  CO["Cloud Operators<br/>Provide app platform for users built on the nodes"]
  CU["Cloud Users<br/>Deploy apps on the cloud marketplace"]

  CP --> CO
  CO --> CU

  click CP "/docs/cloud-provider"
  click CO "/docs/cloud-operator"
  click CU "/docs/cloud-user"
```

## Overview

The ThreeFold Cloud Marketplace is an open, decentralized platform that unites community-driven infrastructure with streamlined application services. Cloud Providers supply the underlying compute and storage resources, Cloud Operators deploy and manage applications on that infrastructure, and Cloud Users leverage these applications to deliver workloads globally.