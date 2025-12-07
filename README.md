# Enterprise Member Search Application

A full-stack, enterprise-grade application for searching and managing member data. Built with performance, security, and user experience in mind.

## 🚀 Tech Stack
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, H2 Database (In-Memory)
- **Frontend**: Angular 17, AG Grid Community, TypeScript
- **Security**: HTTPS (Self-Signed Certificates), CORS
- **Build Tools**: Maven, NPM/Angular CLI

## ✨ Key Features
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
