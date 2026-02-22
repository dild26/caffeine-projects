# E-Contract Template: Term Sheet

## Description

This template is for a Term Sheet, which summarizes key terms of a transaction or agreement. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the term sheet, while the EIP-712 message will capture key verifiable metadata.

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
    "TermSheet": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "transactionType", "type": "string" },
      { "name": "dealValue", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "keyTermsSummary", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "TermSheet",
  "message": {
    "contractType": "TermSheet",
    "contractTitle": "Term Sheet for [Transaction Type] - [Deal Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "partyA", "ethereumAddress": "<PARTYA_ADDRESS>", "name": "<PARTYA_NAME>", "additionalInfo": "" },
      { "role": "partyB", "ethereumAddress": "<PARTYB_ADDRESS>", "name": "<PARTYB_NAME>", "additionalInfo": "" }
    ],
    "transactionType": "<TYPE_OF_TRANSACTION_E.G._ACQUISITION_INVESTMENT_LOAN>",
    "dealValue": "<TOTAL_VALUE_OF_THE_DEAL>",
    "currency": "<CURRENCY_OF_DEAL_VALUE>",
    "keyTermsSummary": "<BRIEF_SUMMARY_OF_KEY_TERMS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Term Sheet]

TERM SHEET

This Term Sheet ("Term Sheet") summarizes the principal terms and conditions for a proposed [Transaction Type, e.g., "acquisition", "investment", "loan"] (the "Transaction") between the parties identified below.

Date: [Date]

**1. PARTIES:**

*   **Party A:** [Party A Name/Company Name]
    Address: [Party A Address]
    Ethereum Address: [Party A Ethereum Address]

*   **Party B:** [Party B Name/Company Name]
    Address: [Party B Address]
    Ethereum Address: [Party B Ethereum Address]

**2. TRANSACTION OVERVIEW:**

[Brief description of the proposed transaction, e.g., "Party A proposes to acquire 100% of the equity interests of Party B.", "Party A proposes to invest [Amount] in Party B in exchange for [Equity/Debt Instrument]."]

**3. KEY TERMS:**

[List and describe the essential terms of the transaction. This section should be detailed enough to capture the core understanding but not exhaustive. Examples include:

*   **Purchase Price/Investment Amount:** [Deal Value] [Currency]
*   **Consideration:** [How the purchase price/investment will be paid, e.g., "cash", "shares", "cryptocurrency"]
*   **Closing Date:** [Proposed Closing Date]
*   **Conditions Precedent:** [Key conditions that must be met before closing, e.g., "completion of due diligence", "regulatory approvals", "shareholder approval"]
*   **Exclusivity:** [Period during which parties will negotiate exclusively]
*   **Representations and Warranties:** [General statement about standard representations and warranties]
*   **Covenants:** [Key agreements or restrictions on parties during the negotiation period]
*   **Governing Law:** [Jurisdiction whose laws will govern the definitive agreement]
*   **Dispute Resolution:** [Method for resolving disputes, e.g., "arbitration", "litigation"]
*   **Confidentiality:** [Agreement to keep discussions and terms confidential]
*   **Break-up Fee (if applicable):** [Amount payable if the transaction does not close under certain circumstances]
*   **For Loans:** Interest Rate, Repayment Schedule, Collateral.
*   **For Investments:** Valuation, Equity Percentage, Board Representation, Liquidation Preferences.]

**4. NON-BINDING NATURE:**

This Term Sheet is intended solely as a summary of the principal terms of the proposed Transaction and is **non-binding**, except for the provisions relating to [specify binding provisions, e.g., "Confidentiality", "Exclusivity", "Governing Law", "Expenses"]. A binding agreement will only be created upon the execution of definitive legal documentation by both parties.

**5. EXPENSES:**

[Specify how expenses related to the Transaction will be handled, e.g., "Each party shall bear its own costs and expenses.", "Party A shall reimburse Party B for reasonable out-of-pocket expenses up to [Amount]."]

IN WITNESS WHEREOF, the parties have executed this Term Sheet as of the date first written above.

[Party A Signature Block]
[Party A Printed Name]
[Party A Title]

[Party B Signature Block]
[Party B Printed Name]
[Party B Title]
```

## Signing Guidance

Both Party A and Party B should sign the EIP-712 message using their Ethereum wallets to acknowledge their agreement to the summarized terms. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Term Sheet. The `transactionType`, `dealValue`, `currency`, and `keyTermsSummary` fields should accurately reflect the core terms of the proposed transaction. Both parties’ details are crucial for verification and should be accurately represented in the `parties` array.

