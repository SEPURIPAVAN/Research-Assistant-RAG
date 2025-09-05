# Document Q&A Chatbot API Documentation

### Introduction

This document provides the technical specification for the **Document Q&A Chatbot API**. It outlines the system workflow, core concepts, and provides a detailed guide to each available endpoint for frontend integration.

---

### Table of Contents

* **System Workflow**
* **Core Concepts**
* **API Endpoint Specification**
    * `POST /UploadFile`
    * `POST /chat`
    * `POST /get_chat_ids`
    * `POST /get_chat_by_id`
* **Reference Implementation**

---

### System Workflow

The application follows a structured process for document interaction:

1.  **Authentication**: A client-side Firebase login action generates a **Firebase ID Token** for the user session. This token is required for all subsequent authorized requests.
2.  **Document Ingestion**: The user uploads a PDF document via the designated API endpoint.
3.  **Session Initialization**: The backend processes the document, creates a persistent knowledge base, and generates a unique session identifier, the **chat_id**. This `chat_id` is returned to the client.
4.  **Query Submission**: The client sends a user-generated question, along with the corresponding `chat_id`, to the chat endpoint.
5.  **Response Generation**: The backend retrieves the session context, performs a semantic search on the document's knowledge base, generates a contextual answer, and returns it to the client. The query and response are appended to the session history.
6.  **History Retrieval**: The client can request a list of all `chat_ids` for an authenticated user or the full message history for a specific `chat_id`.

---

### Core Concepts

Two primary identifiers are used for managing application state:

* **Firebase ID Token**: A **JSON Web Token (JWT)** issued upon successful user authentication via the Firebase SDK. It must be transmitted in the `Authorization` header of authenticated requests using the **Bearer** scheme.

    * **Format**: `Authorization: Bearer <FIREBASE_ID_TOKEN>`

* **chat_id**: A unique server-generated string that identifies a specific chat session associated with a single uploaded document. It must be stored on the client and used for all interactions within that session.

---

### API Endpoint Specification

All endpoints listed below require the `Authorization` header as specified in the **Core Concepts** section.

#### `1. POST /UploadFile`

Initiates a new chat session by ingesting a PDF document.

* **Description**: Uploads a PDF, processes it into a vector store, and returns a new `chat_id`.
* **Authentication**: Required.
* **Request Format**: `multipart/form-data`. The request must contain a file part with the PDF document.
* **Success Response (200 OK)**:
    ```json
    {
      "msg": "File 'your_document.pdf' uploaded and chatbot initialized.",
      "chat_id": "server_generated_unique_chat_id"
    }
    ```

#### `2. POST /chat`

Submits a user query to an active chat session for a response.

* **Description**: Processes a question against the document associated with the `chat_id` and returns a generated answer.
* **Authentication**: Required.
* **Request Format**: `application/json`.
    ```json
    {
      "chat_id": "the_chat_id_for_the_current_session",
      "question": "A string containing the user's question."
    }
    ```
* **Success Response (200 OK)**:
    ```json
    {
      "answer": "A string containing the generated answer."
    }
    ```

#### `3. POST /get_chat_ids`

Retrieves all chat session identifiers associated with the authenticated user.

* **Description**: Returns a list of all `chat_ids` for the current user.
* **Authentication**: Required.
* **Request Format**: No request body is required.
* **Success Response (200 OK)**:
    ```json
    {
      "chat_ids": [
        "chat_id_1",
        "chat_id_2",
        "chat_id_3"
      ]
    }
    ```

#### `4. POST /get_chat_by_id`

Fetches the complete message history for a specified `chat_id`.

* **Description**: Retrieves the full, ordered conversation history for a given chat session.
* **Authentication**: Required.
* **Request Format**: The `chat_id` must be supplied as a URL query parameter.
* **Example**: `/get_chat_by_id?chat_id=<YOUR_CHAT_ID>`
* **Success Response (200 OK)**:
    ```json
    {
      "messages": [
        { "type": "human", "text": "First user message." },
        { "type": "ai", "text": "First AI response." },
        { "type": "human", "text": "Second user message." },
        { "type": "ai", "text": "Second AI response." }
      ]
    }
    ```

---

### Reference Implementation

A sample client implementation is provided in the `client.html` file. This file demonstrates the correct procedures for:

* Integrating the **Firebase Web SDK** for authentication.
* Retrieving and utilizing the **Firebase ID Token** for API requests.
* Constructing a `multipart/form-data` request for file uploads.
* Managing the `chat_id` state for a session.
* Displaying a conversation history.

The JavaScript within `client.html` serves as a functional reference for frontend integration.
