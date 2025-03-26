# Twitter Clone

A modern Twitter clone built with Spring Boot, React, Redis, and Kafka.

## Features

- Real-time tweet posting and interaction
- User authentication and authorization
- Redis-based data storage
- Kafka message broker for real-time updates
- Material UI components for modern design
- Responsive and mobile-friendly interface

## Tech Stack

### Backend
- Spring Boot
- Redis
- Apache Kafka
- Spring Security
- JWT Authentication
- Maven

### Frontend
- React
- Material UI
- Redux for state management
- Axios for API calls
- React Router for navigation

## Project Structure

```
twitter-clone/
├── backend/                 # Spring Boot application
│   ├── src/
│   └── pom.xml
└── frontend/               # React application
    ├── src/
    └── package.json
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Redis
- Kafka
- Maven
- npm or yarn

### Backend Setup
1. Navigate to the backend directory
2. Run `mvn clean install`
3. Start Redis and Kafka
4. Run the Spring Boot application

### Frontend Setup
1. Navigate to the frontend directory
2. Run `npm install` or `yarn install`
3. Start the development server with `npm start` or `yarn start`

## API Documentation
API documentation will be available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
