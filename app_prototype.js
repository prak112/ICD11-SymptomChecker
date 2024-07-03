/**
 * Objective: Prototype local app to access and request ICD API for data on flu symptoms
 * Goal #1: Access ICD API
 * Goal #2: Send request with symptoms and receive data (/icd/entity/search)
 * Goal #3: Deduce data and log text in user-readable format 
**/

// imports
const middleware = require('./middleware')

// Goal #1 : Setup ICD API access
// ICD API authentication to OAUTH 2.0 Token Endpoint (token from API for access to make requests)
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
// access middleware to authenticate access and setup scheduled token update
const getTokenAndData = async() => {
    const token = await middleware.authenticateApiAccess(tokenEndpoint, tokenOptions)

    console.log('Fetching token...');
    console.log('Token: ', token)
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'API-Version': 'v2',
            'Accept-Language': 'en',
            'Accept': 'application/json'
        }
    }
    // request ICD11 API - icd/entity/search
    const baseUrl = 'https://id.who.int/icd/entity/search'
    const symptom = 'running nose, heavy cough, high fever'
    const queryParams = {
        q: symptom,
        useFlexiSearch: 'true',
        flatResults: 'true',
// valid values: "Title", "Synonym", "NarrowerTerm", "FullySpecifiedName", "Definition", "Exclusion" 
// More than one property could be used with "," as the separator.
        propertiesToBeSearched: 'Definition',
        highlightingEnabled: 'true'
    }

    // construct query string for URI
    const queryString = new URLSearchParams(queryParams)
    
    // setup endpoint with baseUrl and queryString
    const requestEndpoint = `${baseUrl}?${queryString}`

    const response = await fetch(requestEndpoint, requestOptions)
    console.log('Status /icd/entity/search : \n', response.status)

    const data = await response.json()
    console.log(`${requestOptions.method} data /icd/entity/search : \n ${data.destinationEntities.length}`)
    // check 'destinationEntites' length
    // check 'matchingPVs[0].score' > -0.02
}
getTokenAndData()
