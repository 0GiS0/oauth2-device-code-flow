# OAuth 2.0 Device Code Flow with Microsoft Azure AD

A Node.js/Express demonstration of the **OAuth 2.0 Device Authorization Grant** (Device Code Flow) using Microsoft Azure Active Directory. This project implements the complete flow for authenticating users on input-constrained devices (smart TVs, IoT devices, CLI tools) and calling the Microsoft Graph API.

## 📋 Overview

The Device Code Flow is an OAuth 2.0 extension that enables devices with limited input capabilities or without a web browser to obtain user authorization. Instead of entering credentials on the device itself, users authenticate on a separate device (like a smartphone or computer) by visiting a URL and entering a code.

This demo walks through the complete 4-step flow:
1. **Get Device Code** — Request a device code and user code from Azure AD
2. **User Authentication** — User visits the verification URL and enters the code
3. **Retrieve Access Token** — Poll for the access token once the user has authenticated
4. **Call Microsoft Graph API** — Use the access token to call the beta `/me` endpoint

## 🎯 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher)
- **An Azure AD tenant** with administrative access
- **A registered Azure AD application** with:
  - **Application (client) ID**
  - **Directory (tenant) ID**
  - **API Permissions**: `User.Read` (Microsoft Graph)
  - **Public client flows enabled** (Authentication → Advanced settings → Allow public client flows: Yes)

### Azure AD Application Setup

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Click **New registration**
3. Enter a name for your application
4. Under **Supported account types**, choose the appropriate option (single or multi-tenant)
5. Click **Register**
6. Note down the **Application (client) ID** and **Directory (tenant) ID**
7. Navigate to **API permissions** → Add **Microsoft Graph** → Delegated permissions → Add `User.Read`
8. Navigate to **Authentication** → Advanced settings → Enable **Allow public client flows**

## 🚀 Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/0GiS0/oauth2-device-code-flow.git
cd oauth2-device-code-flow
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Copy the `.env.sample` file to `.env`:

```bash
cp .env.sample .env
```

Edit the `.env` file and add your Azure AD credentials:

```
TENANT_ID="your-tenant-id"
CLIENT_ID="your-client-id"
```

## 🎮 Usage

Start the server:

```bash
npm start
```

The application will start on `http://localhost:8000`.

### Device Code Flow Steps

1. **Navigate to** `http://localhost:8000`
   
2. **Step 1: Get the Device Code**
   - Click "Get the device code" button
   - The app requests a device code from Azure AD
   - You'll see a user code and verification URL

3. **Step 2: User Authentication**
   - Open the verification URL (e.g., `https://microsoft.com/devicelogin`) in a browser
   - Enter the user code displayed in the app
   - Sign in with your Microsoft account
   - Grant consent to the application

4. **Step 3: Retrieve Access Token**
   - The app polls Azure AD for the access token
   - Once authentication is complete, the access token is retrieved

5. **Step 4: Call Microsoft Graph API**
   - The app uses the access token to call the Microsoft Graph beta `/me` endpoint
   - Your user profile information is displayed

## 📁 Project Structure

```
oauth2-device-code-flow/
├── server.js                 # Main Express server and OAuth 2.0 flow implementation
├── package.json              # Project dependencies and scripts
├── .env.sample               # Template for environment variables
├── .gitignore                # Git ignore rules
├── views/                    # EJS templates
│   ├── index.ejs             # Landing page with 4-step stepper
│   ├── device-code.ejs       # Device code display and polling logic
│   ├── access-token.ejs      # Access token display
│   ├── calling-ms-graph.ejs  # Microsoft Graph API response
│   └── partials/             # Reusable EJS components
└── public/                   # Static assets (CSS, JS, images)
```

### Key Files

- **`server.js`** — Contains all Express routes and OAuth 2.0 Device Code Flow logic:
  - `GET /get/the/code` — Initiates the device code request
  - `POST /checking` — Polls Azure AD for token
  - `GET /access/token` — Displays the retrieved access token
  - `POST /call/ms/graph` — Calls Microsoft Graph API

- **`.env.sample`** — Template for required environment variables

- **`views/index.ejs`** — Landing page with visual stepper showing the 4-step flow

## 🛠️ Technologies Used

- **[Express](https://expressjs.com/)** — Web framework for Node.js
- **[EJS](https://ejs.co/)** — Embedded JavaScript templating
- **[node-fetch](https://github.com/node-fetch/node-fetch)** — HTTP client for making API requests
- **[bunyan](https://github.com/trentm/node-bunyan)** — JSON logging library
- **[dotenv](https://github.com/motdotla/dotenv)** — Environment variable management
- **[body-parser](https://github.com/expressjs/body-parser)** — Request body parsing middleware
- **[nodemon](https://nodemon.io/)** — Development tool for auto-restarting the server

## 📚 Documentation & References

- [OAuth 2.0 Device Authorization Grant — RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628)
- [Microsoft Identity Platform — Device Code Flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-device-code)
- [Microsoft Graph API — Get User](https://learn.microsoft.com/en-us/graph/api/user-get)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)

## 🔒 Security Considerations

- **Never commit your `.env` file** — It contains sensitive credentials
- **Access tokens are displayed for demo purposes** — In production, never expose tokens to the client-side
- **Use HTTPS in production** — Always serve your application over HTTPS
- **Implement token refresh** — Access tokens expire; implement refresh token logic for production use
- **Limit token scope** — Only request the minimum necessary permissions

## 📝 License

This project is licensed under the **ISC License**.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

**@0GiS0**

---

⭐ If you found this demo helpful, please consider giving it a star!
