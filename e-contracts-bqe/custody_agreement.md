# E-Contract Template: Custody Agreement

## Description

This template is for a Custody Agreement, detailing custody terms for digital assets or documents. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the custody agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "CustodyAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "assetsUnderCustodyDescription", "type": "string" },
      { "name": "custodyTerm", "type": "string" },
      { "name": "custodianAddress", "type": "address" },
      { "name": "ownerAddress", "type": "address" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "CustodyAgreement",
  "message": {
    "contractType": "CustodyAgreement",
    "contractTitle": "Custody Agreement for [Assets/Documents]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "custodian", "ethereumAddress": "<CUSTODIAN_ADDRESS>", "name": "<CUSTODIAN_NAME>", "additionalInfo": "" },
      { "role": "owner", "ethereumAddress": "<OWNER_ADDRESS>", "name": "<OWNER_NAME>", "additionalInfo": "" }
    ],
    "assetsUnderCustodyDescription": "<BRIEF_DESCRIPTION_OF_ASSETS_OR_DOCUMENTS_UNDER_CUSTODY>",
    "custodyTerm": "<TERM_OF_CUSTODY_E.G._1_YEAR_INDEFINITE>",
    "custodianAddress": "<CUSTODIAN_ADDRESS>",
    "ownerAddress": "<OWNER_ADDRESS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Custody Agreement]

CUSTODY AGREEMENT

This Custody Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Custodian's Name/Company Name], with an address at [Custodian's Address] ("Custodian"),

AND

[Owner's Name/Company Name], with an address at [Owner's Address] ("Owner").

WHEREAS, the Owner desires to place certain assets/documents under the custody of the Custodian, and the Custodian agrees to hold such assets/documents in custody subject to the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  ASSETS UNDER CUSTODY. The Owner hereby delivers to the Custodian, and the Custodian hereby accepts, the following assets/documents for custody:
    [Detailed description of assets or documents, including quantities, identifiers, and any relevant digital addresses or hashes if digital assets]
    (collectively, the "Assets").

2.  CUSTODY TERM. The term of this Custody Agreement shall commence on the Effective Date and continue until [End Date or 


a specific event, e.g., "terminated by either party with 30 days written notice"].

3.  CUSTODIAN'S RESPONSIBILITIES. The Custodian shall:
    *   Safeguard the Assets with reasonable care.
    *   Maintain accurate records of the Assets.
    *   Not use, pledge, or encumber the Assets without the Owner's express written consent.
    *   Return the Assets to the Owner upon termination of this Agreement, subject to any outstanding fees.

4.  OWNER'S RESPONSIBILITIES. The Owner shall:
    *   Provide accurate and complete information regarding the Assets.
    *   Pay all agreed-upon fees for custody services.

5.  FEES. The Owner shall pay the Custodian a fee of [Fee Amount/Rate] for the custody services.

6.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Custody Agreement as of the date first written above.

[Custodian's Signature Block]
[Custodian's Printed Name]
[Custodian's Title]

[Owner's Signature Block]
[Owner's Printed Name]
[Owner's Title]
```

## Signing Guidance

Both the `custodian` and `owner` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Custody Agreement. The `assetsUnderCustodyDescription`, `custodyTerm`, `custodianAddress`, and `ownerAddress` fields should accurately reflect the terms of the custody. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

