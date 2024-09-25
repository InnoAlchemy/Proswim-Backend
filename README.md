# ProSwim Project

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine (version X.X.X or higher)
- XAMPP installed for database management
- Basic understanding of JavaScript and Express.js

## Project Structure

Here’s an overview of the project structure:

```

D:\ProSwim
├── app.js # Main application file
├── config # Configuration files
├── controllers # Application logic controllers
├── example.env # Example environment configuration file
├── middlewares # Custom middleware functions
├── models # Database models
├── package-lock.json # Dependency tree for the project
├── package.json # Project metadata and dependencies
├── routes # API route definitions
└── server.js # Server initialization

```

## Installation

1. **Clone the Repository**

   Clone the repository to your local machine using:

   ```bash
   git clone https://github.com/InnoAlchemy/Proswim-Backend
   ```

````

2. **Navigate to the Project Directory**

   ```bash
   cd ProSwim
   ```

3. **Install Dependencies**

   Use npm to install the required dependencies:

   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**

   Rename the `example.env` file to `.env` and configure the environment variables as follows:

   ```env
   DB_HOST=""
   DB_USER=""
   DB_PASSWORD=""
   DB_NAME=""
   JWT_SECRET=""
   JWT_EXPIRES_IN=24h
   PORT=""
   GOOGLE_CLIENT_ID=""
   EMAIL_USER=""
   EMAIL_PASS=""
   ```

   Fill in the appropriate values for your setup:

   - `DB_HOST`: The hostname for your database (e.g., `localhost`).
   - `DB_USER`: The username for your database.
   - `DB_PASSWORD`: The password for your database.
   - `DB_NAME`: The name of your database.
   - `JWT_SECRET`: A secret key used for signing JWTs.
   - `JWT_EXPIRES_IN`: Token expiration time (e.g., `24h`).
   - `PORT`: The port your server will run on (e.g., `3000`).
   - `GOOGLE_CLIENT_ID`: Your Google client ID for authentication.
   - `EMAIL_USER`: Email address used for sending emails.
   - `EMAIL_PASS`: Password for the email account.

2. **Database Configuration**

   Update the database credentials in the `.env` file to match your XAMPP MySQL configuration.

## Running the Application

To start the application, run:

```bash
nodemon server.js
```

The server will start on the port specified in your `.env` file (default is 3000). You can access the application at `http://localhost:3000`.

## Database Setup

1. **Open XAMPP Control Panel**

   Launch the XAMPP Control Panel and start the **Apache** and **MySQL** services.

2. **Create Database**

   - Open your web browser and navigate to `http://localhost/phpmyadmin`.
   - Click on the **Databases** tab.
   - Create a new database with the name specified in the `DB_NAME` variable from your `.env` file.

3. **Import Database**

   Import the database from `config/db.sql`.

## Usage

- Access the application through the web browser at the specified URL.
- Explore the different routes defined in the `routes` directory.

```

```
````
