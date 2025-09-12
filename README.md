
# Basic-Training: A From-Scratch Implementation of Upgradeable ERC20 Proxies

This repository is an educational project designed to provide a deep understanding of the low-level mechanics behind upgradeable smart contracts. It features a hands-on implementation of the **Transparent** and **UUPS (Universal Upgradeable Proxy Standard)** patterns, built from the ground up using Hardhat without relying on high-level abstraction plugins.

**Disclaimer:** This code is for educational and demonstrative purposes only. It has not been professionally audited and should **not** be used in a production environment.

---

## Patterns Implemented

This project contains two distinct implementations of an upgradeable ERC20 token to showcase and compare the leading proxy patterns:

1.  **Transparent Proxy Pattern:** The upgrade logic is managed by a separate `ProxyAdmin` contract. This design prevents function selector clashes between the administrative functions of the proxy and the business logic of the implementation contract.

2.  **UUPS (Universal Upgradeable Proxy Standard) Pattern:** The upgrade logic is placed directly within the implementation contract itself. This results in a more gas-efficient and simpler deployment architecture.

##  Project Architecture

```

/
├── contracts/
│   ├── UpgradeableBase.sol       \# Custom implementation of Initializable and Ownable
│   ├── TransparentTokenLogic.sol \# V1 and V2 logic for the Transparent Token
│   ├── UUPSTokenLogic.sol        \# V1 and V2 logic for the UUPS Token
│   └── Proxies.sol               \# Manual implementations of Proxy, ProxyAdmin, and UUPSProxy
│
├── scripts/
│   └── deploy.js                 \# Script to deploy and upgrade both proxy patterns
│
└── hardhat.config.js             \# Hardhat project configuration

````

##  Key Concepts Demonstrated

-   **Manual Proxy Implementation:** The core use of the `fallback()` function and `delegatecall` to forward calls from the proxy to the logic contract.
-   **Storage Collision Prevention:** Utilization of EIP-1967 standard storage slots (`_IMPLEMENTATION_SLOT`, `_ADMIN_SLOT`) to ensure proxy and logic contract storage do not overlap.
-   **Separation of State and Logic:** The fundamental principle where the proxy contract maintains persistent state while the implementation contract provides upgradable logic.
-   **Custom Initializer Pattern:** The use of `initializer` functions in place of constructors to set the initial state of a contract through a proxy.
-   **Transparent vs. UUPS:** A practical comparison of the distinct deployment and upgrade workflows for both patterns.

##  Getting Started

To set up and run this project locally, please follow the steps below.

### 1. Clone the Repository
```bash
git clone https://github.com/avanish-syvora/Basic-Training
cd Basic-Training
````

### 2\. Install Dependencies

Install the necessary Node.js packages for the project.

```bash
npm install
```

### 3\. Start a Local Blockchain Node

In a new terminal window, start a local Hardhat node. This will provide a sandboxed blockchain environment with test accounts.

```bash
npx hardhat node
```

### 4\. Run the Deployment Script

In a second terminal window, execute the deployment script. This will deploy both proxy contracts, interact with their V1 logic, and subsequently upgrade them to V2.

```bash
npx hardhat run scripts/deploy.js --network localhost
```

You will see a detailed output of each step in the terminal.


---

Please Let me know for any changes required!!
