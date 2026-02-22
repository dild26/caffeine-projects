# E-Contract Template: Authentication Certificate

## Description

This template is for an Authentication Certificate, which verifies the identity and integrity of digital documents. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the details of the authentication, while the EIP-712 message will capture key verifiable metadata.

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
    "AuthenticationCertificate": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "documentHash", "type": "bytes32" },
      { "name": "documentName", "type": "string" },
      { "name": "authenticationMethod", "type": "string" },
      { "name": "authenticationResult", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "AuthenticationCertificate",
  "message": {
    "contractType": "AuthenticationCertificate",
    "contractTitle": "Authentication Certificate for [Document Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "authenticator", "ethereumAddress": "<AUTHENTICATOR_ADDRESS>", "name": "<AUTHENTICATOR_NAME>", "additionalInfo": "" },
      { "role": "documentOwner", "ethereumAddress": "<DOCUMENT_OWNER_ADDRESS>", "name": "<DOCUMENT_OWNER_NAME>", "additionalInfo": "" }
    ],
    "documentHash": "<HASH_OF_THE_DIGITAL_DOCUMENT_BEING_AUTHENTICATED>",
    "documentName": "<NAME_OF_THE_DIGITAL_DOCUMENT>",
    "authenticationMethod": "<METHOD_USED_FOR_AUTHENTICATION>",
    "authenticationResult": "<RESULT_OF_AUTHENTICATION_E.G._VALID_INVALID>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Authentication Certificate]

AUTHENTICATION CERTIFICATE

This Authentication Certificate is issued on [Date],

BY:

[Authenticator's Name/Company Name], with an address at [Authenticator's Address] ("Authenticator"),

REGARDING:

Digital Document Name: [Name of the Digital Document]
Digital Document Hash (SHA-256): [Hash of the Digital Document]

This Certificate confirms that the Authenticator has performed an authentication process on the aforementioned Digital Document using the following method:

Authentication Method: [Method Used for Authentication, e.g., "Cryptographic Hash Verification", "Digital Signature Validation", "Blockchain Timestamp Verification"]

Authentication Result: [Result of Authentication, e.g., "VALID - Document integrity verified and identity confirmed.", "INVALID - Document altered or identity unconfirmed."]

Details of Authentication:

[Provide detailed findings or observations from the authentication process. This might include:
- Timestamp of verification
- Specific cryptographic algorithms used
- Details of digital signatures found and their validity
- Any discrepancies or anomalies observed]

This certificate is issued for informational purposes and serves as a record of the authentication performed on the specified digital document at the time of issuance.

IN WITNESS WHEREOF, the Authenticator has executed this Authentication Certificate as of the date first written above.

[Authenticator's Signature Block]
[Authenticator's Printed Name]
[Authenticator's Title]
```

## Signing Guidance

The `authenticator` party should sign the EIP-712 message using their Ethereum wallet. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Authentication Certificate. The `documentHash`, `documentName`, `authenticationMethod`, and `authenticationResult` fields should accurately reflect the details of the authenticated document and the outcome of the authentication process. The `documentOwner` party's details are included for context and verification. This document is primarily signed by the authenticator to attest to the verification process.

