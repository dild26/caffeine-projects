# E-Contract Template: Subscription Agreement

## Description

This template is for a Subscription Agreement, used in investment or bond issuance. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the subscription agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "SubscriptionAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "subscribedAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "securityType", "type": "string" },
      { "name": "numberOfSecurities", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "SubscriptionAgreement",
  "message": {
    "contractType": "SubscriptionAgreement",
    "contractTitle": "Subscription Agreement for [Security Type]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "subscriber", "ethereumAddress": "<SUBSCRIBER_ADDRESS>", "name": "<SUBSCRIBER_NAME>", "additionalInfo": "" },
      { "role": "issuer", "ethereumAddress": "<ISSUER_ADDRESS>", "name": "<ISSUER_NAME>", "additionalInfo": "" }
    ],
    "subscribedAmount": "<TOTAL_MONETARY_AMOUNT_SUBSCRIBED>",
    "currency": "<CURRENCY_OF_SUBSCRIPTION>",
    "securityType": "<TYPE_OF_SECURITY_E.G._SHARES_BONDS_TOKENS>",
    "numberOfSecurities": "<NUMBER_OF_SECURITIES_SUBSCRIBED>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Subscription Agreement]

SUBSCRIPTION AGREEMENT

This Subscription Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Subscriber Name/Company Name], with an address at [Subscriber Address] (hereinafter referred to as the "Subscriber"),

AND

[Issuer Name/Company Name], with an address at [Issuer Address] (hereinafter referred to as the "Issuer").

WHEREAS:

A. The Issuer is offering to sell [describe securities, e.g., "shares of its common stock", "bonds", "tokens"] (the "Securities").

B. The Subscriber desires to subscribe for and purchase certain of the Securities on the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  SUBSCRIPTION. The Subscriber hereby irrevocably subscribes for and agrees to purchase from the Issuer [Number of Securities] of the Securities for a total subscription amount of [Subscribed Amount] [Currency].

2.  PAYMENT. The Subscriber agrees to pay the Subscription Amount to the Issuer in accordance with the payment instructions provided by the Issuer.

3.  REPRESENTATIONS AND WARRANTIES OF SUBSCRIBER. The Subscriber represents and warrants that:
    *   It has the legal capacity and authority to enter into this Agreement.
    *   It is an "accredited investor" (if applicable, as defined by relevant securities laws).
    *   It has conducted its own due diligence and understands the risks associated with investing in the Securities.
    *   The funds used for the subscription are not derived from illegal activities.

4.  REPRESENTATIONS AND WARRANTIES OF ISSUER. The Issuer represents and warrants that:
    *   It has the legal capacity and authority to enter into this Agreement and issue the Securities.
    *   The Securities, when issued, will be validly issued, fully paid, and non-assessable.

5.  ACCEPTANCE OF SUBSCRIPTION. The Issuer reserves the right to accept or reject this subscription in whole or in part, in its sole discretion. If this subscription is rejected, the Subscription Amount paid by the Subscriber will be returned without interest or deduction.

6.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Subscription Agreement as of the date first written above.

[Subscriber Signature Block]
[Subscriber Printed Name]
[Subscriber Title]

[Issuer Signature Block]
[Issuer Printed Name]
[Issuer Title]
```

## Signing Guidance

Both the `subscriber` and `issuer` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Subscription Agreement. The `subscribedAmount`, `currency`, `securityType`, and `numberOfSecurities` fields should accurately reflect the terms of the subscription. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

