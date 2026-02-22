# E-Contract Template: Risk Disclosure

## Description

This template is for a Risk Disclosure, which highlights potential risks of a deal. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the risk disclosure, while the EIP-712 message will capture key verifiable metadata.

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
    "RiskDisclosure": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "dealName", "type": "string" },
      { "name": "riskCategory", "type": "string" },
      { "name": "riskSummary", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "RiskDisclosure",
  "message": {
    "contractType": "RiskDisclosure",
    "contractTitle": "Risk Disclosure for [Deal Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "discloser", "ethereumAddress": "<DISCLOSER_ADDRESS>", "name": "<DISCLOSER_NAME>", "additionalInfo": "" },
      { "role": "recipient", "ethereumAddress": "<RECIPIENT_ADDRESS>", "name": "<RECIPIENT_NAME>", "additionalInfo": "" }
    ],
    "dealName": "<NAME_OF_THE_DEAL_OR_TRANSACTION>",
    "riskCategory": "<CATEGORY_OF_RISK_E.G._MARKET_OPERATIONAL_LEGAL>",
    "riskSummary": "<BRIEF_SUMMARY_OF_THE_RISKS_BEING_DISCLOSED>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Risk Disclosure]

RISK DISCLOSURE STATEMENT

Date: [Date]

Deal/Transaction Name: [Name of the Deal or Transaction]

This Risk Disclosure Statement is provided by [Discloser Name/Company Name] (the "Discloser") to [Recipient Name/Company Name] (the "Recipient") to highlight potential risks associated with the aforementioned Deal/Transaction.

**IMPORTANT NOTICE:**

This document is intended to inform the Recipient of certain risks and does not constitute an exhaustive list of all possible risks. The Recipient should carefully consider all information available and consult with independent legal, financial, and tax advisors before making any decisions related to the Deal/Transaction.

**Key Risks Disclosed:**

[Provide a detailed description of the risks. Categorize them for clarity. Examples include:

1.  **Market Risks:**
    *   Volatility of underlying assets/commodities.
    *   Changes in market demand or economic conditions.
    *   Liquidity risk, making it difficult to exit positions.

2.  **Operational Risks:**
    *   Failure of technology systems or infrastructure.
    *   Human error or fraud.
    *   Cybersecurity breaches.

3.  **Legal and Regulatory Risks:**
    *   Changes in laws or regulations that may adversely affect the deal.
    *   Uncertainty regarding the legal status of certain assets or activities.
    *   Risk of litigation or regulatory enforcement actions.

4.  **Financial Risks:**
    *   Loss of principal investment.
    *   Fluctuations in currency exchange rates.
    *   Credit risk of counterparties.

5.  **Technology/Blockchain Specific Risks (if applicable):**
    *   Smart contract vulnerabilities.
    *   Network congestion and high transaction fees.
    *   Regulatory uncertainty surrounding decentralized technologies.
    *   Loss of private keys.
    *   Oracles and data integrity risks.]

The Recipient acknowledges that they have received, read, and understood the risks outlined in this Disclosure Statement. The Recipient further acknowledges that they have had the opportunity to seek independent advice regarding these risks.

IN WITNESS WHEREOF, the Discloser has executed this Risk Disclosure Statement as of the date first written above.

[Discloser Signature Block]
[Discloser Printed Name]
[Discloser Title]

ACKNOWLEDGMENT OF RECEIPT AND UNDERSTANDING BY RECIPIENT:

[Recipient Signature Block]
[Recipient Printed Name]
[Recipient Title]
```

## Signing Guidance

The `discloser` party should sign the EIP-712 message using their Ethereum wallet to attest to the provision of the risk disclosure. The `recipient` party should also sign to acknowledge receipt and understanding of the disclosed risks. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Risk Disclosure. The `dealName`, `riskCategory`, and `riskSummary` fields should accurately reflect the content of the off-chain document. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

