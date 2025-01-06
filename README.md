# Chat Application README

Welcome to the Chat Application! This app allows users to create and manage chat sessions with text, image, and audio support, as well as provides a seamless chat experience.

## Features

- **Real-time Messaging**: Send and receive text, image, and audio messages in real time.
- **Dynamic UI**: User-friendly interface for creating new chat sessions and managing existing ones.
- **Message Types**: Send images and audio clips along with text.
- **Typing Notifications**: Shows when another user is typing.

## Installation and Setup

### Prerequisites

1. **Docker**: You'll need Docker installed on your system. If you don't have Docker installed, you can get it from the [official Docker website](https://www.docker.com/products/docker-desktop).

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>

### Build and Run with Docker

1. **Build the Docker image**: Once you've cloned the repository, build the Docker image for the backend:

```shellscript
docker build -t chat-backend .
```

2. **Run the Docker container**: After building the image, you can run the container:

```shellscript
docker run -p 8000:8000 chat-backend
```

This will start the backend server, which will be available at `http://localhost:8000`.

### Run the Frontend Locally

1. **Install dependencies**: Make sure you have the required dependencies installed in your frontend project folder.

```shellscript
npm install
```


2. **Start the development server**: Run the frontend locally:

```shellscript
npm run dev
```

3. **Access the application**: Open `http://localhost:3000` in your browser to view the frontend of the chat application.

## Backend Repository

To fully run the application, the backend code for the chat app should be started. We are using the following backend project:

[Frontend Technical Challenge Backend](https://github.com/SailerAI/frontend-technical-challenge)

Follow these instructions to run the backend:

1. Clone the repository:

```shellscript
git clone https://github.com/SailerAI/frontend-technical-challenge
cd frontend-technical-challenge
```

2. Build and run the backend Docker container:

```shellscript
docker build -t chat-backend .
docker run -p 8000:8000 chat-backend
```

The backend server will now be live at `http://localhost:8000`, and the frontend can interact with it for full functionality.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a description of the changes you have made.

## License

This project is open-source under the MIT License. See the LICENSE file for details.