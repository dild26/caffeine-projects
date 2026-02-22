# E-Contract Template: Security Agreement

## Description

This template is for a Security Agreement, which grants a security interest in collateral. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the security agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "SecurityAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "securedObligationSummary", "type": "string" },
      { "name": "collateralDescription", "type": "string" },
      { "name": "debtorAddress", "type": "address" },
      { "name": "securedPartyAddress", "type": "address" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "SecurityAgreement",
  "message": {
    "contractType": "SecurityAgreement",
    "contractTitle": "Security Agreement for [Collateral Description]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "debtor", "ethereumAddress": "<DEBTOR_ADDRESS>", "name": "<DEBTOR_NAME>", "additionalInfo": "" },
      { "role": "securedParty", "ethereumAddress": "<SECURED_PARTY_ADDRESS>", "name": "<SECURED_PARTY_NAME>", "additionalInfo": "" }
    ],
    "securedObligationSummary": "<BRIEF_SUMMARY_OF_THE_OBLIGATION_BEING_SECURED>",
    "collateralDescription": "<BRIEF_DESCRIPTION_OF_THE_COLLATERAL>",
    "debtorAddress": "<DEBTOR_ADDRESS>",
    "securedPartyAddress": "<SECURED_PARTY_ADDRESS>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Security Agreement]

SECURITY AGREEMENT

This Security Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Debtor Name/Company Name], with an address at [Debtor Address] (hereinafter referred to as the "Debtor"),

AND

[Secured Party Name/Company Name], with an address at [Secured Party Address] (hereinafter referred to as the "Secured Party").

WHEREAS:

A. The Debtor is indebted to the Secured Party or has certain obligations to the Secured Party pursuant to [describe underlying obligation, e.g., "a loan agreement dated [Date]", "a promissory note dated [Date]"] (the "Secured Obligation").

B. To secure the prompt payment and performance of the Secured Obligation, the Debtor desires to grant a security interest in certain collateral to the Secured Party.

NOW, THEREFORE, in consideration of the Secured Obligation and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1.  GRANT OF SECURITY INTEREST. The Debtor hereby grants to the Secured Party a security interest in all of the Debtor's right, title, and interest in and to the following property, wherever located, whether now owned or hereafter acquired, and all proceeds thereof (the "Collateral"):
    [Detailed description of the collateral, e.g., "all accounts, inventory, equipment, and general intangibles", "specific digital assets identified by their unique identifiers and blockchain addresses"]

2.  SECURED OBLIGATION. This Agreement secures the prompt payment and performance of the Secured Obligation, which includes [describe the nature and amount of the obligation, e.g., "a principal amount of [Amount] [Currency] plus interest", "all obligations under the Loan Agreement dated [Date]"].

3.  REPRESENTATIONS AND WARRANTIES. The Debtor represents and warrants that [e.g., "it has good and marketable title to the Collateral", "the Collateral is free and clear of all liens, encumbrances, and adverse claims, except for the security interest granted herein"].

4.  COVENANTS OF DEBTOR. The Debtor covenants and agrees to [list covenants, e.g., "maintain the Collateral in good condition", "not sell or transfer the Collateral without the Secured Party's prior written consent", "provide access to the Collateral for inspection"].

5.  EVENTS OF DEFAULT. The occurrence of any event of default under the Secured Obligation or this Agreement (as defined in the full agreement) shall entitle the Secured Party to exercise all rights and remedies available at law or in equity, including the right to take possession of the Collateral.

6.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Security Agreement as of the date first written above.

[Debtor Signature Block]
[Debtor Printed Name]
[Debtor Title]

[Secured Party Signature Block]
[Secured Party Printed Name]
[Secured Party Title]
```

## Signing Guidance

Both the `debtor` and `securedParty` should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Security Agreement. The `securedObligationSummary`, `collateralDescription`, `debtorAddress`, and `securedPartyAddress` fields should accurately reflect the terms of the security interest. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

