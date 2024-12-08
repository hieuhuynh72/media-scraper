# **Media Scraper Application**

## **Overview**
The Media Scraper is a robust application built using **NestJS** for the backend and **React.js** for the frontend. It efficiently handles web scraping for up to **5,000 URLs simultaneously** using **Bee-queue** for job management. The project includes API management, logging, and error handling, all packaged in a Dockerized environment.

---

## **Features**
- **Web Scraping**: Extract media content from multiple URLs.
- **Queue Management**: Handles up to 5,000 URLs concurrently with **Bee-queue**.
- **API Management**: Expose APIs for data access and control.
- **Error Handling**: Comprehensive error logging and retry mechanisms.
- **Dockerized Environment**: Simplified setup and deployment.
- **Frontend-Backend Separation**:
  - **Frontend**: Next.js for the user interface.
  - **Backend**: NestJS for API and business logic.

---

## **Project Structure**
  ```plaintext
  apps/
  ├── client/          # Frontend application (React.js / Next.js)
  ├── server/          # Backend application (NestJS)
  ├── Dockerfile       # Root Dockerfile for orchestration
  ├── README.md        # Documentation
  └── pnpm-lock.yaml   # Dependency lock file
  ```

---

## Technologies Used

### **Backend**
- **NestJS**: A modular, TypeScript-based framework for building scalable server-side applications.
- **Postgres**: SQL database for storing scraped data.
- **Bee-queue**: A high-performance job queue to manage scraping tasks efficiently.
- **Web Scraping Tools**: 
  - **Cheerio**: Lightweight scraping library for parsing static HTML content.

### **Frontend**
- **Next.js**: A React-based framework for server-side rendering (SSR) and single-page applications (SPA).
- **Material UI**: A library for building modern UI components.

### **Other Tools**
- **pnpm**: A fast and efficient package manager.
- **Docker**: Containerization tool for creating consistent and portable environments.
- **Linting & Formatting**: 
  - **ESLint**: Enforces coding standards.
  - **Prettier**: Ensures consistent code formatting.
 
---

## **Getting Started**

### **Prerequisites**
- **Node.js** (v18 or higher)
- **Docker** (latest version)
- **pnpm** (installed globally: `npm install -g pnpm`)

---

### **Installation**

1. **Clone the Repository**:
  ```bash
  git clone git@github.com:hieuhuynh72/media-scraper.git
  cd media-scraper
   ```
2. **Install Dependencies**:
  ```bash
  pnpm install
  ```
3. **Build the Application**:
- **Frontend**:
  ```bash
  cd server
  pnpm build
  ```
- **Backend**:
  ```bash
  cd server
  pnpm build
   ```
---
### **Running the Application**

**Using Docker**
1. Build and run the Docker containers:
  ```bash
  docker-compose up --build
  ```
2. Access the application:
  - **Frontend**: http://localhost:3000
  - **Backend**: http://localhost:4000
  
**Without Docker**
1. **Frontend**:
  ```bash
  cd client
  pnpm run dev
  ```
  Access: http://localhost:3000
2. **Backend**:
  ```bash
  cd server
  pnpm run build
  ```
  Access: http://localhost:4000

---

## **Bee-queue Integration**

**Bee-queue** is used to manage web scraping tasks for up to **5,000 URLs**. Each URL is added to the queue as a job and processed in parallel with retries and error handling.

### **Key Bee-queue Features**
- **Concurrency**: Allows efficient parallel processing of jobs.
- **Retry Logic**: Automatically retries failed jobs based on configuration.
- **Monitoring**: Logs progress, errors, and completion statuses.

### **Configuration Example**
The queue is configured in the backend with:
  ```typescript
  import { Queue } from 'bee-queue';

  const urlQueue = new Queue('url-scraper', {
    removeOnSuccess: true,
    removeOnFailure: false,
    isWorker: true,
    concurrency: 10, // Customize this based on server capacity
  });

  urlQueue.process(async (job) => {
    const { url } = job.data;
    // Web scraping logic for the URL
    console.log(`Processing URL: ${url}`);
    return { success: true, url };
  });
  ```

---

## **Scripts**
  - **Install Dependencies**:
    ```bash
    pnpm install
    ```
  - **Build the Application**:
    - **Frontend**:
      ```bash
      cd client
      pnpm build
      ```
    - **Backend**:
      ```bash
      cd server
      pnpm build
      ```
  - **Run the Application**:
    - **Frontend**:
      ```bash
      cd client
      pnpm dev
      ```
    - **Backend**:
      ```bash
      cd server
      pnpm start
      ```

---
