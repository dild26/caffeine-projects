# E-Contract Template: Information Memorandum

## Description

This template is for an Information Memorandum, which provides detailed deal information (often for e-Bonds). It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full information memorandum, while the EIP-712 message will capture key verifiable metadata.

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
    "InformationMemorandum": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "dealName", "type": "string" },
      { "name": "issuerAddress", "type": "address" },
      { "name": "offeringAmount", "type": "uint256" },
      { "name": "currency", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "InformationMemorandum",
  "message": {
    "contractType": "InformationMemorandum",
    "contractTitle": "Information Memorandum for [Deal Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "issuer", "ethereumAddress": "<ISSUER_ADDRESS>", "name": "<ISSUER_NAME>", "additionalInfo": "" },
      { "role": "leadArranger", "ethereumAddress": "<LEAD_ARRANGER_ADDRESS>", "name": "<LEAD_ARRANGER_NAME>", "additionalInfo": "" }
    ],
    "dealName": "<NAME_OF_THE_DEAL_OR_OFFERING>",
    "issuerAddress": "<ISSUER_ADDRESS>",
    "offeringAmount": "<TOTAL_OFFERING_AMOUNT>",
    "currency": "<CURRENCY_OF_OFFERING>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Information Memorandum]

INFORMATION MEMORANDUM

[Deal Name]

Date: [Date]

CONFIDENTIAL

This Information Memorandum (this "Memorandum") has been prepared by [Issuer Name/Company Name] (the "Issuer") in connection with a proposed offering of [describe securities, e.g., "unsecured notes", "equity shares"] (the "Securities"). This Memorandum is being furnished solely for the purpose of providing information to prospective investors to assist them in making their own evaluation of the Issuer and the Securities.

IMPORTANT NOTICE:

This Memorandum does not constitute an offer to sell or a solicitation of an offer to buy any securities. The information contained herein is subject to change without notice. Prospective investors should conduct their own due diligence and consult with their own legal, financial, and tax advisors before making any investment decision.

I. EXECUTIVE SUMMARY

[Brief overview of the Issuer, the proposed offering, and key highlights of the investment opportunity.]

II. THE ISSUER

[Detailed information about the Issuer, including its history, business operations, management team, and market position.]

III. THE OFFERING

*   **Securities Offered:** [Type and quantity of securities]
*   **Offering Amount:** [Total Offering Amount] [Currency]
*   **Use of Proceeds:** [How the funds raised will be used]
*   **Key Terms:** [Summary of key terms, e.g., interest rate, maturity, repayment schedule, conversion rights]

IV. INDUSTRY AND MARKET OVERVIEW

[Analysis of the industry in which the Issuer operates, market trends, competitive landscape, and growth opportunities.]

V. FINANCIAL INFORMATION

[Summary of historical financial performance, including key financial statements (e.g., income statement, balance sheet, cash flow statement) and financial projections.]

VI. RISK FACTORS

[Detailed discussion of the risks associated with the Issuer, its business, the industry, and the Securities. Examples include:
- Market risk
- Operational risk
- Regulatory risk
- Liquidity risk
- Technology risk]

VII. LEGAL AND REGULATORY MATTERS

[Overview of relevant legal and regulatory frameworks, permits, licenses, and any pending litigation.]

VIII. APPENDICES (if applicable)

[Any supporting documents, such as audited financial statements, legal opinions, or market reports.]

ACKNOWLEDGMENT OF RECEIPT:

By receiving this Memorandum, the recipient acknowledges and agrees to the terms and conditions set forth herein, including the confidential nature of the information.

[Issuer Signature Block]
[Issuer Printed Name]
[Issuer Title]

[Lead Arranger/Underwriter Signature Block (if applicable)]
[Lead Arranger/Underwriter Printed Name]
[Lead Arranger/Underwriter Title]
```

## Signing Guidance

The `issuer` party should sign the EIP-712 message using their Ethereum wallet to attest to the accuracy and completeness of the information provided. Other parties involved in the offering (e.g., `leadArranger`, `underwriter`) may also sign to acknowledge their role in the preparation or distribution of the memorandum. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Information Memorandum. The `dealName`, `issuerAddress`, `offeringAmount`, and `currency` fields should accurately reflect the key details of the offering. All relevant parties' details are crucial for verification and should be accurately represented in the `parties` array.

