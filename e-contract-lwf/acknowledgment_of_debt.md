# E-Contract Template: Acknowledgment of Debt

## Description

This template is for an Acknowledgment of Debt, which confirms the borrower's acknowledgment of the debt owed. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the acknowledgment, while the EIP-712 message will capture key verifiable metadata.

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
    "AcknowledgmentOfDebt": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "debtAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "originalAgreementDate", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "AcknowledgmentOfDebt",
  "message": {
    "contractType": "AcknowledgmentOfDebt",
    "contractTitle": "Acknowledgment of Debt for [Debt Amount] [Currency]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "debtor", "ethereumAddress": "<DEBTOR_ADDRESS>", "name": "<DEBTOR_NAME>", "additionalInfo": "" },
      { "role": "creditor", "ethereumAddress": "<CREDITOR_ADDRESS>", "name": "<CREDITOR_NAME>", "additionalInfo": "" }
    ],
    "debtAmount": "<TOTAL_DEBT_AMOUNT>",
    "currency": "<CURRENCY_OF_DEBT>",
    "originalAgreementDate": "<UNIX_TIMESTAMP_OF_ORIGINAL_AGREEMENT_DATE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Acknowledgment of Debt]

ACKNOWLEDGMENT OF DEBT

Date: [Date]

TO: [Creditor Name/Company Name]
[Creditor Address]

FROM: [Debtor Name/Company Name]
[Debtor Address]

Subject: Acknowledgment of Debt

I/We, [Debtor Name/Company Name], hereby acknowledge and confirm that I/we are indebted to [Creditor Name/Company Name] (the "Creditor") in the principal sum of [Debt Amount] [Currency] (the "Debt").

This Debt arises from [briefly describe the origin of the debt, e.g., "a loan agreement dated [Date]", "goods and services provided on [Date]", "a promissory note dated [Date]"].

I/We confirm that the outstanding balance of the Debt as of the date of this Acknowledgment is [Outstanding Debt Amount] [Currency].

I/We further acknowledge and agree to the following terms regarding the repayment of the Debt:

[Specify repayment terms, e.g., "The Debt shall be repaid in full on or before [Repayment Date].", "The Debt shall be repaid in [Number] equal monthly installments of [Installment Amount] [Currency], commencing on [First Payment Date]."]

This Acknowledgment of Debt is made voluntarily and without duress, and I/we understand that it may be used by the Creditor as evidence of the Debt.

IN WITNESS WHEREOF, I/We have executed this Acknowledgment of Debt as of the date first written above.

[Debtor Signature Block]
[Debtor Printed Name]
[Debtor Title]

ACKNOWLEDGMENT OF RECEIPT BY CREDITOR (Optional):

[Creditor Signature Block]
[Creditor Printed Name]
[Creditor Title]
```

## Signing Guidance

The `debtor` party should sign the EIP-712 message using their Ethereum wallet to acknowledge the debt. The `creditor` party may also sign to acknowledge receipt of the acknowledgment. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Acknowledgment of Debt. The `debtAmount`, `currency`, and `originalAgreementDate` fields should accurately reflect the details of the debt. Both parties (or at least the debtor) details are crucial for verification and should be accurately represented in the `parties` array.

