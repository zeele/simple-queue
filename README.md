# Simple Queue
Simple implementation of a message queue

## Getting started

#### Running server
cd src/server

npm install && npm run start

#### Running demo
cd src/client

npm install && npm run start

**Requirements** 
- Node.js needs to be installed
- Redis needs to be installed
- Redis server needs to be running
- Server needs to be started before the demo

**Notes**
- Console log messages will provide insight into what the application is currently doing

## Implementation
- When a **producer** *posts* a message, messages are added to a list (key is `queue`) which acts as the main **FIFO queue** of **unprocessed messages**.

- Each **consumer** creates a **unique id** each time it asks for a request. This uuid **ties the consumer to it's own processing queue**. Everything existing in the main queue is **moved to the processing queue** (key is `processingQueue:uuid`). Messages are returned to the consumer for processing.

- When messages are **done processing**, the consumer posts to delete endpoint, sending it's unique id. It's **processing queue gets deleted**.

- A **cleanup service** keeps track of the uuid of the consumer, along with an **expiration time** for the consumer. It uses a **map** which maintains the **order of insertion**.

- When a processing queue is deleted, it's consumer's id is also deleted from the clean up service's map.

- The cleanup service runs a **cleanup job** at a **set interval**. This job will go through the map of consumer ids, starting from the beginning (oldest) and checking the expiration time. If the expiration time has passed, it will get the messages from the consumer's processing queue, **move it to the front of the main queue**, and deletes the processing queue. This service runs until it finds an item that has not expired (as everything after will be newer)

## API endpoints
`POST /add`

Adds a message to the queue

Parameters:
- `text=[string]`

`POST /delete/:uuid`

Deletes a  queue 

Parameters:
- `uuid`


`GET /get/:uuid`

Gets messages from a queue
Parameters:
- `uuid`

## Future Scaling
##### Redis
Redis is an ideal choice as  it's able to handle generic data types, and extremely fast as it is in-memory. Persistence can be configured. Redis Cluster can be used for further scaling and thus can be high available. Redis provides atomic operations which simplifies design.

##### Load balancing
Adding load balancing would allow more instances of the server to be running.

##### Long polling
Adding long polling would allow consumers to not try to get requests non stop, and result in less CPU resource consumption. We could have the consumer wait up to a certain interval before returning a response if the queue is empty (returns immediately if there is a new message - and only the first consumer waiting should get it).

##### More robust design
Include the use of dead letter queues to better debug issues with the application and handle edge cases (e.g. Messages that are too long)

##### Load testing
Loading testing should be done to find out where the bottleneck is; this should inform where effort should be spent. 

## Todos 
- Add dev tool to show current state
- Add request retry
- Create missing test files
- Use Typescript
- Use interfaces
- Add better error handling 
- Add better responses / acknowledgements
- Add support for edge cases
- Create config files
- Set up a redis properly (pool, configuration, persistence)
- Add Stats and monitoring