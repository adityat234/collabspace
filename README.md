# Real time chat and collaboration app
A full featured app for team collaboration and real time engagement in projects. Built with the MERN stack and WebSocket (Socket.IO) for real-time communication.

# Features 
- User Authentication (JWT based sign up / login).
- One to one chats and group chats.
- Adding multiple users to project.
- AI Assistant powered by Gemini API :
   - Smart reply suggestions.
   - Helpful in creating coding environment.
   - Summarize long messages or documents.
- Multiple project creation.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI:** Gemini API by Google
- **Deployment:** Vercel (frontend), Render (backend)

## Dependencies
- **Backend:** express, mongoose, dotenv, cors, jsonwebtoken, bcryptjs, redis, socket.io, axios, nodemon
- **Frontend:** react, react-router-dom, axios, socket.io-client, tailwindcss, dotenv, webcontainer

## ⚙️ Installation

Follow these steps to run the project locally:

### 1. Clone the Repository
### 2. Set Up Environment Variables
Create a .env file in both the client/ and server/ directories.

Backend (/server/.env):
<pre>PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host_here
REDIS_PORT=your_redis_port_here
REDIS_PASSWORD=your_password
GOOGLE_AI_KEY=Your_google_AI_key</pre>
Frontend (/client/.env):

<pre>VITE_API_URL=http://localhost:3000</pre>

### 3. Start the server
- Backend :
  <pre>npx nodemon</pre>
- Frontend :
  <pre>npm run dev</pre>  
note: make sure to install nodemon globally

### 🎥 Demo
-Here's a demo of the login page, projects page and adding collaborators section.
![github-md-1](https://github.com/user-attachments/assets/5768c5e1-5fd3-4bc4-9b6c-4649406cd6d2)

-Here's a demo of how the AI is creating a coding environment for the project.
![github-md-2 (1)](https://github.com/user-attachments/assets/1b868714-78e1-4d4a-bcce-32eaae1c3f67)

-Screenshot of two users chat in a room 
<img width="1920" height="995" alt="Screenshot (3)" src="https://github.com/user-attachments/assets/ef399e13-62f1-4767-8a60-ef3ebd16b421" />


