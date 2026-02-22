# E-Contract Template: Power of Attorney

## Description

This template is for a Power of Attorney, which grants authority to act on someone else’s behalf. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full legal text of the power of attorney, while the EIP-712 message will capture key verifiable metadata.

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
    "PowerOfAttorney": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "principalName", "type": "string" },
      { "name": "agentName", "type": "string" },
      { "name": "authorityGrantedSummary", "type": "string" },
      { "name": "durationInDays", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "PowerOfAttorney",
  "message": {
    "contractType": "PowerOfAttorney",
    "contractTitle": "Power of Attorney for [Principal Name] to [Agent Name]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "principal", "ethereumAddress": "<PRINCIPAL_ADDRESS>", "name": "<PRINCIPAL_NAME>", "additionalInfo": "" },
      { "role": "agent", "ethereumAddress": "<AGENT_ADDRESS>", "name": "<AGENT_NAME>", "additionalInfo": "" }
    ],
    "principalName": "<FULL_NAME_OF_PRINCIPAL>",
    "agentName": "<FULL_NAME_OF_AGENT>",
    "authorityGrantedSummary": "<BRIEF_SUMMARY_OF_AUTHORITY_GRANTED>",
    "durationInDays": "<NUMBER_OF_DAYS_POA_IS_VALID_OR_0_FOR_DURABLE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Power of Attorney]

POWER OF ATTORNEY

I, [Principal Name], residing at [Principal Address], born on [Date of Birth of Principal], hereby appoint [Agent Name], residing at [Agent Address], born on [Date of Birth of Agent], as my true and lawful attorney-in-fact (my "Agent").

My Agent is hereby granted the following powers and authority to act on my behalf:

[Clearly and specifically describe the powers granted. This can be general or specific. Examples:

*   **General Powers:** "To do and perform all and every act, deed, matter, and thing whatsoever, in and about my estate, property, and affairs, as fully and effectually as I myself could do if personally present."
*   **Specific Powers (select all that apply and provide details):
    *   **Financial Matters:** To manage all my bank accounts, investments, and financial affairs; to buy, sell, or lease real estate; to collect debts; to pay bills; to file tax returns.
    *   **Healthcare Decisions:** To make decisions regarding my medical care, treatment, and hospitalization; to access my medical records.
    *   **Legal Matters:** To institute or defend legal proceedings; to settle claims; to engage legal counsel.
    *   **Business Operations:** To operate, manage, and conduct any business in which I have an interest.
    *   **Digital Assets:** To manage my digital assets, including cryptocurrency accounts, online platforms, and digital identities.
    *   **Specific Transaction:** To execute the sale of the property located at [Property Address] for a price not less than [Amount].]

This Power of Attorney shall be [select one]:

*   **Durable:** This Power of Attorney shall not be affected by my subsequent disability or incapacity, or by the passage of time.
*   **Non-Durable:** This Power of Attorney shall terminate upon my disability or incapacity.

This Power of Attorney shall become effective on [Effective Date] and shall remain in full force and effect until [End Date or event, e.g., "my death", "revocation by me", "[Number] days from the Effective Date"].

I reserve the right to revoke this Power of Attorney at any time by providing written notice to my Agent.

IN WITNESS WHEREOF, I have executed this Power of Attorney as of the date first written above.

[Principal Signature Block]
[Principal Printed Name]

WITNESSES (if required by jurisdiction):

[Witness 1 Signature Block]
[Witness 1 Printed Name]

[Witness 2 Signature Block]
[Witness 2 Printed Name]

NOTARY ACKNOWLEDGMENT (if required by jurisdiction):

State of [State]
County of [County]

On this [Day] day of [Month], [Year], before me, a Notary Public in and for said County and State, personally appeared [Principal Name], known to me to be the person whose name is subscribed to the foregoing instrument, and acknowledged that he/she executed the same for the purposes therein contained.

IN WITNESS WHEREOF, I have hereunto set my hand and official seal.

[Notary Public Signature]
[Notary Public Printed Name]
My Commission Expires: [Date]
```

## Signing Guidance

The `principal` party should sign the EIP-712 message using their Ethereum wallet to grant the authority. The `agent` party may also sign to acknowledge acceptance of the granted authority. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Power of Attorney. The `principalName`, `agentName`, `authorityGrantedSummary`, and `durationInDays` fields should accurately reflect the terms of the power of attorney. Both parties' details are crucial for verification and should be accurately represented in the `parties` array. Depending on jurisdiction, witnesses and notary acknowledgment may be required in the off-chain document, but their signatures are not directly part of the EIP-712 message unless they are also considered parties with a defined role in the on-chain verifiable data. The primary verifiable signature is from the principal.

