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
Here's a demo how the AI is creating a coding environment where users can collaborate and contribute.
![Demo GIF](https://github.com/user-attachments/assets/17cfd551-6612-4267-9bff-32927a5697cb)




