# E-Contract Template: Borrower Information Form

## Description

This template is for a Borrower Information Form, which collects KYC (Know Your Customer) data from a borrower. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full details of the borrower's information, while the EIP-712 message will capture key verifiable metadata.

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
    "BorrowerInformationForm": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "borrowerName", "type": "string" },
      { "name": "borrowerAddress", "type": "string" },
      { "name": "borrowerEthereumAddress", "type": "address" },
      { "name": "dateOfBirthOrIncorporation", "type": "string" },
      { "name": "identificationType", "type": "string" },
      { "name": "identificationNumber", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "BorrowerInformationForm",
  "message": {
    "contractType": "BorrowerInformationForm",
    "contractTitle": "Borrower Information Form for [Borrower Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "borrower", "ethereumAddress": "<BORROWER_ADDRESS>", "name": "<BORROWER_NAME>", "additionalInfo": "" },
      { "role": "lender", "ethereumAddress": "<LENDER_ADDRESS>", "name": "<LENDER_NAME>", "additionalInfo": "" }
    ],
    "borrowerName": "<BORROWER_FULL_NAME_OR_COMPANY_NAME>",
    "borrowerAddress": "<BORROWER_PHYSICAL_ADDRESS>",
    "borrowerEthereumAddress": "<BORROWER_ETH_ADDRESS>",
    "dateOfBirthOrIncorporation": "<BORROWER_DOB_OR_INCORPORATION_DATE>",
    "identificationType": "<TYPE_OF_ID_E.G._PASSPORT_DRIVERS_LICENSE_COMPANY_REGISTRATION>",
    "identificationNumber": "<ID_NUMBER>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Borrower Information Form]

BORROWER INFORMATION FORM

This Borrower Information Form is completed on [Date],

BY:

[Borrower's Name/Company Name], with an address at [Borrower's Address] ("Borrower").

FOR:

[Lender's Name/Company Name], with an address at [Lender's Address] ("Lender").

I. BORROWER DETAILS

Full Legal Name (Individual/Company): [Borrower's Full Name or Company Name]
Date of Birth / Date of Incorporation: [DD/MM/YYYY]
Residential / Registered Address: [Full Address]
Contact Number: [Phone Number]
Email Address: [Email Address]
Ethereum Address: [Borrower's Ethereum Address]

II. IDENTIFICATION DETAILS

Type of Identification: [e.g., Passport, Driver's License, National ID, Company Registration Number]
Identification Number: [ID Number]
Issuing Authority: [Issuing Authority]
Date of Issue: [DD/MM/YYYY]
Date of Expiry: [DD/MM/YYYY] (if applicable)

III. FINANCIAL INFORMATION (Optional - if collected in this form)

[e.g., Annual Income, Source of Funds, Bank Account Details]

IV. DECLARATION

I/We hereby declare that the information provided in this form is true, accurate, and complete to the best of my/our knowledge and belief. I/We understand that this information will be used by the Lender for the purpose of assessing my/our creditworthiness and for compliance with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations.

I/We authorize the Lender to verify the information provided herein and to make any inquiries it deems necessary in connection with this application.

IN WITNESS WHEREOF, the Borrower has executed this Borrower Information Form as of the date first written above.

[Borrower's Signature Block]
[Borrower's Printed Name]
[Borrower's Title]
```

## Signing Guidance

The `borrower` party should sign the EIP-712 message using their Ethereum wallet. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Borrower Information Form. The `borrowerName`, `borrowerAddress`, `borrowerEthereumAddress`, `dateOfBirthOrIncorporation`, `identificationType`, and `identificationNumber` fields should accurately reflect the information provided by the borrower. The `lender` party's details are included for context and verification. This document is primarily signed by the borrower to attest to the accuracy of the provided information.

