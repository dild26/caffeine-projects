# E-Contract Template: Assignment Agreement

## Description

This template is for an Assignment Agreement, which transfers rights or interests from one party to another. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the assignment, while the EIP-712 message will capture key verifiable metadata.

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
    "AssignmentAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "assignedRightsDescription", "type": "string" },
      { "name": "originalAgreementReference", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "AssignmentAgreement",
  "message": {
    "contractType": "AssignmentAgreement",
    "contractTitle": "Assignment Agreement for [Rights/Interests]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "assignor", "ethereumAddress": "<ASSIGNOR_ADDRESS>", "name": "<ASSIGNOR_NAME>", "additionalInfo": "" },
      { "role": "assignee", "ethereumAddress": "<ASSIGNEE_ADDRESS>", "name": "<ASSIGNEE_NAME>", "additionalInfo": "" }
    ],
    "assignedRightsDescription": "<BRIEF_DESCRIPTION_OF_RIGHTS_OR_INTERESTS_BEING_ASSIGNED>",
    "originalAgreementReference": "<REFERENCE_TO_ORIGINAL_AGREEMENT_IF_APPLICABLE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Assignment Agreement]

ASSIGNMENT AGREEMENT

This Assignment Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Assignor's Name/Company Name], with an address at [Assignor's Address] ("Assignor"),

AND

[Assignee's Name/Company Name], with an address at [Assignee's Address] ("Assignee").

WHEREAS, Assignor is the owner of certain rights and interests as described herein;

WHEREAS, Assignor desires to assign, and Assignee desires to accept the assignment of, such rights and interests;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  ASSIGNMENT. Assignor hereby assigns, transfers, and conveys to Assignee all of Assignor's right, title, and interest in and to [specifically describe the rights or interests being assigned, e.g., "the contract dated [Date] between Assignor and [Third Party Name] for the provision of services"] (the "Assigned Rights").

2.  EFFECTIVE DATE. This Assignment shall be effective as of the Effective Date specified above.

3.  CONSIDERATION. In consideration for this Assignment, Assignee shall [describe consideration, e.g., "pay Assignor the sum of [Amount] on or before [Date]".]

4.  REPRESENTATIONS AND WARRANTIES. Assignor represents and warrants that [e.g., "it has the full right and authority to assign the Assigned Rights and that the Assigned Rights are free and clear of any liens, encumbrances, or adverse claims."]

5.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Assignment Agreement as of the date first written above.

[Assignor's Signature Block]
[Assignor's Printed Name]
[Assignor's Title]

[Assignee's Signature Block]
[Assignee's Printed Name]
[Assignee's Title]
```

## Signing Guidance

Both the `assignor` and `assignee` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Assignment Agreement. The `assignedRightsDescription` and `originalAgreementReference` fields should accurately reflect the content of the off-chain document. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

