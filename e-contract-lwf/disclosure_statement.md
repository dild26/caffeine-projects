# E-Contract Template: Disclosure Statement

## Description

This template is for a Disclosure Statement, which discloses risks, terms, or conflicts. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the disclosure, while the EIP-712 message will capture key verifiable metadata.

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
    "DisclosureStatement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "disclosureSubject", "type": "string" },
      { "name": "risksDisclosedSummary", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "DisclosureStatement",
  "message": {
    "contractType": "DisclosureStatement",
    "contractTitle": "Disclosure Statement for [Subject]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "discloser", "ethereumAddress": "<DISCLOSER_ADDRESS>", "name": "<DISCLOSER_NAME>", "additionalInfo": "" },
      { "role": "recipient", "ethereumAddress": "<RECIPIENT_ADDRESS>", "name": "<RECIPIENT_NAME>", "additionalInfo": "" }
    ],
    "disclosureSubject": "<BRIEF_DESCRIPTION_OF_WHAT_IS_BEING_DISCLOSED>",
    "risksDisclosedSummary": "<SUMMARY_OF_KEY_RISKS_TERMS_OR_CONFLICTS_DISCLOSED>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Disclosure Statement]

DISCLOSURE STATEMENT

This Disclosure Statement is made and entered into on [Date],

BY:

[Discloser Name/Company Name], with an address at [Discloser Address] (hereinafter referred to as the "Discloser"),

TO:

[Recipient Name/Company Name], with an address at [Recipient Address] (hereinafter referred to as the "Recipient").

Subject: Disclosure Regarding [Subject of Disclosure]

This statement is provided to inform the Recipient of certain material facts, risks, terms, or potential conflicts of interest related to [briefly describe the context, e.g., "the investment opportunity", "the services provided", "the transaction"]: 

[Detailed description of the disclosure. This section should be comprehensive and clearly outline all relevant information. Examples include:

*   **Risks:** "The investment involves significant risks, including but not limited to, market volatility, loss of principal, and illiquidity. Past performance is not indicative of future results."
*   **Terms:** "The terms of the agreement include a non-refundable setup fee of [Amount] and a monthly service charge of [Amount]."
*   **Conflicts of Interest:** "The Discloser or its affiliates may have a financial interest in the transaction or may provide services to other parties involved in the transaction."
*   **Material Facts:** "The property is subject to an easement for utility access, which may impact future development."]

The Recipient acknowledges that they have received, read, and understood the information contained in this Disclosure Statement. The Recipient further acknowledges that they have had the opportunity to seek independent legal and financial advice regarding the contents of this statement.

IN WITNESS WHEREOF, the Discloser has executed this Disclosure Statement as of the date first written above.

[Discloser Signature Block]
[Discloser Printed Name]
[Discloser Title]

ACKNOWLEDGMENT OF RECEIPT AND UNDERSTANDING BY RECIPIENT:

[Recipient Signature Block]
[Recipient Printed Name]
[Recipient Title]
```

## Signing Guidance

The `discloser` party should sign the EIP-712 message using their Ethereum wallet to attest to the accuracy and completeness of the disclosure. The `recipient` party should also sign to acknowledge receipt and understanding of the disclosed information. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Disclosure Statement. The `disclosureSubject` and `risksDisclosedSummary` fields should accurately reflect the content of the off-chain document. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

