# E-Contract Template: Servicing Agreement

## Description

This template is for a Servicing Agreement, which describes how payments or maintenance are handled. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the servicing agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "ServicingAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "servicedAssetDescription", "type": "string" },
      { "name": "servicingFeeAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "servicingTermInDays", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "ServicingAgreement",
  "message": {
    "contractType": "ServicingAgreement",
    "contractTitle": "Servicing Agreement for [Asset/Loan ID]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "servicer", "ethereumAddress": "<SERVICER_ADDRESS>", "name": "<SERVICER_NAME>", "additionalInfo": "" },
      { "role": "client", "ethereumAddress": "<CLIENT_ADDRESS>", "name": "<CLIENT_NAME>", "additionalInfo": "" }
    ],
    "servicedAssetDescription": "<BRIEF_DESCRIPTION_OF_ASSET_OR_LOAN_BEING_SERVICED>",
    "servicingFeeAmount": "<AMOUNT_OF_SERVICING_FEE>",
    "currency": "<CURRENCY_OF_SERVICING_FEE>",
    "servicingTermInDays": "<NUMBER_OF_DAYS_FOR_SERVICING_TERM>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Servicing Agreement]

SERVICING AGREEMENT

This Servicing Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Servicer Name/Company Name], with an address at [Servicer Address] (hereinafter referred to as the "Servicer"),

AND

[Client Name/Company Name], with an address at [Client Address] (hereinafter referred to as the "Client").

WHEREAS, the Client owns or has an interest in certain assets/loans that require servicing, and the Servicer is capable of providing such servicing;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  SERVICED ASSETS/LOANS. The Client hereby engages the Servicer to provide servicing for the following assets/loans (the "Serviced Assets"):
    [Detailed description of the assets or loans to be serviced, e.g., "a portfolio of mortgage loans identified in Schedule A", "digital assets held in wallet address [Address]", "a specific loan agreement dated [Date]"]

2.  SERVICING DUTIES. The Servicer shall perform the following duties with respect to the Serviced Assets:
    [Detailed list of servicing duties, e.g., "collection of payments", "maintenance of records", "customer service", "reporting to the Client", "management of defaults", "technical support for digital assets"]

3.  SERVICING FEE. The Client shall pay the Servicer a servicing fee of [Servicing Fee Amount] [Currency] [frequency, e.g., "per month", "per annum", "per transaction"].

4.  TERM. This Agreement shall commence on the Effective Date and continue for a period of [Servicing Term in Days] days, unless terminated earlier in accordance with the provisions herein.

5.  REPRESENTATIONS AND WARRANTIES. Both parties make certain representations and warranties to each other as set forth in detail in the full agreement.

6.  INDEMNIFICATION. [Standard indemnification clauses].

7.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Servicing Agreement as of the date first written above.

[Servicer Signature Block]
[Servicer Printed Name]
[Servicer Title]

[Client Signature Block]
[Client Printed Name]
[Client Title]
```

## Signing Guidance

Both the `servicer` and `client` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Servicing Agreement. The `servicedAssetDescription`, `servicingFeeAmount`, `currency`, and `servicingTermInDays` fields should accurately reflect the terms of the servicing arrangement. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

