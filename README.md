# VidTube - A Scalable Backend System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 🚀 Overview

VidTube is a robust and scalable backend system designed to replicate the core functionalities of a video-sharing platform like YouTube. It provides a complete set of RESTful APIs for user management, video handling, social interactions (likes, comments, subscriptions), and more.

This project is built with a modern JavaScript stack, focusing on clean code, scalability, and industry-standard practices for backend development.

---

## ✨ Features

* **👤 User Authentication**: Secure JWT-based authentication (register, login, logout) with encrypted passwords.
* **🎥 Video Management**: Full CRUD operations for videos, including uploading, updating, and deleting.
* **👍 Social Interaction**: Functionality for liking/disliking videos and leaving comments.
* **🔔 Subscription System**: Users can subscribe to channels and view a feed of videos from their subscribed channels.
* **📄 Playlist Management**: Users can create, update, and manage their own video playlists.
* **🖼️ Cloud Media Handling**: Integrated with Cloudinary for seamless video and image asset management.
* **⚙️ Advanced Aggregation**: Utilizes MongoDB's powerful aggregation pipelines for complex queries and data analysis.

---

## 🛠️ Tech Stack & Key Libraries

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JSON Web Tokens (JWT)
* **Password Hashing**: Bcrypt
* **File Uploads**: Multer
* **Cloud Services**: Cloudinary for media storage
* **Code Quality**: Prettier for consistent code formatting

---

## 🔧 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18.x or higher)
* npm / yarn
* MongoDB instance (local or cloud-based like MongoDB Atlas)
* A Cloudinary account for media uploads

### Installation & Setup

1.  **Clone the repository**:
    ```sh
    git clone [https://github.com/Anuragupadhayay/VidTube-Backend-system.git](https://github.com/Anuragupadhayay/VidTube-Backend-system.git)
    ```

2.  **Navigate to the project directory**:
    ```sh
    cd VidTube-Backend-system
    ```

3.  **Install the necessary NPM packages**:
    ```sh
    npm install
    ```

4.  **Set up your environment variables**:
    Create a `.env` file in the root of the project by duplicating the `.env.sample` file.
    ```sh
    cp .env.sample .env
    ```
    Now, fill in the required values in your new `.env` file:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=*

    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=10d

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

5.  **Start the development server**:
    ```sh
    npm run dev
    ```
    The server will start on the port you defined in your `.env` file (e.g., `http://localhost:8000`).

---

## 📂 API Endpoints

The API endpoints are organized by feature. You can use a tool like Postman or Insomnia to interact with them.

* `/api/v1/users/` - User-related routes (register, login, etc.)
* `/api/v1/videos/` - Video-related routes (upload, get, update, delete)
* `/api/v1/likes/` - Routes for managing likes
* `/api/v1/comments/` - Routes for managing comments
* `/api/v1/subscriptions/` - Routes for managing channel subscriptions

*(For detailed endpoint information, please refer to the route definitions within the `/src/routes/` directory.)*

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Happy Coding!
