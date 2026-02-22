# E-Contract Template: UCC Financing Statement (UCC-1)

## Description

This template is for a UCC Financing Statement (UCC-1), used in the U.S. to perfect a security interest. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full UCC-1 form, while the EIP-712 message will capture key verifiable metadata.

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
    "UCCFinancingStatement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "debtorName", "type": "string" },
      { "name": "securedPartyName", "type": "string" },
      { "name": "collateralDescriptionSummary", "type": "string" },
      { "name": "filingJurisdiction", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "UCCFinancingStatement",
  "message": {
    "contractType": "UCCFinancingStatement",
    "contractTitle": "UCC Financing Statement for [Debtor Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "debtor", "ethereumAddress": "<DEBTOR_ADDRESS>", "name": "<DEBTOR_NAME>", "additionalInfo": "" },
      { "role": "securedParty", "ethereumAddress": "<SECURED_PARTY_ADDRESS>", "name": "<SECURED_PARTY_NAME>", "additionalInfo": "" }
    ],
    "debtorName": "<FULL_NAME_OR_ORGANIZATION_NAME_OF_DEBTOR>",
    "securedPartyName": "<FULL_NAME_OR_ORGANIZATION_NAME_OF_SECURED_PARTY>",
    "collateralDescriptionSummary": "<BRIEF_SUMMARY_OF_COLLATERAL_COVERED>",
    "filingJurisdiction": "<STATE_WHERE_UCC1_IS_FILED>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the UCC Financing Statement (UCC-1)]

UCC FINANCING STATEMENT (FORM UCC-1)

**A. DEBTOR INFORMATION:**

1.  **ORGANIZATION'S NAME:** [Debtor Organization Name (if applicable)]
    **INDIVIDUAL'S LAST NAME:** [Debtor Last Name (if applicable)]
    **FIRST NAME:** [Debtor First Name (if applicable)]
    **MIDDLE NAME:** [Debtor Middle Name (if applicable)]
    **SUFFIX:** [Debtor Suffix (if applicable)]

2.  **MAILING ADDRESS:** [Debtor Mailing Address]
    **CITY:** [Debtor City]
    **STATE:** [Debtor State]
    **POSTAL CODE:** [Debtor Postal Code]
    **COUNTRY:** [Debtor Country]

3.  **TYPE OF ORGANIZATION:** [e.g., Corporation, LLC, Partnership, Individual]
    **JURISDICTION OF ORGANIZATION:** [State/Country of Organization]
    **ORGANIZATIONAL ID # (if any):** [Debtor Organizational ID]

**B. SECURED PARTY INFORMATION:**

1.  **ORGANIZATION'S NAME:** [Secured Party Organization Name (if applicable)]
    **INDIVIDUAL'S LAST NAME:** [Secured Party Last Name (if applicable)]
    **FIRST NAME:** [Secured Party First Name (if applicable)]
    **MIDDLE NAME:** [Secured Party Middle Name (if applicable)]
    **SUFFIX:** [Secured Party Suffix (if applicable)]

2.  **MAILING ADDRESS:** [Secured Party Mailing Address]
    **CITY:** [Secured Party City]
    **STATE:** [Secured Party State]
    **POSTAL CODE:** [Secured Party Postal Code]
    **COUNTRY:** [Secured Party Country]

**C. COLLATERAL:**

[Detailed description of the collateral covered by the financing statement. This should be precise and legally sufficient to identify the assets. Examples:

*   "All of Debtor's existing and hereafter acquired accounts, chattel paper, inventory, equipment, general intangibles, and proceeds thereof."
*   "Specific equipment: [Manufacturer, Model, Serial Number] located at [Address]."
*   "All digital assets held in the Ethereum wallet address: [Debtor's Ethereum Address] and any associated smart contract tokens."]

**D. FILING INFORMATION:**

1.  **FILING OFFICE:** [Name of Filing Office, e.g., "Secretary of State of [State]"]
2.  **FILING DATE:** [Date of Filing]
3.  **FILING NUMBER (if known):** [Filing Number]

**E. OPTIONAL FILER REFERENCE DATA:**

[Any internal reference numbers or codes for the filer's convenience.]

**F. SIGNATURES:**

By signing below, the Debtor authorizes the filing of this Financing Statement.

**DEBTOR AUTHORIZATION:**

[Debtor Signature Block]
[Debtor Printed Name]
[Debtor Title]

**SECURED PARTY ACKNOWLEDGMENT (Optional, but common):**

[Secured Party Signature Block]
[Secured Party Printed Name]
[Secured Party Title]
```

## Signing Guidance

The `debtor` party should sign the EIP-712 message using their Ethereum wallet to authorize the filing of the UCC-1. The `securedParty` may also sign to acknowledge the filing. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the UCC Financing Statement. The `debtorName`, `securedPartyName`, `collateralDescriptionSummary`, and `filingJurisdiction` fields should accurately reflect the key details of the UCC-1. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

