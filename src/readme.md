# 📺 VidTube - Backend API

VidTube is a YouTube-like backend system built using **Node.js**, **Express**, and **MongoDB**. It provides a robust and scalable RESTful API for user management, video handling, likes, comments, subscriptions, and more.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT (Access + Refresh Tokens)  
- **Security:** bcrypt, dotenv, cookie-parser  
- **Others:** Multer (for uploads), Morgan (logging)

---

## ✨ Features

- ✅ User signup, login, logout (JWT-based)
- ✅ Access + Refresh token system
- ✅ Subscribe/unsubscribe to channels
- ✅ Like/dislike videos
- ✅ Comment on videos
- ✅ Video CRUD (upload, edit, delete, fetch)
- ✅ Get channel info & video stats
- ✅ Trending, random, and search video features

---


---

## 🔐 Authentication Flow

- 🔑 On login, client receives:
  - `access_token` (short-lived)
  - `refresh_token` (stored in HTTP-only cookie)

- 🔄 Refresh token route issues new access token when expired.

---

## 🚀 API Endpoints

### 🔒 Auth

| Method | Route               | Description            |
|--------|---------------------|------------------------|
| POST   | `/api/auth/signup`  | Register a user        |
| POST   | `/api/auth/login`   | Login user             |
| POST   | `/api/auth/logout`  | Logout user            |
| POST   | `/api/auth/refresh` | Refresh access token   |

### 👤 Users

| Method | Route                        | Description                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/users/:id`             | Get user info                  |
| PUT    | `/api/users/:id`             | Update user profile            |
| DELETE | `/api/users/:id`             | Delete user account            |
| PUT    | `/api/users/subscribe/:id`   | Subscribe to a user            |
| PUT    | `/api/users/unsubscribe/:id` | Unsubscribe from a user        |

### 🎥 Videos

| Method | Route               | Description                 |
|--------|---------------------|-----------------------------|
| POST   | `/api/videos/`      | Upload a video              |
| PUT    | `/api/videos/:id`   | Update a video              |
| DELETE | `/api/videos/:id`   | Delete a video              |
| GET    | `/api/videos/:id`   | Get a single video          |
| GET    | `/api/videos/trend` | Get trending videos         |
| GET    | `/api/videos/random`| Get random videos           |
| GET    | `/api/videos/search`| Search videos by title/tags |

### 💬 Comments

| Method | Route                    | Description             |
|--------|--------------------------|-------------------------|
| POST   | `/api/comments/`         | Add a comment           |
| DELETE | `/api/comments/:id`      | Delete a comment        |
| GET    | `/api/comments/:videoId` | Get comments on a video |

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/your-username/vidtube-backend.git
cd vidtube-backend
npm install
