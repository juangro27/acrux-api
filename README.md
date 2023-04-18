<div align="center">
  <h1>Acrux API Technical Test</h1>
  <p>This repository contains the backend for the Acrux technical test. It is built using Node.js and Express.js, and it provides a RESTful API for managing events and users.</p>
  <p> BASE URL: <str>http://localhost:5005/api</str> or <str>https://acrux-api.fly.dev/api/</str></p>
</div>

## Getting Started

To get started, clone this repository to your local machine and run `npm install` to install the necessary dependencies.

Next, create a `.env` file in the root directory and add the following environment variables:

```
PORT=5005
MONGODB_URI=<your database URI>
JWT_SECRET=<your JWT secret>
```

You can then start the server by running `npm start`. By default, the server will listen on port 5005.

Alternatively, you can access a deployed version of the API at the following URL:

https://acrux-api.fly.dev/api/

## API Usage Examples

In the `docs` folder of this project, you can find a Postman collection with example requests to all of the API endpoints. To use it, follow these steps:

Install Postman on your computer if you haven't already done so.

Import the API_Usage_Examples.json file into Postman.

You should now see a collection of API requests in the left sidebar of Postman. Click on any request to view its details and send the request to the API.

These examples will help you understand how to use the API and the expected responses. Please note that you'll need to start the server by running npm start before you can use the API.

This API provides endpoints for managing user accounts and events. The API has the following endpoints:

### Authentication Endpoints `/auth`

| METHOD | URI Path | Description                                                                              | Protected |
| ------ | :------: | ---------------------------------------------------------------------------------------- | --------- |
| POST   | /signup  | Creates a new user account with the provided name, last name, email, and password.       |           |
| POST   |  /login  | Logs a user in with the provided email and password and returns an authentication token. |           |
| GET    | /verify  | Verifies the authentication token of a user.                                             | ✔️        |

### Users Endpoints `/users`

| METHOD |   URI Path    | Description                                                                                 | Protected |
| ------ | :-----------: | ------------------------------------------------------------------------------------------- | --------- |
| GET    |       /       | Retrieves a list of users                                                                   | ✔️        |
| PUT    | /addEvent/:id | Add or remove an event with the provided eventId to a user's favorite events list.          | ✔️        |
| GET    |     /:id      | Retrieves a user with the provided ID.                                                      |           |
| PUT    |   /:id/edit   | Updates a user with the provided ID with the provided name, last name, email, and password. | ✔️        |
| DELETE |  /:id/delete  | Deletes a user with the provided ID.                                                        | ✔️        |

### Events Endpoints `/events`

| METHOD |  URI Path   | Description                                                                                                          | Protected |
| ------ | :---------: | -------------------------------------------------------------------------------------------------------------------- | --------- |
| GET    |      /      | Retrieves a list of events that match the given query parameters (country, city, address, and date).                 |           |
| POST   |   /create   | Creates a new event with the provided name, address, city, country, images, price, date, and host.                   | ✔️        |
| GET    |    /:id     | Retrieves an event with the provided ID.                                                                             |           |
| PUT    |  /:id/edit  | Updates an event with the provided ID with the provided name, address, city, country, images, price, date, and host. | ✔️        |
| DELETE | /:id/delete | Deletes an event with the provided ID.                                                                               | ✔️        |
