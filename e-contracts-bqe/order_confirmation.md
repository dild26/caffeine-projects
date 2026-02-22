# E-Contract Template: Order Confirmation

## Description

This template is for an Order Confirmation, which serves as a final acknowledgment of a placed order. It is designed to be compatible with the SigVerify system on the Ethereum blockchain, leveraging EIP-712 for structured data signing. The off-chain document content will contain the full details of the order confirmation, while the EIP-712 message will capture key verifiable metadata.

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
    "OrderConfirmation": [
      { "name": "contractType", "type": "string" },
      { "name": "contractTitle", "type": "string" },
      { "name": "contractHash", "type": "bytes32" },
      { "name": "effectiveDate", "type": "uint256" },
      { "name": "parties", "type": "Party[]" },
      { "name": "orderId", "type": "string" },
      { "name": "orderDate", "type": "uint256" },
      { "name": "totalAmount", "type": "uint256" },
      { "name": "currency", "type": "string" },
      { "name": "deliveryDate", "type": "uint256" }
    ]
  },
  "domain": {
    "name": "SigVerifyEContract",
    "version": "1",
    "chainId": "<CHAIN_ID>",
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "primaryType": "OrderConfirmation",
  "message": {
    "contractType": "OrderConfirmation",
    "contractTitle": "Order Confirmation for Order #[Order ID]",
    "contractHash": "<HASH_OF_OFF_CHAIN_DOCUMENT>",
    "effectiveDate": "<UNIX_TIMESTAMP_OF_EFFECTIVE_DATE>",
    "parties": [
      { "role": "seller", "ethereumAddress": "<SELLER_ADDRESS>", "name": "<SELLER_NAME>", "additionalInfo": "" },
      { "role": "buyer", "ethereumAddress": "<BUYER_ADDRESS>", "name": "<BUYER_NAME>", "additionalInfo": "" }
    ],
    "orderId": "<UNIQUE_ORDER_IDENTIFIER>",
    "orderDate": "<UNIX_TIMESTAMP_OF_ORDER_PLACEMENT>",
    "totalAmount": "<TOTAL_AMOUNT_OF_THE_ORDER>",
    "currency": "<CURRENCY_OF_THE_ORDER>",
    "deliveryDate": "<UNIX_TIMESTAMP_OF_EXPECTED_DELIVERY_DATE>"
  }
}
```

## Off-chain Document Content (Placeholder)

```
[Legal Text of the Order Confirmation]

ORDER CONFIRMATION

Date: [Date]

Order ID: [Unique Order Identifier]

Dear [Buyer Name],

Thank you for your order! This email confirms that your order with ID [Order ID] has been successfully placed and is being processed. Below are the details of your order:

**Order Details:**

*   **Order Date:** [Order Date]
*   **Seller:** [Seller Name/Company Name] (Ethereum Address: [Seller Ethereum Address])
*   **Buyer:** [Buyer Name/Company Name] (Ethereum Address: [Buyer Ethereum Address])

**Items Ordered:**

[List of items, including quantity, unit price, and total price for each item]

| Item Description | Quantity | Unit Price | Total Price |
| :--------------- | :------- | :--------- | :---------- |
| [Item 1 Name]    | [Qty 1]  | [Price 1]  | [Total 1]   |
| [Item 2 Name]    | [Qty 2]  | [Price 2]  | [Total 2]   |
| ...              | ...      | ...        | ...         |

**Summary of Charges:**

*   Subtotal: [Subtotal Amount] [Currency]
*   Shipping: [Shipping Cost] [Currency]
*   Tax: [Tax Amount] [Currency]
*   **Total Amount:** [Total Amount] [Currency]

**Payment Method:** [Payment Method, e.g., "Credit Card", "Bank Transfer", "Cryptocurrency"]

**Shipping Information:**

*   Shipping Address: [Buyer Shipping Address]
*   Expected Delivery Date: [Expected Delivery Date]

**Important Notes:**

[Any specific instructions, return policies, or warranty information.]

We will send you another notification once your order has been shipped.

Thank you for your business!

Sincerely,

[Seller Name/Company Name]
[Seller Contact Information]
```

## Signing Guidance

The `seller` party should sign the EIP-712 message using their Ethereum wallet to confirm the order. The `buyer` party may also sign to acknowledge receipt and acceptance of the order confirmation. The `contractHash` in the EIP-712 message must be the SHA-256 hash of the complete off-chain legal text of the Order Confirmation. The `orderId`, `orderDate`, `totalAmount`, `currency`, and `deliveryDate` fields should accurately reflect the key details of the order. Both parties' details are crucial for verification and should be accurately represented in the `parties` array.

