# E-Contract Template: Mutual NDA (Non-Disclosure Agreement)

## Description

This template is for a Mutual NDA (Non-Disclosure Agreement), which protects confidential information exchanged between two parties. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the NDA, while the EIP-712 message will capture key verifiable metadata.

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
    "MutualNDA": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "purpose", "type": "string" },
      { "name": "confidentialInformationSummary", "type": "string" },
      { "name": "termInDays", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "MutualNDA",
  "message": {
    "contractType": "MutualNDA",
    "contractTitle": "Mutual Non-Disclosure Agreement",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "disclosingParty1", "ethereumAddress": "<PARTY1_ADDRESS>", "name": "<PARTY1_NAME>", "additionalInfo": "" },
      { "role": "disclosingParty2", "ethereumAddress": "<PARTY2_ADDRESS>", "name": "<PARTY2_NAME>", "additionalInfo": "" }
    ],
    "purpose": "<PURPOSE_OF_NDA_E.G._POTENTIAL_BUSINESS_RELATIONSHIP>",
    "confidentialInformationSummary": "<BRIEF_SUMMARY_OF_TYPES_OF_CONFIDENTIAL_INFORMATION>",
    "termInDays": "<NUMBER_OF_DAYS_NDA_IS_VALID>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Mutual NDA]

MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Party 1 Name/Company Name], with an address at [Party 1 Address] (hereinafter referred to as "Party 1"),

AND

[Party 2 Name/Company Name], with an address at [Party 2 Address] (hereinafter referred to as "Party 2").

WHEREAS, the parties desire to explore a potential business relationship concerning [Purpose of NDA, e.g., "the development of a new blockchain application", "a potential merger or acquisition"] (the "Purpose"), and in connection therewith, each party may disclose to the other certain confidential and proprietary information;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1.  CONFIDENTIAL INFORMATION. "Confidential Information" means any and all information disclosed by one party (the "Disclosing Party") to the other party (the "Receiving Party"), whether orally, visually, in writing, or in any other form, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. This includes, but is not limited to, [briefly describe types of confidential information, e.g., "technical data, know-how, designs, specifications, business plans, financial information, customer lists, and marketing strategies"].

2.  NON-DISCLOSURE OBLIGATION. The Receiving Party agrees to:
    *   Maintain the Confidential Information in strict confidence.
    *   Use the Confidential Information solely for the Purpose.
    *   Not disclose, reproduce, or distribute the Confidential Information to any third party without the prior written consent of the Disclosing Party.
    *   Protect the Confidential Information with at least the same degree of care as it uses to protect its own confidential information of a similar nature, but no less than reasonable care.

3.  EXCLUSIONS. The obligations of confidentiality shall not apply to information that:
    *   Is or becomes publicly available through no fault of the Receiving Party.
    *   Was rightfully known to the Receiving Party prior to its disclosure by the Disclosing Party.
    *   Is independently developed by the Receiving Party without use of or reference to the Confidential Information.
    *   Is rightfully obtained by the Receiving Party from a third party without restriction on disclosure.
    *   Is required to be disclosed by law or court order, provided the Receiving Party gives prompt notice to the Disclosing Party to allow it to seek a protective order.

4.  TERM. This Agreement shall commence on the Effective Date and continue for a period of [Number] days/months/years (the "Term"). The obligations of confidentiality shall survive the termination of this Agreement for a period of [Number] years.

5.  RETURN OF INFORMATION. Upon termination of this Agreement or upon the Disclosing Party's written request, the Receiving Party shall promptly return or destroy all Confidential Information.

6.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Mutual Non-Disclosure Agreement as of the date first written above.

[Party 1 Signature Block]
[Party 1 Printed Name]
[Party 1 Title]

[Party 2 Signature Block]
[Party 2 Printed Name]
[Party 2 Title]
```

## Signing Guidance

Both Party 1 and Party 2 should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Mutual NDA. The `purpose`, `confidentialInformationSummary`, and `termInDays` fields should accurately reflect the terms of the agreement. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

