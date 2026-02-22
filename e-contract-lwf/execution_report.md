# E-Contract Template: Execution Report

## Description

This template is for an Execution Report, which confirms the completion of a transaction. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full details of the execution report, while the EIP-712 message will capture key verifiable metadata.

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
    "ExecutionReport": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "transactionId", "type": "string" },
      { "name": "transactionType", "type": "string" },
      { "name": "executionTimestamp", "type": "uint256" },
      { "name": "status", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "ExecutionReport",
  "message": {
    "contractType": "ExecutionReport",
    "contractTitle": "Execution Report for Transaction [Transaction ID]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "reporter", "ethereumAddress": "<REPORTER_ADDRESS>", "name": "<REPORTER_NAME>", "additionalInfo": "" },
      { "role": "transactingParty1", "ethereumAddress": "<TRANSACTING_PARTY_1_ADDRESS>", "name": "<TRANSACTING_PARTY_1_NAME>", "additionalInfo": "" },
      { "role": "transactingParty2", "ethereumAddress": "<TRANSACTING_PARTY_2_ADDRESS>", "name": "<TRANSACTING_PARTY_2_NAME>", "additionalInfo": "" }
    ],
    "transactionId": "<UNIQUE_TRANSACTION_IDENTIFIER>",
    "transactionType": "<TYPE_OF_TRANSACTION_E.G._SALE_PURCHASE_LOAN>",
    "executionTimestamp": "<UNIX_TIMESTAMP_OF_TRANSACTION_EXECUTION>",
    "status": "<STATUS_OF_TRANSACTION_E.G._COMPLETED_SUCCESSFUL_FAILED>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Execution Report]

EXECUTION REPORT

This Execution Report is issued on [Date],

BY:

[Reporter Name/Company Name], with an address at [Reporter Address] (hereinafter referred to as the "Reporter"),

REGARDING:

Transaction ID: [Unique Transaction Identifier]
Transaction Type: [Type of Transaction, e.g., Sale, Purchase, Loan, Asset Transfer]
Execution Timestamp: [Date and Time of Transaction Execution]

This report confirms the successful completion of the aforementioned transaction, details of which are as follows:

1.  PARTIES INVOLVED:
    *   Party 1: [Name of Transacting Party 1] (Ethereum Address: [Ethereum Address of Party 1])
    *   Party 2: [Name of Transacting Party 2] (Ethereum Address: [Ethereum Address of Party 2])
    [Add more parties as necessary]

2.  TRANSACTION DETAILS:
    [Provide a detailed description of the transaction, including:
    - Assets exchanged (if any)
    - Amounts involved (if any)
    - Specific terms or conditions met
    - Any relevant external references or hashes]

3.  STATUS OF EXECUTION:
    The transaction has been [Status, e.g., "successfully completed", "executed without issues", "failed due to [reason]"] as of the Execution Timestamp.

4.  EVIDENCE OF EXECUTION (if applicable):
    [Reference to on-chain transaction hashes, external system logs, or other verifiable evidence of execution.]

This report serves as a formal record of the transaction's execution and its outcome.

IN WITNESS WHEREOF, the Reporter has executed this Execution Report as of the date first written above.

[Reporter Signature Block]
[Reporter Printed Name]
[Reporter Title]
```

## Signing Guidance

The `reporter` party (the entity issuing the report, which could be one of the transacting parties, a platform, or an auditor) should sign the EIP-712 message using their Ethereum wallet. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Execution Report. The `transactionId`, `transactionType`, `executionTimestamp`, and `status` fields should accurately reflect the details of the transaction. The details of all transacting parties are included for context and verification in the `parties` array.

