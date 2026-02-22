# E-Contract Template: Wire Transfer Authorization

## Description

This template is for a Wire Transfer Authorization, which permits funds to be sent electronically. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full wire transfer authorization details, while the EIP-712 message will capture key verifiable metadata.

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
    "WireTransferAuthorization": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "transferAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "beneficiaryBankName", "type": "string" },
      { "name": "beneficiaryAccount", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "WireTransferAuthorization",
  "message": {
    "contractType": "WireTransferAuthorization",
    "contractTitle": "Wire Transfer Authorization for [Amount] [Currency] to [Beneficiary Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "authorizer", "ethereumAddress": "<AUTHORIZER_ADDRESS>", "name": "<AUTHORIZER_NAME>", "additionalInfo": "" },
      { "role": "beneficiary", "ethereumAddress": "<BENEFICIARY_ADDRESS>", "name": "<BENEFICIARY_NAME>", "additionalInfo": "" }
    ],
    "transferAmount": "<AMOUNT_TO_BE_TRANSFERRED>",
    "currency": "<CURRENCY_OF_TRANSFER>",
    "beneficiaryBankName": "<NAME_OF_BENEFICIARY_BANK>",
    "beneficiaryAccount": "<BENEFICIARY_ACCOUNT_NUMBER_OR_IBAN>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Wire Transfer Authorization]

WIRE TRANSFER AUTHORIZATION

Date: [Date]

TO: [Bank Name of Originator]
[Bank Address of Originator]

FROM: [Originator Name/Company Name]
[Originator Account Number]
[Originator Address]

Subject: Authorization for Wire Transfer

I/We, [Originator Name/Company Name], hereby authorize and instruct [Bank Name of Originator] to initiate a wire transfer in the amount specified below from my/our account [Originator Account Number] to the beneficiary account detailed below.

**Transfer Details:**

*   **Amount:** [Transfer Amount] [Currency]
*   **Date of Transfer:** [Date of Transfer]
*   **Purpose of Transfer:** [Brief description of the purpose, e.g., "Payment for services", "Loan repayment", "Investment"]

**Beneficiary Details:**

*   **Beneficiary Name:** [Beneficiary Name/Company Name]
*   **Beneficiary Address:** [Beneficiary Address]
*   **Beneficiary Bank Name:** [Beneficiary Bank Name]
*   **Beneficiary Bank Address:** [Beneficiary Bank Address]
*   **Beneficiary Account Number/IBAN:** [Beneficiary Account Number/IBAN]
*   **SWIFT/BIC Code:** [SWIFT/BIC Code]
*   **Routing Number/Sort Code (if applicable):** [Routing Number/Sort Code]

I/We understand that wire transfers are generally irreversible once processed. I/We confirm that all information provided above is accurate and complete, and I/We accept full responsibility for any errors or omissions.

I/We authorize [Bank Name of Originator] to debit my/our account for the transfer amount plus any applicable fees.

IN WITNESS WHEREOF, I/We have executed this Wire Transfer Authorization as of the date first written above.

[Authorizer Signature Block]
[Authorizer Printed Name]
[Authorizer Title]
```

## Signing Guidance

The `authorizer` party should sign the EIP-712 message using their Ethereum wallet to authorize the wire transfer. The `beneficiary` party may also sign to acknowledge the expected receipt of funds. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Wire Transfer Authorization. The `transferAmount`, `currency`, `beneficiaryBankName`, and `beneficiaryAccount` fields should accurately reflect the details of the transfer. Both parties (or at least the authorizer) details are crucial for verification and should be accurately represented in the `parties` array.

