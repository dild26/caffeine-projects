# E-Contract Template: Offering Circular

## Description

This template is for an Offering Circular, which discloses details in a bond or securities offering. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the offering circular, while the EIP-712 message will capture key verifiable metadata.

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
    "OfferingCircular": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "offeringName", "type": "string" },
      { "name": "issuerAddress", "type": "address" },
      { "name": "totalOfferingAmount", "type": "uint256" },
      { "name": "currency", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "OfferingCircular",
  "message": {
    "contractType": "OfferingCircular",
    "contractTitle": "Offering Circular for [Offering Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "issuer", "ethereumAddress": "<ISSUER_ADDRESS>", "name": "<ISSUER_NAME>", "additionalInfo": "" },
      { "role": "underwriter", "ethereumAddress": "<UNDERWRITER_ADDRESS>", "name": "<UNDERWRITER_NAME>", "additionalInfo": "" }
    ],
    "offeringName": "<NAME_OF_THE_SECURITIES_OFFERING>",
    "issuerAddress": "<ISSUER_ADDRESS>",
    "totalOfferingAmount": "<TOTAL_AMOUNT_OF_SECURITIES_BEING_OFFERED>",
    "currency": "<CURRENCY_OF_OFFERING>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Offering Circular]

OFFERING CIRCULAR

[Offering Name]

Date: [Date]

CONFIDENTIAL

This Offering Circular (this "Circular") is being furnished by [Issuer Name/Company Name] (the "Issuer") in connection with the offering of [describe securities, e.g., "up to [Number] of its [Type of Securities]", "bonds with a principal amount of [Amount]"] (the "Securities"). This Circular provides information about the Issuer and the Securities to assist prospective investors in making an informed investment decision.

IMPORTANT NOTICE:

This Circular does not constitute an offer to sell or a solicitation of an offer to buy any securities in any jurisdiction where such offer or solicitation would be unlawful. Investment in the Securities involves significant risks. Prospective investors should read this Circular in its entirety, including the section titled "Risk Factors," and consult with their own legal, financial, and tax advisors.

I. SUMMARY OF THE OFFERING

[Brief overview of the offering, including the type of securities, total amount, and key terms.]

II. THE ISSUER

[Detailed information about the Issuer, its business, history, management, and financial condition.]

III. THE SECURITIES

[Detailed description of the Securities being offered, including their terms, rights, and obligations. For bonds, this would include interest rates, maturity dates, covenants, and any security.]

IV. USE OF PROCEEDS

[Explanation of how the proceeds from the offering will be used by the Issuer.]

V. RISK FACTORS

[Comprehensive discussion of all material risks associated with the Issuer, its business, the industry, and the Securities. This section is critical and should be exhaustive.]

VI. MANAGEMENT AND GOVERNANCE

[Information about the Issuer's management team, board of directors, and corporate governance structure.]

VII. FINANCIAL INFORMATION

[Presentation of the Issuer's historical financial statements (e.g., audited balance sheets, income statements, cash flow statements) and any pro forma financial information.]

VIII. LEGAL AND REGULATORY MATTERS

[Overview of relevant legal and regulatory frameworks, permits, licenses, and any pending or threatened litigation.]

IX. SUBSCRIPTION PROCEDURES

[Instructions for prospective investors on how to subscribe for the Securities.]

X. TAX CONSIDERATIONS

[General information regarding the tax implications of investing in the Securities. Investors should be advised to consult their own tax advisors.]

XI. APPENDICES (if applicable)

[Any supporting documents, such as legal opinions, material contracts, or financial projections.]

ACKNOWLEDGMENT OF RECEIPT:

By receiving this Circular, the recipient acknowledges and agrees to the terms and conditions set forth herein, including the confidential nature of the information.

[Issuer Signature Block]
[Issuer Printed Name]
[Issuer Title]

[Underwriter/Lead Manager Signature Block (if applicable)]
[Underwriter/Lead Manager Printed Name]
[Underwriter/Lead Manager Title]
```

## Signing Guidance

The `issuer` party should sign the EIP-712 message using their Ethereum wallet to attest to the accuracy and completeness of the information provided in the Offering Circular. Other parties involved in the offering (e.g., `underwriter`, `leadManager`) may also sign to acknowledge their role in the preparation or distribution of the circular. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Offering Circular. The `offeringName`, `issuerAddress`, `totalOfferingAmount`, and `currency` fields should accurately reflect the key details of the offering. All relevant parties' details are crucial for verification and should be accurately represented in the `parties` array.

