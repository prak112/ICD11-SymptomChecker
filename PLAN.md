# Symptom Checker and Triage System

## Overview
The Symptom Checker and Triage System aims to assist users in assessing their symptoms and providing appropriate recommendations. 

Users input their symptoms, and the system analyzes the data to suggest potential diagnoses and recommend appropriate actions (e.g., self-care, urgent care, or emergency room visits).


## Contents
- [Project Implementation Phases](#project-implementation-phases)
- [Application Implementation phases](#application-implementation-phases)
- [Credits](#credits)

<hr>

### Data Sources
- [ICD 11](https://icd.who.int/en) - WHO's medical classification list for diseases and a wide variety of signs, symptoms, abnormal findings, etc.
	- [ICD 11 API ](https://icd.who.int/icdapi) usage is restricted non-commercial purposes only and free to use.

	<hr>
	
	| Aspect	   	| 	Description                         |
	|---------------|----------------------------------------|
	| Availability 	| ICD-11 API is freely accessible, but it is not open source.  |
	| Documentation	| [API Documentation](https://icd.who.int/docs/icd-api/APIDoc-Version2/)    |
	| Reference API | [Swagger API](https://id.who.int/swagger/index.html) |
	| Examples 		| [ICD API samples - GitHub](https://github.com/icd-api) | 
	| License      	| API is available for non-commercial use under specific terms and conditions set by WHO |
	| Local Deployment	| [Docker container as Windows service](https://icd.who.int/docs/icd-api/ICDAPI-LocalDeployment/) |
	| Access 		| Via registration only |
	|||

<br>
<hr>

### Existing Symptom Checker resources
- Applications:
	- [WebMD Symptom Checker](https://symptoms.webmd.com/)
- API:
	- [Infermedica Engine API](https://developer.infermedica.com/documentation/engine-api/)


<br>
<hr>

## Project Implementation Phases

### 1. Front End (React)
- Create a React application for the user interface.
- Implement a symptom input form where users can describe their symptoms (e.g., fever, headache, cough).
- Design an intuitive user interface that guides users through the symptom-checking process.
- Display relevant information based on the user’s input (e.g., potential diagnoses, severity levels).

### 2. Back End (Express and Node.js)
- Set up an Express server to handle HTTP requests.
- Define routes for symptom input, symptom analysis, and recommendations.
- Use MongoDB (or another database) to store symptom data and related information (symptoms, diagnoses, recommended actions).
- Implement user authentication (e.g., OAuth, JWT) to secure user data and ensure privacy.

### 3. Symptom Analysis Logic
- Develop a symptom-to-diagnosis mapping based on medical knowledge. This can be a predefined set of rules or a machine learning model ( [Optional](#machine-learning-enhancement) )
- When a user submits symptoms, analyze the input against the symptom-to-diagnosis mapping.
- Rank potential diagnoses based on symptom severity and other relevant factors.
- Provide a list of likely diagnoses along with additional information (e.g., symptoms associated with each diagnosis).

### 4. Recommendations and Triage
- Based on the diagnosis, recommend appropriate actions:
	- Self-care advice (e.g., rest, hydration, over-the-counter medications).
	- Urgent care (e.g., visit a nearby clinic).
	- Emergency room (e.g., severe symptoms, potential life-threatening conditions).
- Display clear instructions for each recommendation.

## User Experience and Ethical Considerations
- Ensure the system is user-friendly, accessible, and easy to understand.
- Display disclaimers about the limitations of the system (not a substitute for professional medical advice).
- Protect user privacy and comply with data protection regulations.
- [ IF Optional features implemented ] Regularly update the symptom-to-diagnosis mapping and ML model to improve accuracy.


### OPTIONAL Features
1. *External APIs* 
- Integrate Application with external APIs (e.g., Google Maps for nearby healthcare facilities) for advanced recommendation for treatment at nearby health centers.

2. *Machine Learning Enhancement*
- To advance the system by incorporating machine learning:
	- Data Collection: Gather historical symptom data, diagnoses, and outcomes (e.g., recovery, hospitalization).
	- Feature Engineering: Extract relevant features from symptom descriptions (e.g., keywords, severity).
	- Model Selection:
		- Rule-Based Models: Create rules based on medical guidelines (e.g., if fever and cough, consider flu).
		- NLP Models: Train natural language processing (NLP) models (e.g., LSTM, BERT) to understand symptom context.
		- Ensemble Models: Combine rule-based and ML models for better accuracy.
	- Training and Evaluation: Train the model using labeled data and evaluate its performance (precision, recall, F1-score).
	- Integration: Integrate the ML model into the symptom analysis process.

[Back To Contents](#contents)

<br>
<hr>

## Application Implementation Phases
1. **Design**
	- Design inspiration for 'Home' page from [WebMD Symptom Checker](https://symptoms.webmd.com/)
	- [X] Login page
	- [X] Home page
	- [X] Signup page
	- [ ] User profile page
	- [ ] Admin page

2. **Frontend Setup**
	- [ ] **Test ICD API :** Generate test output with mock input data (symptoms)	
	- [ ] **Setup React :** Implement designed webpages using `Vite` as Build Tool
	- [ ] **Integrate UI Design :** Implement the UI designs and components. 
	- [ ] **API Integration :** Connect the frontend to the backend APIs using Axios or Fetch.

3. **Backend Setup**	
	- [ ] **Set up MongoDB :** Install MongoDB and define the database schema
	- [ ] **Set up Express.js :** Create RESTful APIs for handling CRUD operations.
	- [ ] **Implement Authentication :** Incorporate user authentication and authorization mechanisms.

4. **Concurrent Development**
	- [ ] **Concurrently Develop Features :** Work on both frontend and backend simultaneously, ensuring alignment with project requirements. 
	- [ ] **Testing :** Perform unit tests, integration tests, and end-to-end tests for each module.

5. **Deployment**	
	- [ ] Locally ensure Frontend and Backend functionality alignment through tests
	- [ ] Deploy Frontend as a production build 
	- [ ] Deploy backend as a deployed repository on Render 
	- **REASON** : 
		- Straightforward and efficient deployment strategy. 
		- Allows for easy scalability, reliability, and management of both frontend and backend components separately while ensuring smooth integration between them.

## **Reason** for defined Implementation Phases
- This approach allows to establish a robust foundation for data management and API development before integrating the frontend components.

<br>
<hr>

# Credits
- Planning Assistance :  *ChatGPT* (GPT 3.5)
- Development Assistance : *GitHub CoPilot*

<hr>