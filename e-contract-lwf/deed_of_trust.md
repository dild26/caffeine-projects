# E-Contract Template: Deed of Trust

## Description

This template is for a Deed of Trust, which holds property or rights in trust for a third party. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the deed of trust, while the EIP-712 message will capture key verifiable metadata.

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
    "DeedOfTrust": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "trustPropertyDescription", "type": "string" },
      { "name": "beneficiaryName", "type": "string" },
      { "name": "trusteeName", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "DeedOfTrust",
  "message": {
    "contractType": "DeedOfTrust",
    "contractTitle": "Deed of Trust for [Property/Rights]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "settlor", "ethereumAddress": "<SETTLOR_ADDRESS>", "name": "<SETTLOR_NAME>", "additionalInfo": "" },
      { "role": "trustee", "ethereumAddress": "<TRUSTEE_ADDRESS>", "name": "<TRUSTEE_NAME>", "additionalInfo": "" },
      { "role": "beneficiary", "ethereumAddress": "<BENEFICIARY_ADDRESS>", "name": "<BENEFICIARY_NAME>", "additionalInfo": "" }
    ],
    "trustPropertyDescription": "<BRIEF_DESCRIPTION_OF_PROPERTY_OR_RIGHTS_HELD_IN_TRUST>",
    "beneficiaryName": "<BENEFICIARY_FULL_NAME_OR_ENTITY_NAME>",
    "trusteeName": "<TRUSTEE_FULL_NAME_OR_ENTITY_NAME>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Deed of Trust]

DEED OF TRUST

THIS DEED OF TRUST is made and entered into on [Date],

BETWEEN:

[Settlor Name/Company Name], with an address at [Settlor Address] (hereinafter referred to as the "Settlor"),

AND

[Trustee Name/Company Name], with an address at [Trustee Address] (hereinafter referred to as the "Trustee"),

FOR THE BENEFIT OF:

[Beneficiary Name/Company Name], with an address at [Beneficiary Address] (hereinafter referred to as the "Beneficiary").

WHEREAS:

A. The Settlor is the legal and beneficial owner of certain property/rights as described herein (the "Trust Property").

B. The Settlor desires to convey the Trust Property to the Trustee, to be held in trust for the benefit of the Beneficiary, subject to the terms and conditions hereinafter appearing.

NOW, THIS DEED WITNESSETH as follows:

1.  CONVEYANCE IN TRUST. The Settlor hereby grants, bargains, sells, and conveys unto the Trustee, its successors and assigns, the Trust Property, to have and to hold the same in trust for the uses and purposes hereinafter set forth.

2.  TRUST PROPERTY. The Trust Property is described as follows:
    [Detailed description of the property or rights to be held in trust]

3.  PURPOSE OF TRUST. The Trustee shall hold the Trust Property for the sole use and benefit of the Beneficiary, and shall manage, invest, and distribute the Trust Property in accordance with the instructions and powers granted herein.

4.  TRUSTEE'S POWERS AND DUTIES. The Trustee shall have the power to [list powers, e.g., "sell, lease, mortgage, or otherwise dispose of the Trust Property"], and shall have the duty to [list duties, e.g., "administer the trust diligently", "provide regular accounting to the Beneficiary"].

5.  BENEFICIARY'S RIGHTS. The Beneficiary shall have the right to [list rights, e.g., "receive income from the Trust Property", "receive distributions of principal as specified"].

6.  GOVERNING LAW. This Deed shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Deed of Trust as of the date first above written.

SIGNED, SEALED, AND DELIVERED by the Settlor:

[Settlor's Signature Block]
[Settlor's Printed Name]
[Settlor's Title]

SIGNED, SEALED, AND DELIVERED by the Trustee:

[Trustee's Signature Block]
[Trustee's Printed Name]
[Trustee's Title]

SIGNED, SEALED, AND DELIVERED by the Beneficiary (acknowledgment):

[Beneficiary's Signature Block]
[Beneficiary's Printed Name]
[Beneficiary's Title]
```

## Signing Guidance

The `settlor` and `trustee` parties should sign the EIP-712 message using their Ethereum wallets. The `beneficiary` may also sign to acknowledge their understanding and acceptance of the trust terms. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Deed of Trust. The `trustPropertyDescription`, `beneficiaryName`, and `trusteeName` fields should accurately reflect the terms of the trust. All relevant parties' details are crucial for verification and should be accurately represented in the `parties` array.

