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

<hr>
<br>

# User-Application Interaction
```mermaid
sequenceDiagram
    participant USER
    participant APP

    USER ->>+APP: User input Symptoms - "cough and fever"
    APP ->>+USER: Display Search results - e.g., "Common Cold", "Influenza"
    USER->>+APP: User selects - "Common Cold"
    APP->>+USER: Display detailed information - symptoms, treatment options, related conditions.
```

<hr>
<br>

# Database Scehema
- Database Schema represented in Class Diagram

```mermaid
classDiagram
    class User {
        +String username
        +String passwordHash
        +List~ObjectId~ diagnosis
    }

    class Diagnosis {
        +List~DiagnosisData~ diagnosis
        +ObjectId user
    }

    class DiagnosisData {
        +String symptom
        +TopResult topResult
        +OtherResults includedResults
        +OtherResults excludedResults
    }

    class TopResult {
        +String label
        +Number score
        +String title
        +String detail
        +String url
    }

    class OtherResults {
        +List~String~ label
        +List~Number~ score
        +List~String~ url
    }

    User --> Diagnosis : diagnosis
    Diagnosis --> User : user
    Diagnosis --> DiagnosisData : diagnosis
    DiagnosisData --> TopResult : topResult
    DiagnosisData --> OtherResults : includedResults
    DiagnosisData --> OtherResults : excludedResults

```

  <hr>
  <br>

