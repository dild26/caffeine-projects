# E-Contract Template: Financial Statement

## Description

This template is for a Financial Statement, which shows a party’s financial condition or obligations. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full financial statement, while the EIP-712 message will capture key verifiable metadata.

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
    "FinancialStatement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "statementPeriodStart", "type": "uint256" },
      { "name": "statementPeriodEnd", "type": "uint256" },
      { "name": "totalAssets", "type": "uint256" },
      { "name": "totalLiabilities", "type": "uint256" },
      { "name": "netWorth", "type": "uint256" },
      { "name": "currency", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "FinancialStatement",
  "message": {
    "contractType": "FinancialStatement",
    "contractTitle": "Financial Statement for [Party Name] - [Period]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "preparer", "ethereumAddress": "<PREPARER_ADDRESS>", "name": "<PREPARER_NAME>", "additionalInfo": "" },
      { "role": "entity", "ethereumAddress": "<ENTITY_ADDRESS>", "name": "<ENTITY_NAME>", "additionalInfo": "" }
    ],
    "statementPeriodStart": "<UNIX_TIMESTAMP_OF_PERIOD_START>",
    "statementPeriodEnd": "<UNIX_TIMESTAMP_OF_PERIOD_END>",
    "totalAssets": "<TOTAL_ASSETS_AMOUNT>",
    "totalLiabilities": "<TOTAL_LIABILITIES_AMOUNT>",
    "netWorth": "<NET_WORTH_AMOUNT>",
    "currency": "<CURRENCY_OF_FINANCIAL_VALUES>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Financial Statement]

FINANCIAL STATEMENT

For the Period [Start Date] to [End Date]

Prepared For: [Entity Name]
Prepared By: [Preparer Name/Company Name]
Date Prepared: [Date]

I. BALANCE SHEET

ASSETS:

*   Current Assets:
    *   Cash and Cash Equivalents: [Amount]
    *   Accounts Receivable: [Amount]
    *   Inventory: [Amount]
    *   Other Current Assets: [Amount]
    *   Total Current Assets: [Total Current Assets Amount]

*   Non-Current Assets:
    *   Property, Plant, and Equipment (Net): [Amount]
    *   Intangible Assets: [Amount]
    *   Other Non-Current Assets: [Amount]
    *   Total Non-Current Assets: [Total Non-Current Assets Amount]

TOTAL ASSETS: [Total Assets Amount]

LIABILITIES AND EQUITY:

*   Current Liabilities:
    *   Accounts Payable: [Amount]
    *   Short-Term Debt: [Amount]
    *   Other Current Liabilities: [Amount]
    *   Total Current Liabilities: [Total Current Liabilities Amount]

*   Non-Current Liabilities:
    *   Long-Term Debt: [Amount]
    *   Other Non-Current Liabilities: [Amount]
    *   Total Non-Current Liabilities: [Total Non-Current Liabilities Amount]

TOTAL LIABILITIES: [Total Liabilities Amount]

EQUITY:

*   Owner's Equity / Shareholder's Equity: [Amount]

TOTAL LIABILITIES AND EQUITY: [Total Liabilities and Equity Amount]

II. INCOME STATEMENT (Optional - if included in this statement)

For the Period [Start Date] to [End Date]

*   Revenue: [Amount]
*   Cost of Goods Sold: [Amount]
*   Gross Profit: [Amount]
*   Operating Expenses: [Amount]
*   Net Income: [Amount]

III. CASH FLOW STATEMENT (Optional - if included in this statement)

For the Period [Start Date] to [End Date]

*   Net Cash from Operating Activities: [Amount]
*   Net Cash from Investing Activities: [Amount]
*   Net Cash from Financing Activities: [Amount]
*   Net Increase/Decrease in Cash: [Amount]

IV. NOTES TO FINANCIAL STATEMENT (Optional)

[Any additional notes, disclosures, or explanations relevant to the financial data presented.]

DECLARATION:

I/We hereby certify that the information contained in this Financial Statement is true and accurate to the best of my/our knowledge and belief.

IN WITNESS WHEREOF, the Preparer has executed this Financial Statement as of the date first written above.

[Preparer Signature Block]
[Preparer Printed Name]
[Preparer Title]
```

## Signing Guidance

The `preparer` party (the individual or entity responsible for preparing the financial statement) should sign the EIP-712 message using their Ethereum wallet. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Financial Statement. The `statementPeriodStart`, `statementPeriodEnd`, `totalAssets`, `totalLiabilities`, `netWorth`, and `currency` fields should accurately reflect the key financial figures and period covered. The `entity` party's details are included for context and verification. This document is primarily signed by the preparer to attest to the accuracy of the financial information.

