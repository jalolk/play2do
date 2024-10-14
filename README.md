# 🎮 Play2do: QA-Focused Todo Application

<div align="center">
<img src="https://skillicons.dev/icons?i=nestjs,react,vite,tailwind" />
<img src="https://github.com/tandpfun/skill-icons/raw/main/icons/MongoDB.svg" width="48" height="48" alt="MongoDB" />
<img src="https://github.com/tandpfun/skill-icons/raw/main/icons/Prisma.svg" width="48" height="48" alt="Prisma" />
<img src="https://github.com/tandpfun/skill-icons/raw/main/icons/Jest.svg" width="48" height="48" alt="Jest" />
<img src="https://github.com/microsoft/playwright/blob/main/packages/web/src/assets/playwright-logo.svg" width="48" height="48" alt="Playwright" />
</div>

## 🔍 Project Overview

Play2do is an advanced Task Manager application designed to showcase best practices in Quality Assurance (QA) automation and comprehensive testing strategies. While it provides full todo list functionality, the primary goal is to demonstrate how to implement and maintain robust testing across various levels of a modern web application.

## 🛠️ Tech Stack

### Backend
- 🪺 NestJS
- 🍃 MongoDB
- 🔷 Prisma ORM

### Frontend
- ⚛️ React
- ⚡ Vite
- 🎨 Shadcn UI
- 🌬️ TailwindCSS

## 🧪 Testing Framework

Play2do incorporates multiple testing methodologies to ensure code quality and reliability:

1. 🔬 **Unit Tests**: Using Jest for both backend and frontend
2. 🔗 **Integration Tests**: Ensuring smooth interaction between components
3. 🌐 **End-to-End (E2E) Tests**: Utilizing Playwright for comprehensive application flow testing
4. 🔌 **API Tests**: Leveraging Bruno for thorough API endpoint testing

## ✨ Key Features

- ✅ Full-featured Todo application functionality
- 🛡️ Comprehensive test coverage across all application layers
- 💻 Demonstration of modern web development best practices
- 🚀 Showcase of QA automation techniques in a real-world scenario

## 🏃‍♂️ Running the Tests

To experience the extensive testing suite:

- 🧪 **Unit and Integration Tests**: 
  ```
  yarn test
  ```
  This command runs Jest tests for both backend and frontend components.

- 🌐 **End-to-End Tests**:
  ```
  yarn e2e test
  ```
  Executes Playwright tests to simulate real user interactions.

- 🔌 **API Tests**:
  Navigate to the `bruno API` folder in the project directory. Here you'll find a collection of API tests implemented using Bruno.

## 📁 Project Structure

```
play2do/
├── backend/                 # NestJS backend
│   ├── src/                 # Services covered with unit tests
├── frontend/                # React frontend
│   ├── src/                 # Components covered with unit and integration tests
├── e2e/                     # Playwright E2E tests
├── bruno API/               # Bruno API tests
└── package.json
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Set up your MongoDB instance and update the connection string
4. Run the application: `yarn start`
5. Explore the various test suites as described above

## 🤝 Contributing

We welcome contributions, especially those that enhance our testing methodologies or expand test coverage. Please refer to our contributing guidelines for more information.

## 📚 Learn More

This project serves as an excellent resource for:
- 🧑‍🔬 QA engineers looking to expand their automation skills
- 👨‍💻 Developers aiming to implement comprehensive testing strategies
- 🎓 Anyone interested in seeing how different testing methodologies can be integrated into a single project

Dive into the code, run the tests, and elevate your QA automation skills with Play2do!