# Application Workflow
```mermaid
sequenceDiagram
    box Blue CLIENT
    participant UI
    participant FRONTEND
    end

    box Purple SERVER
    participant BACKEND
    participant ICD11 API
    participant DATABASE
    end

    critical Establish Database connection
        BACKEND-->DATABASE: Mongoose ODM connects to MongoDB
    option Network Timeout
        BACKEND-->BACKEND: Log Timeout Error
    option MongoDB Error
        BACKEND-->BACKEND: Log Validation Error
    end
    critical Authorize ICD API Access
        loop Scheduled Renewal of Auth Token every hour
            BACKEND->>+ICD11 API: Auth Controller : POST /token-endpoint/client-credentials
            ICD11 API-->>-BACKEND: Auth Token : Bearer, 3600 seconds validity
        end
    option Network Timeout
        BACKEND-->BACKEND: Log Timeout Error
    option API Error
        BACKEND-->BACKEND: Log Server Error    
    end

    UI->>+FRONTEND: User opens application
    FRONTEND-->>-UI: ReactJS : render <App />

    UI->>+FRONTEND: Auth : User registers from <Sidebar />
    FRONTEND-->>-UI: React Router : render <Signup /> modal
    alt Registration Valid
        UI->>+FRONTEND: Auth: User inputs information
        Note over FRONTEND: <Signup /> validation - PASSED
        FRONTEND->>+BACKEND: Auth Service : POST /public/auth/signup
        Note over BACKEND: Backend-Database validation - PASSED
        BACKEND-->+DATABASE: Auth Controller : User Information {username: '', passwordHash: ''}
        DATABASE-->>-BACKEND: Database Server : User {username: '', symptom: [] }   
        BACKEND-->>-FRONTEND: Auth Controller : return User {username: '', symptom: []}
        Note over FRONTEND: <AlertProvider /> state success
        FRONTEND-->>-UI: React Router : redirect to <Login /> modal
    else Frontend Validation Error
        UI->>+FRONTEND: Auth: User inputs information
        Note over FRONTEND: <Signup /> validation - FAILED
        Note over FRONTEND: <AlertProvider /> state error
        FRONTEND-->>-UI: Alert Context : <AlertProvider /> show notification banner
    else Backend-Database Validation Error
        UI->>+FRONTEND: Auth: User inputs information
        Note over FRONTEND: <Signup /> validation - PASSED
        FRONTEND->>+BACKEND: Auth Service : POST /public/auth/signup
        Note over BACKEND: Backend-Database validation - FAILED
        BACKEND-->>-FRONTEND: Auth Controller : ErrorHandler forwards response
        FRONTEND-->>-UI: Alert Context : <AlertProvider /> show notification banner
    end
    alt Valid Login
        UI->>+FRONTEND: Auth : User enters login credentials
        Note over FRONTEND: <Login /> validation - PASSED
        FRONTEND->>+BACKEND: Auth Service : POST /public/auth/login
        Note over BACKEND: Backend-Database validation - PASSED
        BACKEND->>+DATABASE: Auth Controller : verify User login credentials
        DATABASE-->>-BACKEND: Database Server : User exists
        BACKEND-->>-FRONTEND: Auth Controller : sessionStorage created<br>'auth_token' packed in Request Header
        Note over FRONTEND: <AlertProvider /> state success
        Note over FRONTEND: <AlertProvider /> show notification banner
        FRONTEND-->>-UI: User Context : User-specific session created
    else Frontend Validation Error
        UI->>+FRONTEND: Auth: User inputs information
        Note over FRONTEND: <Login /> validation - FAILED
        Note over FRONTEND: <AlertProvider /> state error
        FRONTEND-->>-UI: Alert Context : <AlertProvider /> show notification banner
    else Backend-Database Validation Error
        UI->>+FRONTEND: Auth: User inputs information
        Note over FRONTEND: <Login /> validation - PASSED
        FRONTEND->>+BACKEND: Auth Service : POST /public/auth/login
        BACKEND->>+DATABASE: Auth Controller : verify User Information {username: '', password: ''}
        DATABASE-->>-BACKEND: Auth Controller : User does not exist
        Note over BACKEND: Backend-Database validation - FAILED
        BACKEND-->>-FRONTEND: Auth Controller : ErrorHandler forwards response
        Note over FRONTEND: <AlertProvider /> state error
        FRONTEND-->>-UI: Alert Context : <AlertProvider /> shows notification banner
    end

    alt Valid Input <SymptomForm /> and General search
        UI->>+FRONTEND: Search symptoms for broad diagnosis spectrum
        Note over FRONTEND: <SymptomForm /> validation - PASSED
        FRONTEND->>+BACKEND: POST /api/protected/symptoms/general
            Note over BACKEND: Sanitize and Validate User input
            loop Search request for each symptom  
                BACKEND->>+ICD11 API: SymptomChecker Controller : GET /icd/release/11/2024-01/mms/search
                ICD11 API-->>-BACKEND: External Server : multiple search results {}<br> {'label': [''], 'score': [''], 'foundationUri': ['']}
                loop Lookup request for each foundationUri 
                    BACKEND->>+ICD11 API: SymptomChecker Controller : GET /icd/release/11/2024-01/mms/lookup 
                    ICD11 API-->>-BACKEND: External Server : lookup results {}<br>locate {'title': '', 'definition': '', 'browserUrl': ''}
                end
            end
            BACKEND-->>-FRONTEND: SymptomChecker Controller: diagnosisData {'topResult': {}, 'includedResults': {}, 'excludedResults': {}}
            par
                BACKEND->>+DATABASE: SymptomChecker Controller : encrypt and store symptoms, diagnosisData
            and
                FRONTEND-->>-UI: <SymptomForm /> render diagnosisData
            end
    else Valid Input <SymptomForm /> and Specific search
        UI->>+FRONTEND: Search symptoms for narrow diagnosis spectrum
        Note over FRONTEND: <SymptomForm /> validation - PASSED
        FRONTEND->>+BACKEND: POST /api/protected/symptoms/specific
        Note over BACKEND: Sanitize and Validate User input 
        loop GET request for each symptom   
            BACKEND->>+ICD11 API: SymptomChecker Controller : GET /icd/release/11/2024-01/mms/autocode
            ICD11 API-->>-BACKEND: External Server : single search result {}<br>locate {'label': '', 'score': '', 'foundationUri': ''} 
            BACKEND->>+ICD11 API: SymptomChecker Controller : GET /icd/release/11/2024-01/mms/lookup 
            ICD11 API-->>-BACKEND: External Server : lookup results {}<br>locate {'title': '', 'definition': '', 'browserUrl': ''}
        end
        BACKEND-->>-FRONTEND: SymptomChecker Controller: diagnosisData {'topResult': {}, 'includedResults': {}, 'excludedResults': {}}
        par
            BACKEND->>+DATABASE: SymptomChecker Controller : encrypt and store symptoms, diagnosisData
        and
            FRONTEND-->>-UI: <SymptomForm /> render diagnosisData
        end
    else No Input <SymptomForm />
        UI->>+FRONTEND: User : User clicks 'Diagnose' without input
        Note over FRONTEND: <SymptomForm /> validation - FAILED
        FRONTEND-->>-UI: prompt User to fill form
    end
    UI->>+FRONTEND: Auth : User logs out from <Sidebar />
    FRONTEND-->>-UI: Auth : <Logout /> modal asks confirmation
    alt User confirms Logout
        UI->>+FRONTEND: Auth : User confirms logout
        FRONTEND-->>-UI: User Context : sessionStorage cleared, User redirected to <App />
    else User cancels Logout
        UI->>+FRONTEND: Auth : User cancels logout
        FRONTEND-->>-UI: Auth : User redirected to <App />
    end
```

<hr>
<hr>
<br>
