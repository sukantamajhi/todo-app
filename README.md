# Modern Todo Application

A full-stack todo application built with React.js, Node.js, Express, and MongoDB featuring advanced functionality and modern UI design.

## Features

### Core Features

-   ✅ User Authentication (Register/Login with JWT)
-   ✅ Create, Read, Update, Delete todos
-   ✅ Todo categories and tags
-   ✅ Priority levels (Low, Medium, High, Critical)
-   ✅ Due dates and reminders
-   ✅ Progress tracking

### Advanced Features

-   🚀 Real-time updates with Socket.io
-   🎨 Modern Material-UI design
-   🌙 Dark/Light mode toggle
-   📱 Fully responsive design
-   🔍 Advanced search and filtering
-   ↕️ Drag and drop todo reordering
-   📊 Dashboard with analytics
-   🔔 Toast notifications
-   🎭 Smooth animations

## Tech Stack

### Backend

-   Node.js & Express.js
-   MongoDB with Mongoose
-   JWT Authentication
-   Socket.io for real-time features
-   Security middleware (Helmet, CORS, Rate Limiting)

### Frontend

-   React.js 18
-   Material-UI (MUI)
-   React Router for navigation
-   React Query for state management
-   React Beautiful DnD for drag & drop
-   Framer Motion for animations
-   Axios for API calls

## Quick Start

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or cloud)
-   npm or yarn

### Installation

1. **Clone and install dependencies:**

    ```bash
    git clone <repository-url>
    cd todo-app
    npm run install-deps
    ```

2. **Set up environment variables:**
   Create `.env` file in the `backend` directory:

    ```env
    NODE_ENV=development
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/todoapp
    JWT_SECRET=your-super-secret-jwt-key
    JWT_EXPIRE=7d
    ```

3. **Start MongoDB:**

    ```bash
    # If using local MongoDB
    mongod
    ```

4. **Run the application:**

    ```bash
    # Run both frontend and backend
    npm run dev

    # Or run separately
    npm run server  # Backend on http://localhost:5000
    npm run client  # Frontend on http://localhost:3000
    ```

## API Documentation

### Authentication Endpoints

-   `POST /api/auth/register` - Register new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/me` - Get current user

### Todo Endpoints

-   `GET /api/todos` - Get all todos for user
-   `POST /api/todos` - Create new todo
-   `PUT /api/todos/:id` - Update todo
-   `DELETE /api/todos/:id` - Delete todo
-   `GET /api/todos/search` - Search todos

### Category Endpoints

-   `GET /api/categories` - Get all categories
-   `POST /api/categories` - Create new category
-   `PUT /api/categories/:id` - Update category
-   `DELETE /api/categories/:id` - Delete category

## Project Structure

```
todo-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
