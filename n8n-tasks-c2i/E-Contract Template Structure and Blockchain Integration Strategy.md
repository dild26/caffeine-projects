# E-Contract Template Structure and Blockchain Integration Strategy

## 1. Common E-Contract Template Structure

To ensure compatibility with the SigVerify system and leverage the benefits of Ethereum-based digital signatures, all e-contract templates will adhere to a common, extensible structure. This structure is primarily designed around the [EIP-712](https://eips.ethereum.org/EIPS/eip-712) standard for typed structured data hashing and signing. EIP-712 allows for human-readable and domain-specific data to be signed, which is crucial for legal documents where the intent of the signature must be unambiguous.

Each e-contract will consist of two main components:

1.  **Off-chain Document Content:** This is the full legal text of the e-contract, which will be stored off-chain. This content can be in various formats (e.g., PDF, Markdown, plain text). For the purpose of verification on the blockchain, a cryptographic hash of this document will be included in the on-chain verifiable data.
2.  **On-chain Verifiable Metadata (EIP-712 Structured Data):** This component will contain a standardized set of metadata about the e-contract and its participants, formatted according to EIP-712. This structured data is what will be signed by the parties involved and subsequently verified by the SigVerify system. The core elements of this structured data will include:
    *   **EIP712 Domain Separator:** This ensures that signatures are unique to a specific application or context, preventing replay attacks across different contracts or platforms. It will typically include `name`, `version`, `chainId`, and `verifyingContract` (if applicable).
    *   **Message Type Definition:** A specific EIP712 type definition for each e-contract type (e.g., `AcceptanceLetter`, `LoanAgreement`). This definition will outline the fields relevant to that particular contract, such as `contractHash`, `contractTitle`, `effectiveDate`, and specific terms or values pertinent to the contract.
    *   **Participant Information:** Details about each party involved in the contract, including their Ethereum address, role (e.g., `buyer`, `seller`, `lender`, `borrower`), and any other relevant identifying information. This will be an array of `Party` structs within the EIP712 message.

### Generic EIP-712 Structure for E-Contracts

Below is a conceptual representation of the generic EIP-712 structure that will be adapted for each specific e-contract type:

```json
{
  "types": {
    "EIP712Domain": [
      { "name": "name", "type": "string" },
      { "name": "version", "type": "string" },
      { "name": "chainId", "type": "uint256" },
      { "name": "verifyingContract", "type": "address" }
    ],
    "Party": [
      { "name": "role", "type": "string" },
      { "name": "ethereumAddress", "type": "address" },
      { "name": "name", "type": "string" },
      { "name": "additionalInfo", "type": "string" } // e.g., company name, government ID
    ],
    "EContract": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" }, // SHA-256 hash of the off-chain document
      { "name": "effectiveDate", "type": "uint256" }, // Unix timestamp
      { "name": "parties", "type": "Party[]" }
      // Additional fields specific to each contract type will be added here
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>", // e.g., 1 for Ethereum Mainnet, 11155111 for Sepolia
    "verifyingContract": "0x0000000000000000000000000000000000000000" // Or a specific contract address if applicable
  },
  "primaryType": "EContract",
  "message": {