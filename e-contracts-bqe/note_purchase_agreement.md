# E-Contract Template: Note Purchase Agreement

## Description

This template is for a Note Purchase Agreement, used in private debt transactions. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the note purchase agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "NotePurchaseAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "notePrincipalAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "interestRate", "type": "string" },
      { "name": "maturityDate", "type": "uint256" },
      { "name": "issuerAddress", "type": "address" },
      { "name": "purchaserAddress", "type": "address" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "NotePurchaseAgreement",
  "message": {
    "contractType": "NotePurchaseAgreement",
    "contractTitle": "Note Purchase Agreement for [Note Series/ID]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "issuer", "ethereumAddress": "<ISSUER_ADDRESS>", "name": "<ISSUER_NAME>", "additionalInfo": "" },
      { "role": "purchaser", "ethereumAddress": "<PURCHASER_ADDRESS>", "name": "<PURCHASER_NAME>", "additionalInfo": "" }
    ],
    "notePrincipalAmount": "<PRINCIPAL_AMOUNT_OF_NOTE>",
    "currency": "<CURRENCY_OF_NOTE>",
    "interestRate": "<INTEREST_RATE_OF_NOTE_E.G._5_PERCENT_ANNUAL>",
    "maturityDate": "<UNIX_TIMESTAMP_OF_NOTE_MATURITY_DATE>",
    "issuerAddress": "<ISSUER_ADDRESS>",
    "purchaserAddress": "<PURCHASER_ADDRESS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Note Purchase Agreement]

NOTE PURCHASE AGREEMENT

This Note Purchase Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Issuer Name/Company Name], with an address at [Issuer Address] (hereinafter referred to as the "Issuer"),

AND

[Purchaser Name/Company Name], with an address at [Purchaser Address] (hereinafter referred to as the "Purchaser").

WHEREAS, the Issuer desires to issue and sell, and the Purchaser desires to purchase, certain promissory notes (the "Notes") on the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  PURCHASE AND SALE OF NOTES. The Issuer agrees to sell to the Purchaser, and the Purchaser agrees to purchase from the Issuer, Notes in the aggregate principal amount of [Note Principal Amount] [Currency].

2.  TERMS OF NOTES. Each Note shall have the following principal terms:
    *   Principal Amount: [Note Principal Amount] [Currency]
    *   Interest Rate: [Interest Rate]
    *   Maturity Date: [Maturity Date]
    *   Issue Date: [Issue Date]
    [Include any other relevant terms, e.g., "convertibility", "security", "subordination"]

3.  REPRESENTATIONS AND WARRANTIES. Both parties make certain representations and warranties to each other as set forth in detail in the full agreement.

4.  COVENANTS. The Issuer covenants and agrees to [list covenants, e.g., "provide financial statements", "maintain certain financial ratios", "not incur additional indebtedness"].

5.  EVENTS OF DEFAULT. The occurrence of any event of default (as defined in the full agreement) shall entitle the Purchaser to exercise all rights and remedies available at law or in equity.

6.  CLOSING. The closing of the purchase and sale of the Notes shall take place on [Closing Date] or such other date as mutually agreed upon by the parties.

7.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Note Purchase Agreement as of the date first written above.

[Issuer Signature Block]
[Issuer Printed Name]
[Issuer Title]

[Purchaser Signature Block]
[Purchaser Printed Name]
[Purchaser Title]
```

## Signing Guidance

Both the `issuer` and `purchaser` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Note Purchase Agreement. The `notePrincipalAmount`, `currency`, `interestRate`, `maturityDate`, `issuerAddress`, and `purchaserAddress` fields should accurately reflect the terms of the note purchase. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

