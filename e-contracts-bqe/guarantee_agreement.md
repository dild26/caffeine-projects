# E-Contract Template: Guarantee Agreement

## Description

This template is for a Guarantee Agreement, where a third party guarantees performance or repayment. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the guarantee agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "GuaranteeAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "guaranteedObligationSummary", "type": "string" },
      { "name": "principalDebtorAddress", "type": "address" },
      { "name": "creditorAddress", "type": "address" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "GuaranteeAgreement",
  "message": {
    "contractType": "GuaranteeAgreement",
    "contractTitle": "Guarantee Agreement for [Obligation]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "guarantor", "ethereumAddress": "<GUARANTOR_ADDRESS>", "name": "<GUARANTOR_NAME>", "additionalInfo": "" },
      { "role": "principalDebtor", "ethereumAddress": "<PRINCIPAL_DEBTOR_ADDRESS>", "name": "<PRINCIPAL_DEBTOR_NAME>", "additionalInfo": "" },
      { "role": "creditor", "ethereumAddress": "<CREDITOR_ADDRESS>", "name": "<CREDITOR_NAME>", "additionalInfo": "" }
    ],
    "guaranteedObligationSummary": "<BRIEF_SUMMARY_OF_THE_OBLIGATION_BEING_GUARANTEED>",
    "principalDebtorAddress": "<PRINCIPAL_DEBTOR_ADDRESS>",
    "creditorAddress": "<CREDITOR_ADDRESS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Guarantee Agreement]

GUARANTEE AGREEMENT

This Guarantee Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Guarantor Name/Company Name], with an address at [Guarantor Address] (hereinafter referred to as the "Guarantor"),

AND

[Creditor Name/Company Name], with an address at [Creditor Address] (hereinafter referred to as the "Creditor").

WHEREAS:

A. [Principal Debtor Name/Company Name], with an address at [Principal Debtor Address] (hereinafter referred to as the "Principal Debtor"), is indebted to the Creditor or is under certain obligations to the Creditor pursuant to [describe underlying agreement, e.g., "a loan agreement dated [Date]", "a contract for services dated [Date]"] (the "Underlying Obligation").

B. The Creditor has requested that the Guarantor guarantee the due and punctual performance by the Principal Debtor of the Underlying Obligation.

C. The Guarantor has agreed to provide such guarantee on the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the Creditor entering into or continuing with the Underlying Obligation with the Principal Debtor, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1.  GUARANTEE. The Guarantor hereby unconditionally and irrevocably guarantees to the Creditor the due and punctual payment and performance by the Principal Debtor of all its present and future obligations and liabilities under the Underlying Obligation (the "Guaranteed Obligations").

2.  NATURE OF GUARANTEE. This is a continuing guarantee and shall remain in full force and effect until all Guaranteed Obligations have been fully and finally discharged.

3.  DEMAND. In the event the Principal Debtor fails to perform any of the Guaranteed Obligations when due, the Creditor may make a demand on the Guarantor for such performance or payment.

4.  WAIVERS. The Guarantor waives any right to require the Creditor to proceed against the Principal Debtor or any other person, or to pursue any other remedy in the Creditor's power, before proceeding against the Guarantor.

5.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Guarantee Agreement as of the date first written above.

[Guarantor Signature Block]
[Guarantor Printed Name]
[Guarantor Title]

[Creditor Signature Block]
[Creditor Printed Name]
[Creditor Title]

ACKNOWLEDGMENT BY PRINCIPAL DEBTOR (Optional, but recommended):

[Principal Debtor Signature Block]
[Principal Debtor Printed Name]
[Principal Debtor Title]
```

## Signing Guidance

The `guarantor` and `creditor` parties should sign the EIP-712 message using their Ethereum wallets. The `principalDebtor` may also sign to acknowledge the guarantee. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Guarantee Agreement. The `guaranteedObligationSummary`, `principalDebtorAddress`, and `creditorAddress` fields should accurately reflect the terms of the guarantee. All relevant parties' details are crucial for verification and should be accurately represented in the `parties` array.

