# Online Star Registry

This is an online star registry based on blockchain technology. 
Using this app, an owner can claim ownership of theie favorite start in any galaxy

The application allows users to request ownership of a star and validate their rrequest to grant ownership of a star.


## Requirement

    * node v8.12.0
    * crypto-js v3.1.9-1
    * hapi v17.6.0
    * level v4.0.0
    * bitcoinjs-message": "^2.0.0


## APIs

###- Request Validation
Allows users to submit their request using their wallet address. The API acceptd a blockchain ID (wallet address). User will receive a response in JSON format with a message to sign.This will create a session for a wallet ID, the session remains valid for 5 minutes. Users are expected to sign the message property of the JSON response.  

* **Endpoint:**

    *http://localhost:8000/requestValidation*  

    **Request Payload:** 
    The body is JSON object with the below properties  
    * **address:** Wallet address of the user (required)

    **Response Paylod:**
    The response is a JSON object with the below properties
    * **address:**  Wallet address of the requestor
    * **requestTimeStamp:** Time the request was submitted
    * **message:** Message to by signed and verified by the user
    * **validationWindow:** Time remaining to complete the validation and star registration 

* **Example using CURL**
    
    **Request:**

        curl -X POST http://localhost:8000/requestValidation^;    
             -H "Content-Type:application/json"^     
             -d "{\""address\"" : \""189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx\""}"

    **Reponse:**

        {
            "address":"189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx",  
            "requestTimeStamp":"1541450653",  
            "message":"189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx:1541450653:starRegistry",  
            "validationWindow":300  
        }


###- Validate Signature

Use this API to validate user signature after session is established. Once the signature is validated, user will be granted access to register their favorite star.

* **Endpoint:** 
    
    *http://localhost:8000/message-signature/validate*

    **Request Payload:** 
    The request is a JSON object with the following properties
    * **address:** Wallet address of the requester (required)
    * **signature:** Public key for the sent wallet address (required)

    **Response Payload:**
    The response is a JSON object with the below properties
    * **registerStar:**  Flag that suggest if the user is granted access to register a star.
    * **status:** JSON object with the user information such as address, requested timestamp, message signed by the used and encoded, time remaining for registration and a flag which suggests if the signature is valid
 
* **Example using CURL:**

    Request:

        curl -X POST http://localhost:8000/message-signature/validate^  
             -H "Content-Type:application/json"^  
             -d "{\"address\" : \"189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx\", \"signature\" : \"H4fJeb5bRrUm+Lxrs8K79gbfs2r3iUZl+u24bqdINl04QtrqoMlRFF6ZpJ895PmuCOQVIJSgBcz25uD5lMaTTkA=\"}"

    Response:

###- Star Registration
Use this API to register a star. Use will provide the coordinates of the star and a short story. Story must contain ASCII charaters only and should be less than 500 bytes. 

* **Endpoint:**  

 _http://localhost:8000/block_

    **Request Payload:** 
    The request is a JSON object with the following properties
    * **address:** Wallet address of the requester (required)
    * **star:** JSON object that contains information about the star (required)
        - **dec:** declination (required)
        - **ra:** right ascension (required)
        - **cen** centaurus (optional)
        - **mag** magnitude (optional)
        - **story** brief story containing ASCII charaters limited to 250 words

    **Response Payload:**

    The response is a JSON object giving information of the block stored on blockchain
    * **hash:**  Block Hash.
    * **height:** Block Height.
    * **body:** Payload sent by the user, star story will hex encoded ASCII string limited to 500 bytes
    * **time:** Time the block was added
    * **previousBlockHash:** Hash of the previous block

