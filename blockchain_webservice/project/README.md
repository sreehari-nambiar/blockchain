# Private Blockchain with RESTful Web APIs

This is a simple blockchain application written using node.js. Blocks are persisted in LevelDB. 

Blockchain application consists of the below simple funtions
- createGenesisBlock
- getBlock
- getBlockHeight
- validateBlock
- validateChain

The application also has two RESTful APIs to get a particular block information and to add a new block. The APIs is based on Hapi.js

## Requirement

    * node v8.12.0
    * crypto-js v3.1.9-1
    * hapi v17.6.0
    * level v4.0.0


## API

####- GET block
* **Endpoint:**
    _http://localhost:8000/block/{height}_ 

* **Method:**
     `GET`
* **URL Params:**
    Specify the block number (height) you want to look up.

* **Example using postman:**
    - **Success:**
        
            **URL:** http://localhost:8000/block/8

            Response:

                {
                    "height": 8,
                    "hash": dbcf29b4c9cc0b5a86f7e5ad4fa8b87da685e8c3806f238e9670003751adaca6",
                    "body": "Test Block - 8",
                    "timestamp": "1540075424",
                    "previousBlockHash": "7020f24ff90a08b4b2b1c9fde5b4da893128a101ece7c4fc9202579a3af457a4"
                }


    - **Error:**
    
        URL: http://localhost:8000/block/8

        `Block 25 not found`

* **Example using CURL**
    * **Success:**
        curl http://localhost:8000/block/15

        Reponse:

        `{"height":15,"hash":"c792202e76a55ad94b6f106948889ee1fee4696600dd25c8a7fd9c761b3294d7","body":"check resubmission one more time","time":"1540242059","previousBlockHash":"6811b9aed72ba48039671790936ce0bed9831feb13689655b3de4f38dc9683ff"}`

    * **Error:** 
        curl http://localhost:8000/block/35

        Response:

        `Block 35 not found`

####- POST block
* **Endpoint:**
 _http://localhost:8000/block_

* **Method:**
`POST`

* **Data Params:** Specify the data you need to store in a block as the body

* **Example using Postman**
    - **Success:**
    
        Successful response is the JSON view of the block added.

        `{
            "height": 12,
            "hash": "5cfb60e39a247f53594e327a3a7ea7f39e4146d4fb55a5c5f3e1ba0ae7295bd7",
            "body": "Block Number 12. Added viz API",
            "timestamp": "1540176735",
            "previousBlockHash": "e55c5f73c16e8b5ab9535b75d577c946094d85db5c2898f93d289b2106715a71"
        }`

    - **Error:**
    
        Block will not be added without data in the POST body.

        `Bad Data, provide proper block data`

* **Example using CURL**
    - **Success:**
    
        `curl -H "Content-Type: application/json" -X POST http://localhost:8000/block -d "{""body"": ""CURL test""}"`
        
        Response: `{"height":17,"hash":"b68c0a96f3644640eaeab45ad4d59ee343fc7158dbc16a75050de783b1ac7590","body":"CURL test","time":"1540254210","previousBlockHash":"906871696442bee05aaac4783e9410cd5f28168cd678804bbaffa88822b33640"}`
        
    - **Error:**
    
        `curl -H "Content-Type: application/json" -X POST http://localhost:8000/block -d "{""body"": """"}"`

        Response: `Bad Data, provide proper block data`

