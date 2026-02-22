# E-Contract Template: Loan Agreement

## Description

This template is for a Loan Agreement, which sets terms between a borrower and a lender. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the loan agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "LoanAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "loanAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "interestRate", "type": "string" },
      { "name": "repaymentScheduleSummary", "type": "string" },
      { "name": "maturityDate", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "LoanAgreement",
  "message": {
    "contractType": "LoanAgreement",
    "contractTitle": "Loan Agreement for [Borrower Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "lender", "ethereumAddress": "<LENDER_ADDRESS>", "name": "<LENDER_NAME>", "additionalInfo": "" },
      { "role": "borrower", "ethereumAddress": "<BORROWER_ADDRESS>", "name": "<BORROWER_NAME>", "additionalInfo": "" }
    ],
    "loanAmount": "<TOTAL_LOAN_AMOUNT>",
    "currency": "<CURRENCY_OF_LOAN>",
    "interestRate": "<INTEREST_RATE_E.G._5_PERCENT_ANNUAL>",
    "repaymentScheduleSummary": "<BRIEF_SUMMARY_OF_REPAYMENT_SCHEDULE>",
    "maturityDate": "<UNIX_TIMESTAMP_OF_MATURITY_DATE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Loan Agreement]

LOAN AGREEMENT

This Loan Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Lender Name/Company Name], with an address at [Lender Address] (hereinafter referred to as the "Lender"),

AND

[Borrower Name/Company Name], with an address at [Borrower Address] (hereinafter referred to as the "Borrower").

WHEREAS, the Borrower desires to borrow money from the Lender, and the Lender desires to lend money to the Borrower, subject to the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  LOAN AMOUNT. The Lender agrees to lend to the Borrower the principal sum of [Loan Amount] [Currency] (the "Loan").

2.  INTEREST. The Loan shall bear interest at the rate of [Interest Rate] per annum.

3.  REPAYMENT. The Borrower shall repay the Loan, together with accrued interest, according to the following schedule:
    [Detailed repayment schedule, e.g., "monthly installments of [Amount] commencing on [Date]", "a single lump sum payment on the Maturity Date"]

4.  MATURITY DATE. The entire unpaid principal balance of the Loan, together with all accrued and unpaid interest, shall be due and payable in full on [Maturity Date].

5.  DEFAULT. In the event of default by the Borrower (as defined in the full agreement), the Lender shall have the right to [describe remedies, e.g., "declare the entire unpaid balance immediately due and payable", "charge a late fee of [Amount]"].

6.  REPRESENTATIONS AND WARRANTIES. Both parties make certain representations and warranties to each other as set forth in detail in the full agreement.

7.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Loan Agreement as of the date first written above.

[Lender Signature Block]
[Lender Printed Name]
[Lender Title]

[Borrower Signature Block]
[Borrower Printed Name]
[Borrower Title]
```

## Signing Guidance

Both the `lender` and `borrower` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Loan Agreement. The `loanAmount`, `currency`, `interestRate`, `repaymentScheduleSummary`, and `maturityDate` fields should accurately reflect the terms of the loan. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

