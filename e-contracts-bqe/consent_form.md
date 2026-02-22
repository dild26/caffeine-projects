# E-Contract Template: Consent Form

## Description

This template is for a Consent Form, which obtains explicit permission from a party. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the consent, while the EIP-712 message will capture key verifiable metadata.

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
    "ConsentForm": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "consentSubject", "type": "string" },
      { "name": "consentGranted", "type": "bool" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "ConsentForm",
  "message": {
    "contractType": "ConsentForm",
    "contractTitle": "Consent Form for [Subject of Consent]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "consenter", "ethereumAddress": "<CONSENTER_ADDRESS>", "name": "<CONSENTER_NAME>", "additionalInfo": "" },
      { "role": "recipient", "ethereumAddress": "<RECIPIENT_ADDRESS>", "name": "<RECIPIENT_NAME>", "additionalInfo": "" }
    ],
    "consentSubject": "<BRIEF_DESCRIPTION_OF_WHAT_CONSENT_IS_BEING_GIVEN_FOR>",
    "consentGranted": true
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Consent Form]

CONSENT FORM

This Consent Form is made and entered into on [Date],

BY:

[Consenter's Name/Company Name], with an address at [Consenter's Address] ("Consenter").

TO:

[Recipient's Name/Company Name], with an address at [Recipient's Address] ("Recipient").

I, [Consenter's Name], hereby grant my explicit consent to [Recipient's Name/Company Name] for the following:

[Clearly and specifically describe the subject of the consent. Be as detailed as possible. Examples include:
- "the collection, processing, and storage of my personal data as outlined in the Privacy Policy dated [Date of Privacy Policy]."
- "the use of my image and likeness in promotional materials for [Project Name]."
- "the disclosure of my financial information to [Third Party Name] for the purpose of [Purpose of Disclosure]."]

I understand that:

*   This consent is given voluntarily and without coercion.
*   I have the right to withdraw this consent at any time by providing written notice to the Recipient.
*   The withdrawal of consent will not affect the lawfulness of processing based on consent before its withdrawal.

I confirm that I have read and understood the terms of this Consent Form.

IN WITNESS WHEREOF, the Consenter has executed this Consent Form as of the date first written above.

[Consenter's Signature Block]
[Consenter's Printed Name]
[Consenter's Title]
```

## Signing Guidance

The `consenter` party should sign the EIP-712 message using their Ethereum wallet. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Consent Form. The `consentSubject` and `consentGranted` fields should accurately reflect the content of the off-chain document. The `recipient` party's details are included for context and verification. This document is primarily signed by the consenter to formally grant their permission.

