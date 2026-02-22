# E-Contract Template: Amendment Agreement

## Description

This template is for an Amendment Agreement, which alters specific provisions of an existing contract. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the amendment, while the EIP-712 message will capture key verifiable metadata.

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
    "AmendmentAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "originalAgreementTitle", "type": "string" },
      { "name": "originalAgreementDate", "type": "uint256" },
      { "name": "amendedSectionSummary", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "AmendmentAgreement",
  "message": {
    "contractType": "AmendmentAgreement",
    "contractTitle": "Amendment to [Original Agreement Title]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "party1", "ethereumAddress": "<PARTY1_ADDRESS>", "name": "<PARTY1_NAME>", "additionalInfo": "" },
      { "role": "party2", "ethereumAddress": "<PARTY2_ADDRESS>", "name": "<PARTY2_NAME>", "additionalInfo": "" }
    ],
    "originalAgreementTitle": "<TITLE_OF_ORIGINAL_AGREEMENT>",
    "originalAgreementDate": "<UNIX_TIMESTAMP_OF_ORIGINAL_AGREEMENT_DATE>",
    "amendedSectionSummary": "<BRIEF_SUMMARY_OF_SECTIONS_AMENDED>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Amendment Agreement]

AMENDMENT AGREEMENT

This Amendment Agreement ("Amendment") is made and entered into on [Date],

BETWEEN:

[Party 1 Name/Company Name], with an address at [Party 1 Address] (hereinafter referred to as "Party 1"),

AND

[Party 2 Name/Company Name], with an address at [Party 2 Address] (hereinafter referred to as "Party 2").

WHEREAS:

A. The parties previously entered into an agreement titled [Original Agreement Title] dated [Original Agreement Date] (the "Original Agreement").

B. The parties now desire to amend certain provisions of the Original Agreement as set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1.  AMENDMENTS. The Original Agreement is hereby amended as follows:
    [Clearly and specifically detail each amendment. Be precise with section numbers, clauses, or new paragraphs. Examples:

    *   **Amendment to Section X:** Section [X] of the Original Agreement is hereby amended to read as follows:
        "[New text for Section X]"

    *   **Deletion of Section Y:** Section [Y] of the Original Agreement is hereby deleted in its entirety.

    *   **Modification to Clause A:** Clause [A] of Section [B] of the Original Agreement is hereby modified by changing "[Old Text]" to "[New Text]".]

2.  EFFECTIVE DATE. This Amendment shall be effective as of [Effective Date].

3.  CONTINUING EFFECT. Except as expressly amended by this Amendment, all other terms and conditions of the Original Agreement shall remain in full force and effect.

4.  GOVERNING LAW. This Amendment shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Amendment Agreement as of the date first written above.

[Party 1 Signature Block]
[Party 1 Printed Name]
[Party 1 Title]

[Party 2 Signature Block]
[Party 2 Printed Name]
[Party 2 Title]
```

## Signing Guidance

All parties to the original agreement should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Amendment Agreement. The `originalAgreementTitle`, `originalAgreementDate`, and `amendedSectionSummary` fields should accurately reflect the changes being made. All parties' details are crucial for verification and should be accurately represented in the `parties` array.