* **Example using CURL**
    - **Request:**    
    
            curl -X POST http://localhost:8000/block^    
                 -H "Content-Type:application/json"^  
                 -d "{\""address\"": "189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx\"",\""star\"": {\""dec\"": \""-26° 29' 24.9\"",\""ra\"": \""16h 29m 1.0s\"",\""story\"": \""Found star using https://www.google.com/sky/\""}}  
        
    - **Response:**

            {  
                "height": 1,  
                "hash": "63eedc827c513347200991743a3d50271ab874014687d1ca09fe56242638c7e3",  
                "body": {  
                    "address": "189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx",  
                    "star": {  
                        "dec": "-26° 29' 24.9",  
                        "ra": "16h 29m 1.0s",  
                        "story": "22466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f22"  
                    }  
                },  
                "time": "1541475983",  
                "previousBlockHash":  "84aeba9d4c0fe5a9f6e8a742bda9ee5664371062e0c18588a95e5d231563da86"  
            }  

###- Search by Blockchain Wallet Address

Look for stars registered by a specific user using their wallet address 

* **Endpoint:**    

    *http://localhost:8000/stars/address:[ADDRESS]*     
* **Request Parameter:**   

    URL contains mandatory parameter [ADDRESS] 
* **Response Payload:**   

    Response is a JSON object with all the stars registered by the address.    

* **Example using CURL**
    - **Request:**  
    
            curl "http://localhost:8000/stars/address:189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx"

    - **Response:**    
    
            [
                {
                    "height": 1,
                    "hash": "63eedc827c513347200991743a3d50271ab874014687d1ca09fe56242638c7e3",
                    "body": {
                        "address": "189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx",
                        "star": {
                            "dec": "-26° 29' 24.9",
                            "ra": "16h 29m 1.0s",
                            "story": "22466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f22"
                        }
                    },
                    "time": "1541475983",
                    "previousBlockHash": "84aeba9d4c0fe5a9f6e8a742bda9ee5664371062e0c18588a95e5d231563da86"
                },
                {
                    "height": 3,
                    "hash": "af7cbcc2c928944691ed6e5fd5e8f6ed595f5d8f7c035f3086277d3a82a862c7",
                    "body": {
                        "address": "189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx",
                        "star": {
                            "dec": "-46° 29' 24.9",
                            "ra": "24h 29m 1.0s",
                            "story": "2268747470733a2f2f696e2d7468652d736b792e6f72672f736b796d61702e70687022"
                        }
                    },
                    "time": "1541480293",
                    "previousBlockHash": "4d5ae63d77748913bf2f705a6c28170e3ac7f9ed5fffa9d739635111ef603cbf"
                }
            ]    

###- Search by Star Block Hash
Look for stars using a block hash.  

* **Endpoint:**     

    http://localhost:8000/stars/hash:[HASH]  
* **Request Payload:**  

    URL parameter with star block hash.  
* **Response Payload:** 

    Star block hash JSON Response.  

* **Example using CURL**
    - **Request:**
    
            curl "http://localhost:8000/stars/hash:63eedc827c513347200991743a3d50271ab874014687d1ca09fe56242638c7e3"
    - **Response:** 
        
            {
                "height": 1,
                "hash": "63eedc827c513347200991743a3d50271ab874014687d1ca09fe56242638c7e3",
                "body": {
                    "address": "189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx",
                    "star": {
                        "dec": "-26° 29' 24.9",
                        "ra": "16h 29m 1.0s",
                        "story": "22466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f22"
                    }
                },
                "time": "1541475983",
                "previousBlockHash": "84aeba9d4c0fe5a9f6e8a742bda9ee5664371062e0c18588a95e5d231563da86"
            }  

###- Search by Star Block Height
Look up stars using block height.

* **Endpoint:**      
 
    http://localhost:8000/block/[HEIGHT]  

* **Request Parameter:**   

    URL parameter with block height.  
* **Response Payload:**  

    Star block hash JSON Response.  

* **Example using CURL**
    - **Request:**  
    
            curl "http://localhost:8000/block/1"  

    - **Response:** 
    
            {
                "height": 1,
                "hash": "63eedc827c513347200991743a3d50271ab874014687d1ca09fe56242638c7e3",
                "body": {
                    "address": "189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx",
                    "star": {
                        "dec": "-26° 29' 24.9",
                        "ra": "16h 29m 1.0s",
                        "story": "22466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f22"
                    }
                },
                "time": "1541475983",
                "previousBlockHash": "84aeba9d4c0fe5a9f6e8a742bda9ee5664371062e0c18588a95e5d231563da86"
            }  