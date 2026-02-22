# E-Contract Template: Electronic Signature Certificate

## Description

This template is for an Electronic Signature Certificate, which proves the validity of an e-signature. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full details of the certificate, while the EIP-712 message will capture key verifiable metadata.

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
    "ElectronicSignatureCertificate": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "signedDocumentHash", "type": "bytes32" },
      { "name": "signedDocumentName", "type": "string" },
      { "name": "signerEthereumAddress", "type": "address" },
      { "name": "signatureTimestamp", "type": "uint256" },
      { "name": "signatureMethod", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "ElectronicSignatureCertificate",
  "message": {
    "contractType": "ElectronicSignatureCertificate",
    "contractTitle": "Electronic Signature Certificate for [Document Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "certifier", "ethereumAddress": "<CERTIFIER_ADDRESS>", "name": "<CERTIFIER_NAME>", "additionalInfo": "" },
      { "role": "signer", "ethereumAddress": "<SIGNER_ADDRESS>", "name": "<SIGNER_NAME>", "additionalInfo": "" }
    ],
    "signedDocumentHash": "<HASH_OF_THE_SIGNED_DIGITAL_DOCUMENT>",
    "signedDocumentName": "<NAME_OF_THE_SIGNED_DIGITAL_DOCUMENT>",
    "signerEthereumAddress": "<SIGNER_ETH_ADDRESS>",
    "signatureTimestamp": "<UNIX_TIMESTAMP_OF_SIGNATURE>",
    "signatureMethod": "<METHOD_USED_FOR_E_SIGNATURE_E.G._EIP712_ETH_SIGN>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Electronic Signature Certificate]

ELECTRONIC SIGNATURE CERTIFICATE

This Electronic Signature Certificate is issued on [Date],

BY:

[Certifier Name/Company Name], with an address at [Certifier Address] (hereinafter referred to as the "Certifier"),

REGARDING:

Signed Document Name: [Name of the Signed Digital Document]
Signed Document Hash (SHA-256): [Hash of the Signed Digital Document]
Signer's Ethereum Address: [Signer's Ethereum Address]
Signature Timestamp: [Date and Time of Signature]
Signature Method: [Method Used for E-Signature, e.g., EIP-712, eth_sign]

This Certificate confirms that the electronic signature applied to the aforementioned Signed Document by the Signer at the specified timestamp and using the specified method has been verified by the Certifier as valid and authentic.

Details of Verification:

[Provide detailed findings or observations from the signature verification process. This might include:
- Cryptographic algorithms used
- Public key verification details
- Any relevant chain of trust information]

This certificate is issued for informational purposes and serves as a record of the electronic signature verification performed on the specified digital document.

IN WITNESS WHEREOF, the Certifier has executed this Electronic Signature Certificate as of the date first written above.

[Certifier Signature Block]
[Certifier Printed Name]
[Certifier Title]
```

## Signing Guidance

The `certifier` party should sign the EIP-712 message using their Ethereum wallet to attest to the validity of the electronic signature. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Electronic Signature Certificate. The `signedDocumentHash`, `signedDocumentName`, `signerEthereumAddress`, `signatureTimestamp`, and `signatureMethod` fields should accurately reflect the details of the electronic signature being certified. The `signer` party's details are included for context and verification. This document is primarily signed by the certifier to formally attest to the signature's validity.

