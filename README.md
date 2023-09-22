# Cuvette Project

This repository contains the source code for the Cuvette project, an application that handles user registration and OTP verification via SMS using Twilio.

**Deployment Link:** [Cuvette Project Deployment](https://verification2-cgi4.onrender.com/)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installing Dependencies](#installing-dependencies)
  - [Database Setup](#database-setup)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
  - [Endpoints](#endpoints)
- [Configuration](#configuration)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your development machine.
- MongoDB database setup.
- A Twilio account with valid credentials (Account SID and Auth Token).

## Getting Started

### Installing Dependencies

To install project dependencies, run the following command:

```bash
npm install
```

### Database Setup

Ensure you have a MongoDB database set up and configured. Update the `URL` and `PORT` environment variables in the `.env` file with your MongoDB connection URL and desired server port.

- You can set your own MongoDB connection URL by replacing the value of the `URL` environment variable in the `.env` file.

- You can customize the server's port by modifying the `PORT` environment variable in the `.env` file.

## Usage

### Running the Server

To start the server, run the following command:

```bash
npm start
```

### Important Note

Before using this project, please note that there are only two phone numbers available for sending OTPs in the provided Twilio trial account. You can use the following numbers for testing purposes:

- +918530528162
- +919766050490

If you wish to avoid these restrictions, you can use your own Twilio credentials by updating the following environment variables in the `.env` file:

- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID.
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token.
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number.

By using your own Twilio credentials, you can send OTPs without limitations.

This note provides users with the option to use their own Twilio credentials to avoid restrictions on the number of OTPs they can send.

### Endpoints

- `/register`: Handle user registration and OTP verification.

  - To send an OTP, make a POST request to `/register` with the following JSON format:

    ```json
    {
      "mobileNumber": "+918530528162"
    }
    ```

    - Ensure that the `mobileNumber` is in a valid format with the country code, e.g., `+918764618424`.

  - To verify the OTP, make a POST request to `/register/otp` with the following JSON format:
    ```json
    {
      "mobileNumber": "+918530528162",
      "otp": ""
    }
    ```
    - Ensure that the `mobileNumber` is in a valid format with the country code, e.g., `+918764618424`.
    - Provide the OTP received via SMS in the `otp` field.

### Configuration

- The project uses environment variables stored in a `.env` file for configuration. Modify the `.env` file to set your application's specific configuration values, including database connection details and Twilio credentials.

  - You can set your own values for the `PORT` and `URL` environment variables in the `.env` file to customize the server's port and database connection.

  - You can also use your own Twilio credentials by updating the following environment variables in the `.env` file:
    - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID.
    - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token.
    - `TWILIO_PHONE_NUMBER`: Your Twilio phone number.

- If you are using a Twilio trial account, you can send a limited number of OTP requests. You can use the provided phone numbers `+8764618424` and `+9461686381` for testing OTP sending in a trial account.

## Deployment

This project is deployed at the following URL: [Cuvette Project Deployment](https://verification2-cgi4.onrender.com/)

## License

This project is open-source and free to use without any specific license restrictions. You are free to use, modify, and distribute this software as needed.

<div align="center">
  <b>Thanks for your Time....</b>
</div>
