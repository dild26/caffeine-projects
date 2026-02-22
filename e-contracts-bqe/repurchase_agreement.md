# E-Contract Template: Repurchase Agreement (Repo)

## Description

This template is for a Repurchase Agreement (Repo), a short-term borrowing document common in bond markets. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the repo agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "RepurchaseAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "securitiesDescription", "type": "string" },
      { "name": "repurchasePrice", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "repurchaseDate", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "RepurchaseAgreement",
  "message": {
    "contractType": "RepurchaseAgreement",
    "contractTitle": "Repurchase Agreement for [Securities Description]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "seller", "ethereumAddress": "<SELLER_ADDRESS>", "name": "<SELLER_NAME>", "additionalInfo": "" },
      { "role": "buyer", "ethereumAddress": "<BUYER_ADDRESS>", "name": "<BUYER_NAME>", "additionalInfo": "" }
    ],
    "securitiesDescription": "<BRIEF_DESCRIPTION_OF_SECURITIES_BEING_SOLD_AND_REPURCHASED>",
    "repurchasePrice": "<PRICE_AT_WHICH_SECURITIES_WILL_BE_REPURCHASED>",
    "currency": "<CURRENCY_OF_REPURCHASE_PRICE>",
    "repurchaseDate": "<UNIX_TIMESTAMP_OF_REPURCHASE_DATE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Repurchase Agreement]

REPURCHASE AGREEMENT

This Repurchase Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Seller Name/Company Name], with an address at [Seller Address] (hereinafter referred to as the "Seller"),

AND

[Buyer Name/Company Name], with an address at [Buyer Address] (hereinafter referred to as the "Buyer").

WHEREAS:

A. The Seller desires to sell certain securities to the Buyer and simultaneously agree to repurchase them at a later date.

B. The Buyer desires to purchase such securities from the Seller and simultaneously agree to resell them to the Seller at a later date.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  SALE AND REPURCHASE. On the Effective Date, the Seller shall sell to the Buyer, and the Buyer shall purchase from the Seller, the following securities (the "Securities"):
    [Detailed description of the securities, including quantity, ISIN, and any other identifiers]

    The purchase price for the Securities on the Effective Date shall be [Initial Purchase Price] [Currency].

    On the Repurchase Date, the Buyer shall sell to the Seller, and the Seller shall repurchase from the Buyer, the Securities at the Repurchase Price.

2.  REPURCHASE PRICE. The repurchase price (the "Repurchase Price") shall be [Repurchase Price] [Currency]. The difference between the Initial Purchase Price and the Repurchase Price represents the interest earned by the Buyer on the transaction.

3.  REPURCHASE DATE. The repurchase shall occur on [Repurchase Date] (the "Repurchase Date").

4.  DELIVERY. Delivery of the Securities on the Effective Date and the Repurchase Date shall be made in accordance with customary market practices.

5.  REPRESENTATIONS AND WARRANTIES. Both parties make certain representations and warranties to each other as set forth in detail in the full agreement.

6.  EVENTS OF DEFAULT. The occurrence of any event of default (as defined in the full agreement) shall entitle the non-defaulting party to exercise all rights and remedies available at law or in equity.

7.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Repurchase Agreement as of the date first written above.

[Seller Signature Block]
[Seller Printed Name]
[Seller Title]

[Buyer Signature Block]
[Buyer Printed Name]
[Buyer Title]
```

## Signing Guidance

Both the `seller` and `buyer` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Repurchase Agreement. The `securitiesDescription`, `repurchasePrice`, `currency`, and `repurchaseDate` fields should accurately reflect the terms of the repo. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

