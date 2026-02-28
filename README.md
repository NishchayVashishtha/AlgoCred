# 🎓 AlgoCred: Enterprise-Grade Verifiable Credentials Protocol

![Algorand](https://img.shields.io/badge/Algorand-Blockchain-black?style=for-the-badge&logo=algorand)
![CryptoForge](https://img.shields.io/badge/Hackathon-DTU_CryptoForge-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**AlgoCred** is a Privacy-Preserving Decentralized Academic Credential Verifier built natively on the Algorand blockchain. We transform traditional, easily forgeable academic achievements into immutable, universally verifiable **Soulbound Tokens (SBTs)**.

Built exclusively for the **CryptoForge Hackathon**, AlgoCred aligns with the vision of driving Web3 adoption by providing a highly scalable, real-world dApp that solves a billion-dollar problem: Academic and Professional Forgery.


---

## 🚨 The Problem
The current credential verification system is broken:
* **Manual & Slow:** Background checks take weeks, relying on physical emails and phone calls to universities.
* **Highly Forgeable:** PDF degrees and paper certificates are easily replicated.
* **Privacy Leaks:** Sharing a raw transcript exposes sensitive personal data (exact grades, address, birthdate) unnecessarily.

## 💡 The AlgoCred Solution
We don't just issue digital PDFs; we issue cryptographic proofs.
1. **Zero-Forgeability:** Degrees are minted as Algorand Standard Assets (ASAs) with strictly configured `default-frozen: true` parameters, making them non-transferable (Soulbound).
2. **Instant Verification:** A hybrid query engine that bypasses standard Indexer lag for zero-latency verification.
3. **Privacy-First Validation:** Framework designed for selective disclosure so students can prove qualifications without exposing raw data.

---

## 🎯 Hackathon Deliverables Achieved

We successfully mapped and executed every requirement of the CryptoForge Problem Statement:

- [x] **Credential Issuance Interface:** An institutional dashboard featuring Multi-Sig Governance to securely mint IPFS-backed SBTs.
- [x] **Student Dashboard & Wallet Integration:** Seamless Pera Wallet integration for students to securely hold their Soulbound achievements.
- [x] **Public Verification Engine:** A robust verifier that accepts an Asset ID and cross-references Algorand's immutable ledger to confirm authenticity.
- [x] **Shareable Social Oracle:** A 1-Click "Bind to LinkedIn" integration that automatically maps the verified blockchain asset to a professional profile.

---

## 🔥 Enterprise Architecture & "Wow" Factors (v3.0)

Beyond a standard prototype, AlgoCred is engineered for real-world enterprise incubation:

* **W3C DID Compliance:** Assets are architected to map to the global Decentralized Identifier (`did:algo:testnet`) standard.
* **Hybrid Verification Engine (Anti-Lag):** We engineered a smart fallback system. The frontend prioritizes Direct Node (`Algodv2`) querying for instant finality, falling back to the Indexer only for deep historical data.
* **Privacy-Preserving ZKP Simulation:** [Image of Zero-Knowledge Proof workflow for credential verification]
  Integration logic for Zero-Knowledge Proofs, allowing a student to cryptographically prove a statement (e.g., "CGPA > 8.0") to an employer without revealing the exact transcript.
* **Smart Escrow Bounties (DeFi meets EdTech):** Prepared architecture where recruiters can lock ALGO bounties in smart contracts, released automatically upon the verified hiring of an AlgoCred SBT holder.
* **Multi-Sig Institutional Governance:** Issuance requires mathematical consensus (Threshold 2/3: Admin, HOD, Dean) via Algorand multi-signature accounts, preventing unilateral forgery.

---

## 🛠️ Tech Stack & Infrastructure

This project is structured as an **AlgoKit monorepo**, ensuring a secure and productive development environment.

* **Layer 1:** Algorand Testnet (High TPS, 3.3s Finality, Micro-cent fees)
* **Smart Contracts (`AlgoCred-contracts`):** Python (PyTeal), Poetry, pytest
* **Frontend (`AlgoCred-frontend`):** React.js, Vite, Tailwind CSS (Glassmorphism UI)
* **Wallet & Auth:** Pera Wallet Connect
* **Storage:** IPFS (InterPlanetary File System) for immutable metadata pinning

---

## ⚙️ Local Setup & Installation (For Jury & Mentors)

Follow these instructions to bootstrap the local environment and test the AlgoCred protocol:

### Prerequisites
* Ensure [Docker](https://www.docker.com/) is installed and operational.
* Install [AlgoKit](https://github.com/algorandfoundation/algokit-cli) following the official guide.

### 1. Initial Setup
Clone this repository to your local machine:
```bash
git clone [https://github.com/NishchayVashishtha/AlgoCred.git](https://github.com/NishchayVashishtha/AlgoCred.git)
cd AlgoCred
```
### 2. Bootstrap the Environment
Run the following command in the root directory. This installs necessary dependencies, sets up a Python virtual environment, and prepares .env files.
```bash
algokit project bootstrap all
```
### 3. Configure Localnet / Testnet
Navigate to the smart contracts directory and generate the default configuration:
```bash
cd projects/AlgoCred-contracts
algokit generate env-file -a target_network localnet
cd ../..
```
### 4. Build and Compile
Execute the build command to compile smart contract artifacts and generate TypeScript application clients for the frontend (frontend/src/contracts).
```bash
algokit project run build
```
### 5. Launch the dApp
Once the monorepo is built, navigate to the frontend directory to start the local server:
``` bash
cd projects/AlgoCred-frontend
npm run dev
```
## Testing the Live Protocol (Jury Guide)
1. Connect:
Click "Connect Wallet" and link your Pera Wallet (Testnet).

2. Govern: 
Toggle the "Simulate Sign" button in the Multi-Sig panel to authorize the transaction.

3. Issue: 
Enter mock student details, upload a PDF document, and click "Mint Soulbound Asset".

4. Capture: 
Copy the generated W3C-compliant Asset ID from the Success Modal.

5. Verify:
Paste the Asset ID into the Public Verification tab and hit "Verify".

6. Explore: 
Toggle the ZKP Mode and explore the Social Oracle (LinkedIn) integrations to see the future of Web3 identity.

# Designed, Architected, and Built with ❤️ for DTU CryptoForge.
