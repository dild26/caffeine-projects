# E-Contract Template: Fee Agreement

## Description

This template is for a Fee Agreement, which specifies costs or service fees. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the fee agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "FeeAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "serviceDescription", "type": "string" },
      { "name": "feeAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "paymentTermsSummary", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "FeeAgreement",
  "message": {
    "contractType": "FeeAgreement",
    "contractTitle": "Fee Agreement for [Service/Project]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "serviceProvider", "ethereumAddress": "<SERVICE_PROVIDER_ADDRESS>", "name": "<SERVICE_PROVIDER_NAME>", "additionalInfo": "" },
      { "role": "client", "ethereumAddress": "<CLIENT_ADDRESS>", "name": "<CLIENT_NAME>", "additionalInfo": "" }
    ],
    "serviceDescription": "<BRIEF_DESCRIPTION_OF_SERVICE_OR_PROJECT>",
    "feeAmount": "<TOTAL_FEE_AMOUNT>",
    "currency": "<CURRENCY_OF_FEE>",
    "paymentTermsSummary": "<SUMMARY_OF_PAYMENT_TERMS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Fee Agreement]

FEE AGREEMENT

This Fee Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Service Provider Name/Company Name], with an address at [Service Provider Address] (hereinafter referred to as the "Service Provider"),

AND

[Client Name/Company Name], with an address at [Client Address] (hereinafter referred to as the "Client").

WHEREAS, the Client desires to engage the Service Provider for certain services, and the Service Provider agrees to provide such services for the fees and on the terms set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  SERVICES. The Service Provider agrees to provide the Client with the following services:
    [Detailed description of the services for which fees are being charged]

2.  FEES. The Client agrees to pay the Service Provider the following fees for the services:
    *   Total Fee: [Fee Amount] [Currency]
    *   [Breakdown of fees, e.g., hourly rate, fixed fee, retainer, success fee]

3.  PAYMENT TERMS. Payments shall be made by the Client to the Service Provider according to the following schedule:
    [Detailed payment schedule, e.g., "[Percentage]% upfront, [Percentage]% upon milestone completion, remaining balance upon project completion", "monthly on the [Day] of each month"]

4.  EXPENSES. [Specify if expenses are reimbursable and how, e.g., "Client shall reimburse Service Provider for all reasonable and necessary out-of-pocket expenses incurred in connection with the services, provided such expenses are pre-approved by Client."]

5.  INVOICING. Invoices will be issued [frequency, e.g., "monthly", "upon completion of milestones"] and are due within [Number] days of receipt.

6.  TERM. This Agreement shall commence on the Effective Date and continue until [End Date or event, e.g., "completion of services", "terminated by either party with [Number] days written notice"].

7.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Fee Agreement as of the date first written above.

[Service Provider Signature Block]
[Service Provider Printed Name]
[Service Provider Title]

[Client Signature Block]
[Client Printed Name]
[Client Title]
```

## Signing Guidance

Both the `serviceProvider` and `client` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Fee Agreement. The `serviceDescription`, `feeAmount`, `currency`, and `paymentTermsSummary` fields should accurately reflect the terms of the agreement. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

