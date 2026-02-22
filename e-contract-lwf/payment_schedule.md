# E-Contract Template: Payment Schedule

## Description

This template is for a Payment Schedule, which details due dates and amounts for repayment. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full payment schedule, while the EIP-712 message will capture key verifiable metadata.

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
    "PaymentSchedule": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "totalAmountDue", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "numberOfPayments", "type": "uint256" },
      { "name": "firstPaymentDate", "type": "uint256" },
      { "name": "lastPaymentDate", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "PaymentSchedule",
  "message": {
    "contractType": "PaymentSchedule",
    "contractTitle": "Payment Schedule for [Agreement/Loan ID]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "payer", "ethereumAddress": "<PAYER_ADDRESS>", "name": "<PAYER_NAME>", "additionalInfo": "" },
      { "role": "payee", "ethereumAddress": "<PAYEE_ADDRESS>", "name": "<PAYEE_NAME>", "additionalInfo": "" }
    ],
    "totalAmountDue": "<TOTAL_AMOUNT_TO_BE_PAID>",
    "currency": "<CURRENCY_OF_PAYMENTS>",
    "numberOfPayments": "<TOTAL_NUMBER_OF_INSTALLMENTS>",
    "firstPaymentDate": "<UNIX_TIMESTAMP_OF_FIRST_PAYMENT>",
    "lastPaymentDate": "<UNIX_TIMESTAMP_OF_LAST_PAYMENT>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Payment Schedule]

PAYMENT SCHEDULE

This Payment Schedule is attached to and forms an integral part of the [Reference Agreement Name, e.g., "Loan Agreement", "Service Agreement"] dated [Date of Reference Agreement] (the "Reference Agreement").

**Parties Involved:**

*   **Payer:** [Payer Name/Company Name] (Ethereum Address: [Payer Ethereum Address])
*   **Payee:** [Payee Name/Company Name] (Ethereum Address: [Payee Ethereum Address])

**Total Amount Due:** [Total Amount Due] [Currency]

**Payment Terms:**

All payments shall be made in [Currency] to the Payee at [Payee's Payment Details/Ethereum Address] on or before the respective due dates.

**Payment Breakdown:**

| Payment Number | Due Date (DD/MM/YYYY) | Amount Due ([Currency]) | Notes (e.g., Principal, Interest, Fee) |
| :------------- | :-------------------- | :---------------------- | :------------------------------------- |
| 1              | [Date 1]              | [Amount 1]              | [Note 1]                               |
| 2              | [Date 2]              | [Amount 2]              | [Note 2]                               |
| ...            | ...                   | ...                     | ...                                    |
| [Last Payment #] | [Last Date]           | [Last Amount]           | [Last Note]                            |

**Important Notes:**

*   Any late payments may be subject to penalties as outlined in the Reference Agreement.
*   This Payment Schedule may be amended only by written agreement of both parties.

IN WITNESS WHEREOF, the parties have executed this Payment Schedule as of the Effective Date.

[Payer Signature Block]
[Payer Printed Name]
[Payer Title]

[Payee Signature Block]
[Payee Printed Name]
[Payee Title]
```

## Signing Guidance

Both the `payer` and `payee` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Payment Schedule. The `totalAmountDue`, `currency`, `numberOfPayments`, `firstPaymentDate`, and `lastPaymentDate` fields should accurately reflect the terms of the payment schedule. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

