# E-Contract Template: Waiver Agreement

## Description

This template is for a Waiver Agreement, which waives a right or condition. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the waiver agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "WaiverAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "waivedRightDescription", "type": "string" },
      { "name": "reasonForWaiver", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "WaiverAgreement",
  "message": {
    "contractType": "WaiverAgreement",
    "contractTitle": "Waiver Agreement for [Waived Right]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "waivingParty", "ethereumAddress": "<WAIVING_PARTY_ADDRESS>", "name": "<WAIVING_PARTY_NAME>", "additionalInfo": "" },
      { "role": "beneficiaryParty", "ethereumAddress": "<BENEFICIARY_PARTY_ADDRESS>", "name": "<BENEFICIARY_PARTY_NAME>", "additionalInfo": "" }
    ],
    "waivedRightDescription": "<BRIEF_DESCRIPTION_OF_THE_RIGHT_OR_CONDITION_BEING_WAIVED>",
    "reasonForWaiver": "<BRIEF_REASON_FOR_THE_WAIVER>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Waiver Agreement]

WAIVER AGREEMENT

This Waiver Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Waiving Party Name/Company Name], with an address at [Waiving Party Address] (hereinafter referred to as the "Waiving Party"),

AND

[Beneficiary Party Name/Company Name], with an address at [Beneficiary Party Address] (hereinafter referred to as the "Beneficiary Party").

WHEREAS:

A. The Waiving Party possesses certain rights or conditions under [Reference Agreement Name, e.g., "Loan Agreement dated [Date]", "Service Contract dated [Date]"] (the "Original Agreement").

B. The Beneficiary Party has requested, and the Waiving Party has agreed, to waive certain of these rights or conditions.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1.  WAIVER. The Waiving Party hereby irrevocably waives the following right(s) or condition(s) under the Original Agreement:
    [Clearly and specifically describe the right(s) or condition(s) being waived. Examples:
    *   "The right to receive payment on [Original Due Date] for Invoice #[Invoice Number], extending the due date to [New Due Date]."
    *   "The condition precedent requiring [Specific Condition] to be met before [Action]."
    *   "Any claim for breach of contract arising from [Specific Event] that occurred on or about [Date of Event]."]

2.  REASON FOR WAIVER. This waiver is granted for the following reason(s):
    [Briefly explain the reason for the waiver, e.g., "to facilitate the completion of the project", "due to unforeseen circumstances", "as a gesture of goodwill"].

3.  NO OTHER WAIVER. Except as expressly provided herein, all other terms and conditions of the Original Agreement shall remain in full force and effect.

4.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Waiver Agreement as of the date first written above.

[Waiving Party Signature Block]
[Waiving Party Printed Name]
[Waiving Party Title]

[Beneficiary Party Signature Block]
[Beneficiary Party Printed Name]
[Beneficiary Party Title]
```

## Signing Guidance

Both the `waivingParty` and `beneficiaryParty` should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Waiver Agreement. The `waivedRightDescription` and `reasonForWaiver` fields should accurately reflect the terms of the waiver. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

