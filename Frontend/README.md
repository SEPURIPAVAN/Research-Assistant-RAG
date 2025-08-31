# Smart Assistant RAG

A GenAI-powered research assistant with RAG (Retrieval-Augmented Generation) capabilities.

## Features

- **AI Chat Interface** - Interactive chat with intelligent responses
- **User Authentication** - Secure login/signup with Firebase Auth
- **Chat History** - Persistent conversation storage
- **Responsive Design** - Clean, modern UI with Tailwind CSS
- **Real-time Updates** - Live chat synchronization

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase** account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/SEPURIPAVAN/Smart-Assistant-RAG.git
   cd Smart-Assistant-RAG
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**

   #### Create Firebase Project
   1. Go to [Firebase Console](https://console.firebase.google.com/)
   2. Click **"Create a project"**
   3. Enable **Authentication** and **Firestore Database**

   #### Get Firebase Config
   1. Go to **Project Settings** → **General** → **Your apps**
   2. Click **"Web app"** and register your app
   3. Copy the configuration object

   #### Configure Environment Variables
   Create a `.env` file in the project root and fill in your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firestore**

   #### Security Rules
   Go to **Firestore Database** → **Rules** and add:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /chatMessages/{messageId} {
         allow read, write: if request.auth != null && 
                             request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

   #### Create Index
   Go to **Firestore Database** → **Indexes** → **Create Index**:
   - **Collection ID**: `chatMessages`
   - **Field 1**: `userId` (Ascending)
   - **Field 2**: `timestamp` (Ascending)

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## Project Structure

```
src/
├── components/         # React components
├── pages/             # Page components
├── services/          # Firebase services
├── context/           # React context
└── main.jsx          # Entry point
```

## Usage

1. **Create an account** or login
2. **Start chatting** with the AI assistant
3. **View chat history** in the sidebar
4. **Create new conversations** with the "New Chat" button