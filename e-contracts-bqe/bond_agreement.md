# E-Contract Template: Bond Agreement

## Description

This template is for a Bond Agreement, outlining terms of an e-bond including interest, maturity, and obligations. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the bond agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "BondAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "bondAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "interestRate", "type": "string" },
      { "name": "maturityDate", "type": "uint256" },
      { "name": "issuerAddress", "type": "address" },
      { "name": "bondHolderAddress", "type": "address" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "BondAgreement",
  "message": {
    "contractType": "BondAgreement",
    "contractTitle": "Bond Agreement for [Bond Name/ID]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "issuer", "ethereumAddress": "<ISSUER_ADDRESS>", "name": "<ISSUER_NAME>", "additionalInfo": "" },
      { "role": "bondHolder", "ethereumAddress": "<BOND_HOLDER_ADDRESS>", "name": "<BOND_HOLDER_NAME>", "additionalInfo": "" }
    ],
    "bondAmount": "<BOND_PRINCIPAL_AMOUNT>",
    "currency": "<CURRENCY_OF_BOND_E.G._USD_ETH>",
    "interestRate": "<INTEREST_RATE_E.G._5_PERCENT_ANNUAL>",
    "maturityDate": "<UNIX_TIMESTAMP_OF_MATURITY_DATE>",
    "issuerAddress": "<ISSUER_ADDRESS>",
    "bondHolderAddress": "<BOND_HOLDER_ADDRESS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Bond Agreement]

BOND AGREEMENT

This Bond Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Issuer's Name/Company Name], with an address at [Issuer's Address] ("Issuer"),

AND

[Bond Holder's Name/Company Name], with an address at [Bond Holder's Address] ("Bond Holder").

WHEREAS, the Issuer desires to issue a bond to the Bond Holder, and the Bond Holder desires to purchase said bond, subject to the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  BOND ISSUANCE. The Issuer hereby issues to the Bond Holder, and the Bond Holder hereby purchases from the Issuer, a bond with the following principal terms:
    *   Principal Amount: [Bond Amount] [Currency]
    *   Interest Rate: [Interest Rate]
    *   Maturity Date: [Maturity Date]
    *   Issue Date: [Issue Date]

2.  INTEREST PAYMENTS. The Issuer shall pay interest on the principal amount of the bond to the Bond Holder [frequency, e.g., "annually", "semi-annually"] on [Payment Dates].

3.  REPAYMENT. The Issuer shall repay the full principal amount of the bond to the Bond Holder on the Maturity Date.

4.  OBLIGATIONS OF ISSUER. The Issuer covenants and agrees to [list obligations, e.g., "maintain accurate records", "provide financial statements annually"].

5.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Bond Agreement as of the date first written above.

[Issuer's Signature Block]
[Issuer's Printed Name]
[Issuer's Title]

[Bond Holder's Signature Block]
[Bond Holder's Printed Name]
[Bond Holder's Title]
```

## Signing Guidance

Both the `issuer` and `bondHolder` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Bond Agreement. The `bondAmount`, `currency`, `interestRate`, `maturityDate`, `issuerAddress`, and `bondHolderAddress` fields should accurately reflect the terms of the bond. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

