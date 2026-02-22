# E-Contract Template: Deed of Assignment

## Description

This template is for a Deed of Assignment, which formalizes the transfer of ownership or rights. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the deed, while the EIP-712 message will capture key verifiable metadata.

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
    "DeedOfAssignment": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "propertyDescription", "type": "string" },
      { "name": "considerationAmount", "type": "uint256" },
      { "name": "currency", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "DeedOfAssignment",
  "message": {
    "contractType": "DeedOfAssignment",
    "contractTitle": "Deed of Assignment for [Property/Rights]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "assignor", "ethereumAddress": "<ASSIGNOR_ADDRESS>", "name": "<ASSIGNOR_NAME>", "additionalInfo": "" },
      { "role": "assignee", "ethereumAddress": "<ASSIGNEE_ADDRESS>", "name": "<ASSIGNEE_NAME>", "additionalInfo": "" }
    ],
    "propertyDescription": "<BRIEF_DESCRIPTION_OF_PROPERTY_OR_RIGHTS_BEING_ASSIGNED>",
    "considerationAmount": "<AMOUNT_OF_CONSIDERATION>",
    "currency": "<CURRENCY_OF_CONSIDERATION>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Deed of Assignment]

DEED OF ASSIGNMENT

THIS DEED OF ASSIGNMENT is made and entered into on [Date],

BETWEEN:

[Assignor Name/Company Name], with an address at [Assignor Address] (hereinafter referred to as the "Assignor"),

AND

[Assignee Name/Company Name], with an address at [Assignee Address] (hereinafter referred to as the "Assignee").

WHEREAS:

A. The Assignor is the legal and beneficial owner of [describe the property, rights, or interests being assigned, e.g., "the intellectual property rights in the software known as 'X'", "the leasehold interest in the property located at [Address]", "the benefit of the contract dated [Date] between Assignor and [Third Party Name]"] (hereinafter referred to as the "Assigned Property").

B. The Assignor desires to assign the Assigned Property to the Assignee, and the Assignee desires to accept such assignment, subject to the terms and conditions hereinafter appearing.

NOW, THIS DEED WITNESSETH as follows:

1.  ASSIGNMENT. In consideration of the sum of [Consideration Amount] [Currency] (the "Consideration") paid by the Assignee to the Assignor (the receipt and sufficiency of which the Assignor hereby acknowledges), the Assignor as beneficial owner hereby assigns and transfers unto the Assignee absolutely all its right, title, and interest in and to the Assigned Property, with effect from the Effective Date.

2.  COVENANTS. The Assignor covenants with the Assignee that it has full power and authority to assign the Assigned Property in the manner aforesaid and that the Assigned Property is free from all encumbrances save as disclosed herein.

3.  INDEMNITY. The Assignee hereby indemnifies the Assignor against all actions, claims, demands, costs, expenses, and liabilities arising from or in connection with the Assigned Property from and after the Effective Date.

4.  GOVERNING LAW. This Deed shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Deed of Assignment as of the date first above written.

SIGNED, SEALED, AND DELIVERED by the Assignor:

[Assignor's Signature Block]
[Assignor's Printed Name]
[Assignor's Title]

SIGNED, SEALED, AND DELIVERED by the Assignee:

[Assignee's Signature Block]
[Assignee's Printed Name]
[Assignee's Title]
```

## Signing Guidance

Both the `assignor` and `assignee` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Deed of Assignment. The `propertyDescription`, `considerationAmount`, and `currency` fields should accurately reflect the terms of the assignment. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

