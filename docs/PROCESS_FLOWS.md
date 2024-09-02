# Symptom Analysis Logic

## Data Processing Steps
1. Symptom Input Processing
    - Normalize and sanitize user input to ensure it is suitable for querying the API.

2. Search Result Processing
    - Parse the JSON response from the ICD API to extract relevant fields like code and term.
    - Rank or filter results based on relevance to the input symptoms.

3. Detailed Information Processing
    - Parse the detailed response JSON to extract comprehensive information about the condition.
    - Format the information for clear presentation to the user.

<br>
<hr>

## User-Application Interaction
```mermaid
sequenceDiagram
    participant USER
    participant APP

    USER ->>+APP: User input Symptoms - "cough and fever"
    APP ->>+USER: Display Search results - e.g., "Common Cold (J00)", "Influenza (J10)"
    USER->>+APP: User selects - "Common Cold (J00)"
    APP->>+USER: Display detailed information - symptoms, treatment options, related conditions.
```

<hr>
<br>


# Frontend-Backend Interaction



<hr>
<br>


# ICD API Requests Flow
```mermaid
sequenceDiagram
    participant FRONTEND
    participant BACKEND
    participant ICD11 API

    FRONTEND->>+BACKEND: User input-symptom data 
    BACKEND->>+ICD11 API: Token Endpoint - `https://icdaccessmanagement.who.int/connect/token`
    ICD11 API-->>-BACKEND: Result - Bearer token, expires_in 3600 seconds
    BACKEND->>+ICD11 API: User input, Search Endpoint - `/icd/release/11/2024-01/mms/autocode`
    ICD11 API-->>-BACKEND: Result - matchingText, ICD code, foundation URI
    BACKEND->>+ICD11 API: Lookup foundation URI, Lookup Endpoint - `/icd/release/11/2024-01/mms/lookup`
    ICD11 API-->>-BACKEND: Result - info URL, condition details, related conditions
    BACKEND->>-FRONTEND: Display-process extracted data
```

<hr>
<br>
