# E-Contract Template: Engagement Letter

## Description

This template is for an Engagement Letter, which describes services, roles, or intentions of parties. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the engagement letter, while the EIP-712 message will capture key verifiable metadata.

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
    "EngagementLetter": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "serviceDescriptionSummary", "type": "string" },
      { "name": "feeStructureSummary", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "EngagementLetter",
  "message": {
    "contractType": "EngagementLetter",
    "contractTitle": "Engagement Letter for [Service/Project Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "serviceProvider", "ethereumAddress": "<SERVICE_PROVIDER_ADDRESS>", "name": "<SERVICE_PROVIDER_NAME>", "additionalInfo": "" },
      { "role": "client", "ethereumAddress": "<CLIENT_ADDRESS>", "name": "<CLIENT_NAME>", "additionalInfo": "" }
    ],
    "serviceDescriptionSummary": "<BRIEF_SUMMARY_OF_SERVICES_OR_PROJECT_SCOPE>",
    "feeStructureSummary": "<BRIEF_SUMMARY_OF_FEE_STRUCTURE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Engagement Letter]

ENGAGEMENT LETTER

[Date]

[Client Name/Company Name]
[Client Address]

Subject: Engagement for [Service/Project Name]

Dear [Client Name],

This letter confirms the terms of our engagement regarding [briefly describe the service or project]. We are pleased to offer our services to you on the following terms and conditions:

1.  SERVICES. We will provide the following services:
    [Detailed description of services to be provided, including scope, deliverables, and timelines. Examples:
    - "Consulting services for blockchain integration, including initial assessment, system design, and implementation support."
    - "Development of a decentralized application (DApp) as per the attached Statement of Work."]

2.  OUR RESPONSIBILITIES. We will [list responsibilities, e.g., "dedicate qualified personnel", "perform services in a professional manner"].

3.  YOUR RESPONSIBILITIES. You will [list responsibilities, e.g., "provide timely access to necessary information and personnel", "make timely payments"].

4.  FEES AND PAYMENT TERMS. Our fees for these services will be [describe fee structure, e.g., "[Amount] per hour", "a fixed fee of [Amount]", "[Percentage] of project value"]. Invoices will be issued [frequency, e.g., "monthly", "upon completion of milestones"] and are due within [Number] days of receipt.

5.  TERM AND TERMINATION. This engagement will commence on the Effective Date and continue until [End Date or event, e.g., "completion of the project", "terminated by either party with [Number] days written notice"].

6.  CONFIDENTIALITY. Both parties agree to maintain the confidentiality of all proprietary and confidential information exchanged during this engagement.

7.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

If these terms are acceptable, please sign and return a copy of this letter.

Sincerely,

[Service Provider Signature Block]
[Service Provider Printed Name]
[Service Provider Title]

ACCEPTED AND AGREED:

[Client Signature Block]
[Client Printed Name]
[Client Title]
```

## Signing Guidance

Both the `serviceProvider` and `client` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Engagement Letter. The `serviceDescriptionSummary` and `feeStructureSummary` fields should accurately reflect the content of the off-chain document. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

