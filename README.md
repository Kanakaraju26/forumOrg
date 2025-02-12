# Let's Talk - Online Forum

## Overview
Let's Talk is an online forum built using the MERN stack (MongoDB, Express.js, React + Vite, Node.js) with TypeScript. It allows users to post text and images, comment on posts, and engage in real-time chat. Users can also post and comment anonymously.

## Features
- **User Authentication**: Email and password authentication with OTP verification for signup and login.
- **Posting System**: Users can create posts with text and images, with an option to post anonymously.
- **Commenting System**: Users can comment on posts, with an option to comment anonymously.
- **Voting System**: Registered users can upvote/downvote posts and comments.
- **Chat System**: Registered users can chat with each other, but anonymous users cannot participate in chat.
- **Sorting**: Posts and comments are displayed in reverse chronological order (newest first).
- **Material UI Styling**: The UI is built with Material UI for a clean and modern look.

## Tech Stack
- **Frontend**: React + Vite, TypeScript, React Router, Material UI
- **Backend**: Node.js, Express.js, MongoDB (Supabase for authentication)
- **Database**: MongoDB
- **Authentication**: Email/password authentication with OTP verification

## Installation
### Prerequisites
- Node.js installed
- MongoDB setup

### Setup Instructions
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the frontend**
   ```sh
   cd client
   npm run dev
   ```

4. **Start the backend**
   ```sh
   cd server
   npm run start
   ```

## Usage
1. Sign up using your email and password.
2. Verify your email with the OTP sent to your email.
3. Log in to access all features.
4. Create posts, comment, upvote/downvote, and chat with registered users.

## Future Enhancements
- Implement user roles (admin, moderator, etc.)
- Add search and filter options for posts
- Improve the chat system with real-time WebSocket support

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
MIT License

