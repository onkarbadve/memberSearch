# Enterprise Member Search Application

A full-stack, enterprise-grade application for searching and managing member data. Built with performance, security, and user experience in mind.

## 🚀 Tech Stack
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, H2 Database (In-Memory)
- **Frontend**: Angular 17, AG Grid Community, TypeScript
- **Security**: HTTPS (Self-Signed Certificates), CORS
- **Build Tools**: Maven, NPM/Angular CLI

## ✨ Key Features
- **✨ AI Natural Language Search**: 
  - **Conversational Queries**: "Show me all IT members in India".
  - **Intelligent Parsing**: Automatically detects Names, Countries, and Business Units.
  - **No API Keys**: Runs effectively locally without external dependencies.
- **High Performance**: Optimized for large datasets (1000+ records) with database-level filtering.
- **Secure by Default**: Full HTTPS implementation for both API and Client.
- **Server-Side Pagination**: Efficiently pages through thousands of records without browser lag.
- **Entitlement Engine**: Security logic (`entitled=true`) applied at the SQL level to prevent data leakage.
- **Premium UI**: 
  - Modern card-based layout with soft shadows.
  - Interactive "First", "Last", "Next", "Previous" navigation.
  - Custom Multi-select Dropdown for filtering.
  - Right-pinned "Actions" column for easy access.
- **Member Management**:
  - **Edit Capability**: users can modify member details via a responsive modal popup.
  - **Real-time Updates**: Grid refreshes automatically after a successful save.
- **Advanced Search Logic**:
  - **Validation**: Enforces `(First Name OR Last Name) AND Business Unit` logic to prevent broad queries.
  - **Multi-select**: Support for searching multiple Business Units simultaneously (e.g., "IT" OR "HR").

## 🛠️ Prerequisites
- **Java JDK 17+**
- **Node.js 18+** & **NPM**
- **Maven** (optional, wrapper included)

## 🏃‍♂️ How to Run

### 1. Backend (Spring Boot)
The backend runs on **port 8443** (HTTPS).
```bash
cd backend
mvn spring-boot:run
```
*Note: Upon startup, the database is automatically seeded with 1000+ synthetic records.*

### 2. Frontend (Angular)
The frontend serves on **port 4200** (HTTPS).
```bash
cd frontend
npm install
npm start
```
*The `npm start` command runs `ng serve --ssl`.*

## ⚠️ Important: Self-Signed Certificates
Since this project uses self-signed certificates for local development, your browser will flag the connection as "Not Secure". **You must manually trust the connection once.**

1.  **Backend Trust**: Open [https://localhost:8443/api/members/search](https://localhost:8443/api/members/search) in your browser.
    -   Click **Advanced** -> **Proceed to localhost (unsafe)**.
2.  **Frontend Access**: Open [https://localhost:4200](https://localhost:4200).
    -   Click **Advanced** -> **Proceed**.

## ✅ Verification
1.  Open the App.
2.  **Try Search**: Notice the "Search" button is disabled.
3.  **Enter Criteria**: Enter "John" in First Name AND select "IT" from Business Unit validation.
4.  **Click Search**: Results should appear.
5.  **Edit Member**: Click "Edit" on a row, change a value, and Save. Verify the grid updates.

## 🧠 AI Search Capabilities & Phrase Guide
The application features an intelligent Natural Language generic parser.

### 🏢 By Department (Business Unit)
* "Show me all **IT** members"
* "List everyone in **Sales**"
* "Find employees in **HR**"
* "Who are the **Admin** staff?"

### 🌍 By Country
* "Members located in **India**"
* "Show me people in the **USA**"
* "List members from **Canada**"

### 🚀 Complex Combinations
* **Name + Dept**: "Is **John** in **IT**?"
* **Name + Country**: "Find **Sarah** in **India**"
* **Dept + Country**: "Show all **Sales** members in **USA**"
* **Full Query**: "Find **Michael** in **Finance** living in **UK**"

### 💡 Pro Tip
Capitalization matters for names (e.g., "**J**ohn"), but keywords are case-insensitive.

## ☁️ Deployment Guide (Showcase Ready)
This app is configured for easy deployment on **Render** (Backend) and **Vercel** (Frontend).

### 1. Backend (Render.com)
1.  Push your code to GitHub.
2.  Create a **New Web Service** on Render connected to your repo.
3.  **Root Directory**: `backend`
4.  **Runtime**: `Docker`
5.  **Environment Variables**:
    *   `SPRING_PROFILES_ACTIVE` = `prod`
6.  Deploy! Copy your new URL (e.g., `https://member-search.onrender.com`).

### 2. Frontend (Vercel)
1.  Import your GitHub repo to Vercel.
2.  **Root Directory**: `frontend`
3.  **Framework Preset**: Angular
4.  **Important**: You must update the API URL.
    *   Go to `src/environments/environment.prod.ts` in your code.
    *   Update `apiUrl` with your **Render Backend URL**.
    *   Commit and Push.
5.  Vercel will auto-deploy.

**Result**: A live, public link to share with your team! 🚀
