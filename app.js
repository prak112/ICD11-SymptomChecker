/**
 * Objective: Prototype local app to access and request ICD API for data on flu symptoms
 * GOAL #1: Access ICD API
 * GOAL #2: Send request with symptoms and receive data 
    * API Call references
    * Broader results list - /icd/release/11/{releasId}/{linearizationName}/search
    * Narrowed down result - /icd/release/11/2024-01/mms/autocode?searchText=sore%20throat&matchThreshold=0.75
 * GOAL #3: Deduce data and log text in user-readable format
    * Use 'foundationURI' from  Narrowed down result
    * API call - /icd/release/11/2024-01/mms/lookup?foundationUri=http%3A%2F%2Fid.who.int%2Ficd%2Fentity%2F633724732
    * response includes 'browserUrl', 'title', 'definition', 
    * other possible conditions list - 'exclusion', 'indexTerm'
**/

// imports
const middleware = require('./middleware')

// Goal #1 : Setup ICD API access
// ICD API authentication to OAUTH 2.0 Token Endpoint (token from API for access)
const tokenEndpoint = 'https://icdaccessmanagement.who.int/connect/token'
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
console.log('Credentials loaded')


// collect payload data as 'payload'
const payload = {
    'client_id': clientId,
    'client_secret': clientSecret,
    'scope': 'icdapi_access',
    'grant_type': 'client_credentials'
}

// convert payload to URL-encoded format
const requestBody = Object.keys(payload)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]))
    .join('&')
console.log('Payload URL-encoded')

// setup request options for fetching token
const tokenOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: requestBody
}
console.log('Options set');


// Goal #2: Send request with symptoms and receive data
// Foundation Model : https://icd.who.int/browse/2024-01/foundation/en#448895267

// access middleware to authenticate access and setup scheduled token update
const getTokenAndData = async() => {
    const token = await middleware.authenticateApiAccess(tokenEndpoint, tokenOptions)

    console.log('Fetching token...');
    console.log('Token: ', token)
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'API-Version': 'v2',
            'Accept-Language': 'en',
            'Accept': 'application/json'
        }
    }
    // search API for symptom
    const searchUrl = 'https://id.who.int/icd/release/11/2024-01/mms/autocode'
    const symptom = 'sore throat'

    // Broader results list - /icd/release/11/{releaseId}/{linearizationName}/search
    // const searchParams = {
    //     q: symptom,
    //     useFlexiSearch: 'false',
    //     flatResults: 'true',
    //     subtreeFilterUsesFoundationDescendants: 'false',
    //     includeKeywordResult: 'true',
    //     medicalCodingMode: 'true',
    // // valid values: "Title", "Synonym", "NarrowerTerm", "FullySpecifiedName", "Definition", "Exclusion" 
    // // More than one property could be used with "," as the separator.
    //     propertiesToBeSearched: 'IndexTerm',
    //     highlightingEnabled: 'true'
    // } 


    // Narrowed down result - /icd/release/11/2024-01/mms/autocode
    const searchParams = {
        searchText: symptom,
        matchThreshold: 0.75 
    }
    
    // construct query string for URI
    const searchString = new URLSearchParams(searchParams)

    // setup search request to endpoint
    const searchEndpoint = `${searchUrl}?${searchString}`
    const searchResponse = await fetch(searchEndpoint, requestOptions)
    console.log(`\nStatus ${requestOptions.method} ${searchUrl} :\n${searchResponse.status}`)

// GOAL #3: Extract data and display in user-readable and understandable format
    // extract data from search results
    const searchData = await searchResponse.json()

    // Narrowed down result - /icd/release/11/2024-01/mms/autocode
    console.log(`\nSearched for: ${searchData.searchText}
    Results : ${searchData.matchingText}
    ICD code: ${searchData.theCode}
    Foundation URI: ${searchData.foundationURI}
    Relevancy Score: ${searchData.matchScore}
    \n`)

    // lookup foundationURI - /icd/release/11/2024-01/mms/lookup?foundationUri=http%3A%2F%2Fid.who.int%2Ficd%2Fentity%2F633724732
    const lookupUrl = 'https://id.who.int/icd/release/11/2024-01/mms/lookup'
    const lookupParams = { 
        foundationUri: searchData.foundationURI
    }
    const lookupString = new URLSearchParams(lookupParams)

    const lookupEndpoint = `${lookupUrl}?${lookupString}`
    const lookupResponse = await fetch(lookupEndpoint, requestOptions)
    const lookupData = await lookupResponse.json()
    
    // extract 'browserUrl','title','definition','exclusion','indexTerm'
    const diagnosisData = {
        browserUrl: lookupData.browserUrl,
        diagnosedCondition: lookupData.title["@value"],
        generalDetails: lookupData.definition["@value"],
        possibleConditions: lookupData.indexTerm.map(term => term.label["@value"]),
        excludedConditions: lookupData.exclusion.map(entity => entity.label["@value"])
    };

    console.log(`\nVisit ICD WHO website for more info : ${diagnosisData.browserUrl}
    Diagnosed condition : ${diagnosisData.diagnosedCondition}
    General details : ${diagnosisData.generalDetails}
    \n`);

    for (let term of diagnosisData.possibleConditions) {
        console.log('Possible Conditions : ', term);
    }

    for (let entity of diagnosisData.excludedConditions) {
        console.log('Excluded Conditions : ', entity);
    }

    // Broader results list- /icd/release/11/{releasId}/{linearizationName}/search
    // for(word of searchData.words){
    //     console.log('Possible Condition:', word.label )
    // }
    // for(entity of searchData.destinationEntities){
    //     if(entity.score > 0.75){
    //         console.log(`Title: ${entity.title}\n
    //             ICD code: ${entity.theCode}\n
    //             Score: ${entity.score}`)
    //     }
    // }
    // check 'words', 'destinationEntities'
    // 'destinationEntities'-'title', 'theCode', 'score' 
    // 'destinationEntities'-'matchingPVs' sometimes have multiple items
}
getTokenAndData()
