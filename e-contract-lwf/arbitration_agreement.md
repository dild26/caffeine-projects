# E-Contract Template: Arbitration Agreement

## Description

This template is for an Arbitration Agreement, which specifies arbitration as the method for dispute resolution. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the arbitration agreement, while the EIP-712 message will capture key verifiable metadata.

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
    "ArbitrationAgreement": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "disputeDescription", "type": "string" },
      { "name": "arbitrationRules", "type": "string" },
      { "name": "arbitrationLocation", "type": "string" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "ArbitrationAgreement",
  "message": {
    "contractType": "ArbitrationAgreement",
    "contractTitle": "Arbitration Agreement for [Dispute Subject]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "party1", "ethereumAddress": "<PARTY1_ADDRESS>", "name": "<PARTY1_NAME>", "additionalInfo": "" },
      { "role": "party2", "ethereumAddress": "<PARTY2_ADDRESS>", "name": "<PARTY2_NAME>", "additionalInfo": "" }
    ],
    "disputeDescription": "<BRIEF_DESCRIPTION_OF_THE_DISPUTE_OR_MATTERS_SUBJECT_TO_ARBITRATION>",
    "arbitrationRules": "<NAME_OF_ARBITRATION_RULES_E.G._AAA_ICC_UNCITRAL>",
    "arbitrationLocation": "<CITY_AND_COUNTRY_OF_ARBITRATION>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Arbitration Agreement]

ARBITRATION AGREEMENT

This Arbitration Agreement ("Agreement") is made and entered into on [Date],

BETWEEN:

[Party 1 Name/Company Name], with an address at [Party 1 Address] (hereinafter referred to as "Party 1"),

AND

[Party 2 Name/Company Name], with an address at [Party 2 Address] (hereinafter referred to as "Party 2").

WHEREAS, the parties desire to resolve any disputes arising between them through arbitration;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, the parties agree as follows:

1.  AGREEMENT TO ARBITRATE. Any dispute, controversy, or claim arising out of or relating to [describe the scope of disputes covered, e.g., "this Agreement", "the relationship between the parties", "the performance of the contract dated [Date]"] (the "Dispute") shall be finally settled by arbitration.

2.  ARBITRATION RULES. The arbitration shall be administered by [Name of Arbitration Institution, e.g., "the American Arbitration Association (AAA)", "the International Chamber of Commerce (ICC)"] in accordance with its [Applicable Rules, e.g., "Commercial Arbitration Rules", "Rules of Arbitration"] then in effect.

3.  NUMBER OF ARBITRATORS. The Dispute shall be heard and determined by [Number, e.g., "one", "three"] arbitrator(s).

4.  ARBITRATION LOCATION. The place of arbitration shall be [City, Country].

5.  LANGUAGE OF ARBITRATION. The language to be used in the arbitral proceedings shall be [Language].

6.  ARBITRATION AWARD. The award rendered by the arbitrator(s) shall be final and binding upon both parties, and judgment on the award may be entered in any court having jurisdiction thereof.

7.  CONFIDENTIALITY. The parties agree that the arbitration proceedings and all information disclosed during the arbitration shall be kept confidential, except as may be required by law.

8.  GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of laws principles.

IN WITNESS WHEREOF, the parties have executed this Arbitration Agreement as of the date first written above.

[Party 1 Signature Block]
[Party 1 Printed Name]
[Party 1 Title]

[Party 2 Signature Block]
[Party 2 Printed Name]
[Party 2 Title]
```

## Signing Guidance

Both Party 1 and Party 2 should sign the EIP-712 message using their Ethereum wallets. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Arbitration Agreement. The `disputeDescription`, `arbitrationRules`, and `arbitrationLocation` fields should accurately reflect the terms of the arbitration. Both parties’ details are crucial for verification and should be accurately represented in the `parties` array.

