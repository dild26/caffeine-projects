# E-Contract Template: Investment Agreement

## Description

This template is for an Investment Agreement, which governs capital investment terms. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the investment agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "InvestmentAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "investmentAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "equityPercentage", "type": "string" },
      { "name": "investmentPurpose", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "InvestmentAgreement",
  "message": {
    "contractType": "InvestmentAgreement",
    "contractTitle": "Investment Agreement for [Company/Project Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "investor", "ethereumAddress": "<INVESTOR_ADDRESS>", "name": "<INVESTOR_NAME>", "additionalInfo": "" },
      { "role": "company", "ethereumAddress": "<COMPANY_ADDRESS>", "name": "<COMPANY_NAME>", "additionalInfo": "" }
    ],
    "investmentAmount": "<TOTAL_INVESTMENT_AMOUNT>",
    "currency": "<CURRENCY_OF_INVESTMENT>",
    "equityPercentage": "<EQUITY_PERCENTAGE_OR_DESCRIPTION_OF_RETURN>",
    "investmentPurpose": "<BRIEF_DESCRIPTION_OF_INVESTMENT_PURPOSE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Investment Agreement]

INVESTMENT AGREEMENT

This Investment Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Investor Name/Company Name], with an address at [Investor Address] (hereinafter referred to as the "Investor"),

AND

[Company Name], a [Type of Entity, e.g., "corporation", "LLC"] organized under the laws of [Jurisdiction], with its principal place of business at [Company Address] (hereinafter referred to as the "Company").

WHEREAS:

A. The Company is engaged in the business of [describe Company's business].

B. The Investor desires to invest capital in the Company, and the Company desires to accept such investment, subject to the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  INVESTMENT. The Investor agrees to invest the sum of [Investment Amount] [Currency] (the "Investment") in the Company.

2.  CONSIDERATION. In consideration for the Investment, the Company agrees to issue to the Investor [describe what the investor receives, e.g., "[Number] shares of common stock, representing [Percentage]% of the Company's fully diluted equity", "a convertible note with a principal amount of [Amount]", "a certain percentage of future profits"].

3.  PURPOSE OF INVESTMENT. The Company shall use the proceeds of the Investment for [describe purpose, e.g., "working capital", "product development", "market expansion"].

4.  REPRESENTATIONS AND WARRANTIES. Both parties make certain representations and warranties to each other as set forth in detail in the full agreement.

5.  GOVERNANCE AND RIGHTS. [Outline any governance rights, board seats, information rights, or other special rights granted to the Investor].

6.  CLOSING. The closing of the Investment shall take place on [Closing Date] or such other date as mutually agreed upon by the parties.

7.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Investment Agreement as of the date first written above.

[Investor Signature Block]
[Investor Printed Name]
[Investor Title]

[Company Representative Signature Block]
[Company Representative Printed Name]
[Company Representative Title]
```

## Signing Guidance

Both the `investor` and `company` parties should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Investment Agreement. The `investmentAmount`, `currency`, `equityPercentage`, and `investmentPurpose` fields should accurately reflect the terms of the investment. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

