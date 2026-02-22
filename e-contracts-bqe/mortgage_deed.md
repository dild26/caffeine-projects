# E-Contract Template: Mortgage Deed

## Description

This template is for a Mortgage Deed, which details terms if a property secures the agreement. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the mortgage deed, while the EIP-712 message will capture key verifiable metadata.

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
    "MortgageDeed": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "propertyAddress", "type": "string" },
      { "name": "loanAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "interestRate", "type": "string" },
      { "name": "maturityDate", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "MortgageDeed",
  "message": {
    "contractType": "MortgageDeed",
    "contractTitle": "Mortgage Deed for [Property Address]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "mortgagor", "ethereumAddress": "<MORTGAGOR_ADDRESS>", "name": "<MORTGAGOR_NAME>", "additionalInfo": "" },
      { "role": "mortgagee", "ethereumAddress": "<MORTGAGEE_ADDRESS>", "name": "<MORTGAGEE_NAME>", "additionalInfo": "" }
    ],
    "propertyAddress": "<FULL_PROPERTY_ADDRESS>",
    "loanAmount": "<TOTAL_LOAN_AMOUNT_SECURED_BY_MORTGAGE>",
    "currency": "<CURRENCY_OF_LOAN>",
    "interestRate": "<INTEREST_RATE_OF_LOAN>",
    "maturityDate": "<UNIX_TIMESTAMP_OF_LOAN_MATURITY_DATE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Mortgage Deed]

MORTGAGE DEED

THIS MORTGAGE DEED is made and entered into on [Date],

BETWEEN:

[Mortgagor Name/Company Name], with an address at [Mortgagor Address] (hereinafter referred to as the "Mortgagor"),

AND

[Mortgagee Name/Company Name], with an address at [Mortgagee Address] (hereinafter referred to as the "Mortgagee").

WHEREAS:

A. The Mortgagor is the registered owner of the property located at [Full Property Address] (the "Property"), legally described as [Legal Description of Property].

B. The Mortgagor has obtained a loan from the Mortgagee in the principal sum of [Loan Amount] [Currency] (the "Loan"), subject to the terms and conditions of a separate Loan Agreement dated [Date of Loan Agreement].

C. The Mortgagor desires to secure the repayment of the Loan and the performance of all obligations under the Loan Agreement by mortgaging the Property to the Mortgagee.

NOW, THIS DEED WITNESSETH as follows:

1.  GRANT OF MORTGAGE. In consideration of the Loan, the Mortgagor hereby grants, conveys, and mortgages to the Mortgagee, its successors and assigns, the Property, with all appurtenances thereto, to secure the due and punctual payment of the Loan and the performance of all covenants and agreements contained in the Loan Agreement and this Mortgage Deed.

2.  COVENANTS OF MORTGAGOR. The Mortgagor covenants and agrees to:
    *   Pay the principal and interest of the Loan as and when due.
    *   Maintain insurance on the Property as required by the Mortgagee.
    *   Pay all taxes, assessments, and other charges levied against the Property.
    *   Keep the Property in good repair and condition.

3.  EVENTS OF DEFAULT. The occurrence of any event of default under the Loan Agreement shall constitute an event of default under this Mortgage Deed, entitling the Mortgagee to exercise all rights and remedies available at law or in equity, including foreclosure.

4.  GOVERNING LAW. This Mortgage Deed shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Mortgage Deed as of the date first written above.

SIGNED, SEALED, AND DELIVERED by the Mortgagor:

[Mortgagor Signature Block]
[Mortgagor Printed Name]
[Mortgagor Title]

SIGNED, SEALED, AND DELIVERED by the Mortgagee:

[Mortgagee Signature Block]
[Mortgagee Printed Name]
[Mortgagee Title]
```

## Signing Guidance

Both the `mortgagor` (borrower) and `mortgagee` (lender) parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Mortgage Deed. The `propertyAddress`, `loanAmount`, `currency`, `interestRate`, and `maturityDate` fields should accurately reflect the terms of the mortgage. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

