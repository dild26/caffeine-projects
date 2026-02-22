# SECOINFI AI Voice Assistant - Quick Start Guide

This guide provides quick instructions to get started with the SECOINFI AI Voice Assistant.

## 1. Access the Application

- **Frontend Application (User Interface)**: `https://bpwwlqhp.manus.space`
- **Backend API (for developers/integrations)**: `https://19hninclyd6o.manus.space/api`

## 2. Key Features & How to Use

### 2.1. Chat with Infy AI

- **Purpose**: Interact with Infy, your AI voice assistant, to get information about SECOINFI, blockchain, and domain analysis.
- **How to Use**:
    1.  Go to the **Chat with Infy** tab on the frontend.
    2.  Type your question in the input field (e.g., "What is SECOINFI?" or "How does domain analysis work?").
    3.  Click the **Send** button or press Enter.
    4.  (Optional) Click the microphone icon to use voice input.

### 2.2. Domain Analysis

- **Purpose**: Analyze domain ranking, sitemap, indexing, and other SEO metrics.
- **How to Use**:
    1.  Go to the **Domain Analysis** tab.
    2.  Select the desired **Protocol** from the dropdown (e.g., `https://`, `http://www.`).
    3.  Enter the **Domain Name** (e.g., `seco.in.net`).
    4.  Click the **Analyze Domain** button.
    5.  View the analysis results displayed on the right side.

### 2.3. Bulk Domain Upload

- **Purpose**: Upload multiple domains for batch analysis via JSON or CSV files.
- **How to Use**:
    1.  Go to the **Bulk Upload** tab.
    2.  Select the **File Type** (JSON or CSV).
    3.  Paste your domain data into the **Domain Data** text area.
        - **JSON Format Example**:
            ```json
            [
              {"domain": "example.com", "protocol": "https://"},
              {"domain": "test.org", "protocol": "http://"}
            ]
            ```
        - **CSV Format Example**:
            ```
            example.com,https://
            test.org,http://
            ```
    4.  Click the **Upload Domains** button.

### 2.4. Admin Panel

- **Purpose**: Access administrative features and set up QR code authentication.
- **How to Use**:
    1.  Go to the **Admin Panel** tab.
    2.  Enter the **Authentication Code**: `SECOINFI2024`.
    3.  Click the **Authenticate** button.
    4.  Upon successful authentication, a QR code will be displayed. Scan this with your authenticator app (e.g., Google Authenticator, Authy) for future access.

## 3. Important Notes

- The backend API (`https://19hninclyd6o.manus.space/api`) is now fully functional with all database tables initialized and populated.
- The frontend application (`https://bpwwlqhp.manus.space`) is configured to communicate with this backend.
- If you encounter any issues, please refer to the `UPDATED_PROJECT_REPORT.md` for detailed information on fixes and implementations.




### 2.5. Text-to-Speech (TTS) for Infy AI Responses

- **Purpose**: Listen to Infy AI's responses spoken aloud.
- **How to Use**:
    1.  In the **Chat with Infy** tab, after Infy responds, a small speaker icon (🔊) will appear next to its message.
    2.  **Hover your mouse over this speaker icon** to hear the message spoken aloud.
    3.  Moving your mouse away from the icon will stop the playback.

