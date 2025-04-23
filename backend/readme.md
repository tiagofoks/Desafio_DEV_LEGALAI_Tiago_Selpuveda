# Connection Finder Backend

This is the backend service for the Connection Finder application. It is built using Node.js, Express.js, and MongoDB to manage user data and handle authentication.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Backend](#running-the-backend)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure registration and login for users.
- **User Data Management:** Storage and retrieval of user information (name, email, password, etc.).
- **API for Frontend:** Provides endpoints for the frontend to interact with user data and authentication.
- **Connection Data Endpoint:** Exposes data required by the Python API for calculating connections.

## Prerequisites

- [Node.js](https://nodejs.org/) (version >= 16)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (running instance)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd backend

   npm install

   npm run dev

