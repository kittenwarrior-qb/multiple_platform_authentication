# Multiple Platform Authentication App

A modern, full-stack authentication application that supports multiple OAuth providers (Google, Facebook, GitHub) with account linking capabilities. Built with React, TypeScript, Node.js, and Firebase.

![Login Screen](./screenshots/login-screen.png)

## Features

- **Multiple OAuth Providers**: Support for Google, Facebook, and GitHub authentication
- **Account Linking**: Automatically link accounts with the same email across different providers
- **Modern UI**: Beautiful, responsive design with smooth animations
- **TypeScript**: Full type safety across frontend and backend
- **Firebase Integration**: Secure authentication with Firebase Auth
- **JWT Tokens**: Backend verification using Firebase ID tokens
- **Error Handling**: Comprehensive error handling for authentication flows

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Firebase Auth** for authentication
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express
- **Firebase Admin SDK** for token verification


## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Multiple_platform_auth
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication and configure OAuth providers:
   - **Google**: Enable Google provider
   - **Facebook**: Enable Facebook provider with App ID and App Secret
   - **GitHub**: Enable GitHub provider with Client ID and Client Secret
4. Get your Firebase config object from Project Settings > General > Your apps

### 3. Environment Configuration

#### Frontend Configuration
Create `frontend/.env`:

```typescript
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

```
Create `backend/.env`:
```typescript
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

```

### 4. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 5. Run the Application

#### Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## Usage

1. **Open the application** in your browser at `http://localhost:5173`
2. **Choose a provider** to sign in (Google, Facebook, or GitHub)
3. **Complete OAuth flow** in the popup window
4. **Account linking**: If you try to sign in with a different provider using the same email, the app will automatically link the accounts

## API Endpoints

### Backend Routes

- `GET /profile` - Get user profile information
  - **Headers**: `Authorization: Bearer <firebase-id-token>`
  - **Response**: User profile data

---

**Happy Coding! 🚀**
