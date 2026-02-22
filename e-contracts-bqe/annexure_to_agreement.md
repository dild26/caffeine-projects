# E-Contract Template: Annexure to Agreement

## Description

This template is for an Annexure to Agreement, which is a supplementary document providing additional details. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the annexure, while the EIP-712 message will capture key verifiable metadata.

## EIP-712 Type Definition

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
      { "name": "additionalInfo", "type": "string" }
    ],
    "AnnexureToAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "originalAgreementTitle", "type": "string" },
      { "name": "originalAgreementDate", "type": "uint256" },
      { "name": "annexurePurpose", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "AnnexureToAgreement",
  "message": {
    "contractType": "AnnexureToAgreement",
    "contractTitle": "Annexure to [Original Agreement Title]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "party1", "ethereumAddress": "<PARTY1_ADDRESS>", "name": "<PARTY1_NAME>", "additionalInfo": "" },
      { "role": "party2", "ethereumAddress": "<PARTY2_ADDRESS>", "name": "<PARTY2_NAME>", "additionalInfo": "" }
    ],
    "originalAgreementTitle": "<TITLE_OF_ORIGINAL_AGREEMENT>",
    "originalAgreementDate": "<UNIX_TIMESTAMP_OF_ORIGINAL_AGREEMENT_DATE>",
    "annexurePurpose": "<BRIEF_PURPOSE_OF_THE_ANNEXURE_E.G._ADDITIONAL_SCHEDULES_DEFINITIONS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Annexure to Agreement]

ANNEXURE TO AGREEMENT

This Annexure is attached to and forms an integral part of the agreement titled [Original Agreement Title] dated [Original Agreement Date] (the "Principal Agreement").

**Purpose of this Annexure:**

This Annexure provides [briefly describe the purpose, e.g., "additional details regarding the scope of services", "a schedule of assets", "further definitions relevant to the Principal Agreement"].

**Content of Annexure:**

[Insert the detailed content of the annexure here. This could be:

*   **Schedule of Assets:** A list of assets, their descriptions, and values.
*   **Detailed Scope of Work:** A comprehensive breakdown of tasks, deliverables, and timelines.
*   **Technical Specifications:** Detailed technical requirements or specifications for a product or service.
*   **Definitions:** A list of terms and their definitions specific to the Principal Agreement.
*   **Maps or Diagrams:** Visual representations relevant to the agreement.]

**Example Content Structure (Adapt as needed):**

**ANNEXURE A: SCOPE OF SERVICES**

1.  **Phase 1: Discovery and Planning**
    *   Task 1.1: Conduct stakeholder interviews.
    *   Deliverable: Discovery Report by [Date].

2.  **Phase 2: Development**
    *   Task 2.1: Develop front-end interface.
    *   Task 2.2: Implement smart contract logic.
    *   Deliverable: Beta Version by [Date].

**ANNEXURE B: LIST OF DIGITAL ASSETS**

| Asset Name | Token Standard | Contract Address | Token ID (if NFT) | Quantity |
| :--------- | :------------- | :--------------- | :---------------- | :------- |
| CryptoCoin | ERC-20         | 0x...            | N/A               | 1000     |
| RareArt    | ERC-721        | 0x...            | 123               | 1        |

**Binding Effect:**

This Annexure shall be read and construed as one with the Principal Agreement. In the event of any inconsistency between the terms of this Annexure and the Principal Agreement, the terms of the Principal Agreement shall prevail, unless this Annexure explicitly states otherwise.

IN WITNESS WHEREOF, the parties to the Principal Agreement have executed this Annexure as of the date first written above.

[Party 1 Signature Block]
[Party 1 Printed Name]
[Party 1 Title]

[Party 2 Signature Block]
[Party 2 Printed Name]
[Party 2 Title]
```

## Signing Guidance

All parties to the original agreement should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Annexure. The `originalAgreementTitle`, `originalAgreementDate`, and `annexurePurpose` fields should accurately reflect the context and content of the annexure. All parties’ details are crucial for verification and should be accurately represented in the `parties` array.

