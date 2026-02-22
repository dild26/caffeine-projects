# E-Contract Template: Notification of Assignment

## Description

This template is for a Notification of Assignment, which informs third parties of a rights transfer. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the notification, while the EIP-712 message will capture key verifiable metadata.

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
    "NotificationOfAssignment": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "assignedRightsDescription", "type": "string" },
      { "name": "originalAssignorAddress", "type": "address" },
      { "name": "newAssigneeAddress", "type": "address" },
      { "name": "notifiedPartyAddress", "type": "address" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "NotificationOfAssignment",
  "message": {
    "contractType": "NotificationOfAssignment",
    "contractTitle": "Notification of Assignment for [Rights/Interests]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "assignor", "ethereumAddress": "<ASSIGNOR_ADDRESS>", "name": "<ASSIGNOR_NAME>", "additionalInfo": "" },
      { "role": "assignee", "ethereumAddress": "<ASSIGNEE_ADDRESS>", "name": "<ASSIGNEE_NAME>", "additionalInfo": "" },
      { "role": "notifiedParty", "ethereumAddress": "<NOTIFIED_PARTY_ADDRESS>", "name": "<NOTIFIED_PARTY_NAME>", "additionalInfo": "" }
    ],
    "assignedRightsDescription": "<BRIEF_DESCRIPTION_OF_RIGHTS_OR_INTERESTS_BEING_ASSIGNED>",
    "originalAssignorAddress": "<ORIGINAL_ASSIGNOR_ADDRESS>",
    "newAssigneeAddress": "<NEW_ASSIGNEE_ADDRESS>",
    "notifiedPartyAddress": "<NOTIFIED_PARTY_ADDRESS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Notification of Assignment]

NOTIFICATION OF ASSIGNMENT

[Date]

[Notified Party Name/Company Name]
[Notified Party Address]

Subject: Notification of Assignment of [Rights/Interests]

Dear [Notified Party Name],

This letter serves as formal notification that, effective as of [Effective Date of Assignment], the rights and interests described below have been assigned from [Original Assignor Name/Company Name] (the "Original Assignor") to [New Assignee Name/Company Name] (the "New Assignee").

**Details of Assignment:**

1.  **Assigned Rights/Interests:** [Clearly and specifically describe the rights or interests that have been assigned. This should match the description in the underlying Assignment Agreement. Examples: "all rights and obligations under the contract dated [Date] for [brief description of contract]", "the right to receive payments from [Source]", "the intellectual property rights for [Specific IP]"]

2.  **Original Assignor:**
    Name: [Original Assignor Name/Company Name]
    Ethereum Address: [Original Assignor Ethereum Address]

3.  **New Assignee:**
    Name: [New Assignee Name/Company Name]
    Ethereum Address: [New Assignee Ethereum Address]

4.  **Effective Date of Assignment:** [Effective Date of Assignment]

**Impact on Notified Party:**

From the Effective Date of Assignment, all future communications, payments, or obligations related to the Assigned Rights/Interests should be directed to the New Assignee. The Original Assignor will no longer be the party to whom such matters should be addressed.

[Include any specific instructions or changes required from the Notified Party, e.g., "Please update your records accordingly.", "All future payments should be made to the New Assignee at [New Assignee's Payment Details]."]

We have attached a copy of the Assignment Agreement for your reference. Please acknowledge receipt of this notification by signing and returning the enclosed copy.

Sincerely,

[Assignor/Assignee Signature Block (the party sending the notification)]
[Assignor/Assignee Printed Name]
[Assignor/Assignee Title]

ACKNOWLEDGMENT OF RECEIPT:

I/We, [Notified Party Name], hereby acknowledge receipt of this Notification of Assignment on [Date of Acknowledgment].

[Notified Party Signature Block]
[Notified Party Printed Name]
[Notified Party Title]
```

## Signing Guidance

The party issuing the notification (typically the `assignor` or `assignee`, or both) should sign the EIP-712 message using their Ethereum wallet. The `notifiedParty` should also sign to acknowledge receipt of the notification. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Notification of Assignment. The `assignedRightsDescription`, `originalAssignorAddress`, `newAssigneeAddress`, and `notifiedPartyAddress` fields should accurately reflect the details of the assignment and the parties involved. All relevant parties' details are crucial for verification and should be accurately represented in the `parties` array.

