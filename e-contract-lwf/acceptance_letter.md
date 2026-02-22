# E-Contract Template: Acceptance Letter

## Description

This template is for an Acceptance Letter, confirming consent to terms or offers. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the acceptance, while the EIP-712 message will capture key verifiable metadata.

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
    "AcceptanceLetter": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "offerReference", "type": "string" },
      { "name": "acceptedTermsSummary", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "AcceptanceLetter",
  "message": {
    "contractType": "AcceptanceLetter",
    "contractTitle": "Acceptance Letter for [Offer Name/Reference]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "acceptor", "ethereumAddress": "<ACCEPTOR_ADDRESS>", "name": "<ACCEPTOR_NAME>", "additionalInfo": "" },
      { "role": "offerer", "ethereumAddress": "<OFFERER_ADDRESS>", "name": "<OFFERER_NAME>", "additionalInfo": "" }
    ],
    "offerReference": "<REFERENCE_TO_OFFER_DOCUMENT_OR_ID>",
    "acceptedTermsSummary": "<BRIEF_SUMMARY_OF_ACCEPTED_TERMS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Acceptance Letter]

[Date]

[Acceptor's Name/Company Name]
[Acceptor's Address]

Subject: Acceptance of Offer - [Offer Name/Reference]

Dear [Offerer's Name/Company Name],

This letter serves as formal acceptance of the offer extended to [Acceptor's Name/Company Name] on [Date of Offer], regarding [brief description of the offer].

We hereby confirm our full agreement to all terms and conditions as outlined in the aforementioned offer document, including but not limited to:

1.  [Specific Term 1]
2.  [Specific Term 2]
3.  [Specific Term 3]

We understand and agree that this acceptance constitutes a legally binding agreement between the parties involved.

We look forward to proceeding with [next steps].

Sincerely,

[Acceptor's Signature Block]
[Acceptor's Printed Name]
[Acceptor's Title]
```

## Signing Guidance

The `acceptor` party should sign the EIP-712 message using their Ethereum wallet. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Acceptance Letter. The `offerReference` and `acceptedTermsSummary` fields should accurately reflect the content of the off-chain document. The `offerer` party's details are included for context and verification, but they are not necessarily required to sign this specific document, unless the acceptance itself requires a counter-signature to be valid.

