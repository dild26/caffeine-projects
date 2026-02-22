# E-Contract Template: KYC (Know Your Customer) Documents

## Description

This template is for KYC (Know Your Customer) Documents, used to verify identity and regulatory compliance. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full KYC data, while the EIP-712 message will capture key verifiable metadata.

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
    "KYCDocuments": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "entityName", "type": "string" },
      { "name": "entityType", "type": "string" },
      { "name": "identificationType", "type": "string" },
      { "name": "identificationNumber", "type": "string" },
      { "name": "ethereumAddressAssociated", "type": "address" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "KYCDocuments",
  "message": {
    "contractType": "KYCDocuments",
    "contractTitle": "KYC Documents for [Entity Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "dataSubject", "ethereumAddress": "<DATA_SUBJECT_ADDRESS>", "name": "<DATA_SUBJECT_NAME>", "additionalInfo": "" },
      { "role": "verifier", "ethereumAddress": "<VERIFIER_ADDRESS>", "name": "<VERIFIER_NAME>", "additionalInfo": "" }
    ],
    "entityName": "<FULL_NAME_OR_COMPANY_NAME_OF_ENTITY_BEING_KYCED>",
    "entityType": "<TYPE_OF_ENTITY_E.G._INDIVIDUAL_CORPORATION_DAO>",
    "identificationType": "<TYPE_OF_ID_E.G._PASSPORT_DRIVERS_LICENSE_COMPANY_REGISTRATION>",
    "identificationNumber": "<ID_NUMBER>",
    "ethereumAddressAssociated": "<ETHEREUM_ADDRESS_ASSOCIATED_WITH_KYC_ENTITY>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the KYC Documents]

KYC (KNOW YOUR CUSTOMER) DOCUMENTATION

Date: [Date]

This document serves to collect and verify Know Your Customer (KYC) information for:

Entity Name: [Full Name or Company Name of Entity Being KYCed]
Entity Type: [Individual/Corporation/Partnership/DAO/Other]

I. IDENTIFICATION DETAILS

*   **For Individuals:**
    *   Full Legal Name: [Full Name]
    *   Date of Birth: [DD/MM/YYYY]
    *   Nationality: [Nationality]
    *   Residential Address: [Full Address]
    *   Identification Document Type: [e.g., Passport, Driver's License, National ID Card]
    *   Identification Document Number: [ID Number]
    *   Issuing Authority: [Issuing Authority]
    *   Date of Issue: [DD/MM/YYYY]
    *   Date of Expiry: [DD/MM/YYYY]

*   **For Corporations/Entities:**
    *   Full Legal Name of Entity: [Company Name]
    *   Date of Incorporation/Formation: [DD/MM/YYYY]
    *   Jurisdiction of Incorporation: [Country/State]
    *   Registered Address: [Full Address]
    *   Registration Number: [Registration Number]
    *   Tax Identification Number (TIN): [TIN]
    *   Nature of Business: [Brief Description]
    *   Beneficial Owners (if applicable): [List names and percentage of ownership for individuals owning 25% or more]

II. CONTACT INFORMATION

*   Email Address: [Email]
*   Phone Number: [Phone]

III. ETHEREUM ADDRESS(ES) ASSOCIATED WITH THIS ENTITY

*   Primary Ethereum Address: [Ethereum Address]
*   Other Associated Addresses (if any): [List other addresses]

IV. PURPOSE OF RELATIONSHIP / TRANSACTION

[Briefly describe the purpose for which KYC is being conducted, e.g., "Opening an account for cryptocurrency trading", "Participation in a decentralized finance (DeFi) protocol", "Investment in a token offering".]

V. DECLARATION AND CONSENT

I/We hereby declare that the information provided in this KYC documentation is true, accurate, and complete to the best of my/our knowledge and belief. I/We understand that this information will be used for identity verification and regulatory compliance purposes, including Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) regulations.

I/We consent to the collection, processing, and storage of this information by [Verifier Name/Company Name] for the aforementioned purposes and in accordance with applicable privacy policies and laws.

IN WITNESS WHEREOF, the Data Subject has executed this KYC Documentation as of the date first written above.

[Data Subject Signature Block]
[Data Subject Printed Name]
[Data Subject Title/Role]

VERIFICATION BY:

[Verifier Signature Block]
[Verifier Printed Name]
[Verifier Title/Role]
```

## Signing Guidance

The `dataSubject` (the individual or entity providing the KYC information) should sign the EIP-712 message using their Ethereum wallet to attest to the accuracy of the provided data. The `verifier` (the entity collecting and verifying the KYC information) should also sign to confirm the receipt and processing of the documentation. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the KYC Documents. The `entityName`, `entityType`, `identificationType`, `identificationNumber`, and `ethereumAddressAssociated` fields should accurately reflect the core KYC data. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

