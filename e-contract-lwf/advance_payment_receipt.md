# E-Contract Template: Advance Payment Receipt

## Description

This template is for an Advance Payment Receipt, which acknowledges receipt of advance payments. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full receipt details, while the EIP-712 message will capture key verifiable metadata.

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
    "AdvancePaymentReceipt": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "amountReceived", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "paymentPurpose", "type": "string" },
      { "name": "referenceId", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "AdvancePaymentReceipt",
  "message": {
    "contractType": "AdvancePaymentReceipt",
    "contractTitle": "Advance Payment Receipt for [Amount] [Currency]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "payer", "ethereumAddress": "<PAYER_ADDRESS>", "name": "<PAYER_NAME>", "additionalInfo": "" },
      { "role": "payee", "ethereumAddress": "<PAYEE_ADDRESS>", "name": "<PAYEE_NAME>", "additionalInfo": "" }
    ],
    "amountReceived": "<AMOUNT_OF_ADVANCE_PAYMENT>",
    "currency": "<CURRENCY_OF_PAYMENT>",
    "paymentPurpose": "<BRIEF_PURPOSE_OF_THE_ADVANCE_PAYMENT>",
    "referenceId": "<REFERENCE_ID_FOR_ASSOCIATED_TRANSACTION_OR_AGREEMENT>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Advance Payment Receipt]

ADVANCE PAYMENT RECEIPT

Date: [Date]

Receipt No: [Unique Receipt Number]

Received From: [Payer Name/Company Name]
[Payer Address]

Received By: [Payee Name/Company Name]
[Payee Address]

**Amount Received:** [Amount Received] [Currency]

**Payment Method:** [Payment Method, e.g., "Bank Transfer", "Credit Card", "Cryptocurrency"]

**Purpose of Payment:** [Detailed purpose of the advance payment, e.g., "Advance for services under Agreement dated [Date]", "Deposit for purchase of [Item]", "Partial payment for Project [Project Name]"]

**Reference ID (if applicable):** [Reference ID for associated transaction or agreement]

**Remaining Balance (if any):** [Remaining Balance] [Currency]

This receipt acknowledges the advance payment received on the date mentioned above for the stated purpose. This payment will be applied towards the total amount due for the [Service/Product/Agreement] as per our understanding.

IN WITNESS WHEREOF, the Payee has executed this Advance Payment Receipt as of the date first written above.

[Payee Signature Block]
[Payee Printed Name]
[Payee Title]
```

## Signing Guidance

The `payee` party (the recipient of the advance payment) should sign the EIP-712 message using their Ethereum wallet to acknowledge receipt. The `payer` party may also sign to acknowledge the payment. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Advance Payment Receipt. The `amountReceived`, `currency`, `paymentPurpose`, and `referenceId` fields should accurately reflect the details of the payment. Both parties (or at least the payee) details are crucial for verification and should be accurately represented in the `parties` array.

