<div align="center">
  <h1>Acrux API Technical Test</h1>
  <p>This repository contains the backend for the Acrux technical test. It is built using Node.js and Express.js, and it provides a RESTful API for managing events and users.</p>
  <p> **BASE URL:** localhost:5005/api</p>
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

### User and Event Schemas

The API uses the following user and event schemas:

**User Schema**

```javascript
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            lowercase: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required."],
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["USER", "PLANNER", "ADMIN"],
            default: "USER",
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required."],
        },
        favoriteEvents: [
            {
                ref: "events",
                type: Schema.Types.ObjectId,
            },
        ],

    },
```

**Event Schema**

```javascript
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            trim: true,
        },
        owner: {
            ref: "user",
            type: Schema.Types.ObjectId,
        },
        address: {
            type: String,
            required: [true, "Address is required."],
            trim: true,
        },
        country: {
            type: String,
            required: [true, "Country is required."],
            trim: true,
        },
        city: {
            type: String,
            required: [true, "City is required."],
            trim: true,
        },
        images: [
            {
                type: String,
                trim: true,
                required: [true, "Image is required."],
            },
        ],
        price: {
            type: Number,
            trim: true,
            required: [true, "Price is required."],
        },
        date: {
            type: Date,
            required: [true, "Date is required."],
            trim: true,
        },
        host: [
            {
                type: String,
                trim: true,
                required: [true, "At least one host is required."],
            },
        ],
    },
```
