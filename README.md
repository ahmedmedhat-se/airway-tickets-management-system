# Airway Tickets Management System

> Developed by **Ahmed Medhat - Ali Ahmed - Mohammed Iraqi**

---

## Project Overview

**Airway Tickets Management System** is a full-stack web application designed to streamline airline reservation, ticket booking, and flight management operations. The system provides a modern digital platform for passengers to search flights, reserve seats, manage bookings, and track ticket details, while administrators can efficiently manage flights, schedules, customers, and system operations through a centralized dashboard.

The project focuses on delivering a secure, scalable, and user-friendly solution for modern airline ticketing processes.

**Developed by:** Ahmed Medhat - Ali Ahmed - Mohammed Iraqi
**Project Type:** Full-Stack Web Application  
**Architecture:** Client-Server Architecture  
**License:** Proprietary – All rights reserved

---
## Project Structure

### AIRWAY-TICKETS-MANAGEMENT-SYSTEM
```js
AIRWAY-TICKETS-MANAGEMENT-SYSTEM/
├── client/
├── database/
├── server/
└── README.md
```

### Frontend (React.js + Vite)
```js
client/
├── node_modules/
├── public/
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

### Database (MySQL)
```js
database/
└── schema.sql
```

### Backend (SpringBoot Java)
```js
server/
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── airway/
│   │   │           └── tickets_management_system/
│   │   │               ├── TicketsManagementSystemApplication.java
│   │   │               ├── config/
│   │   │               │   └── DatabaseConfig.java
│   │   │               ├── controllers/
│   │   │               │   ├── AuthController.java
│   │   │               │   └── FlightController.java
│   │   │               ├── middleware/
│   │   │               │   └── AuthInterceptor.java
│   │   │               ├── models/
│   │   │               │   ├── Flight.java
│   │   │               │   ├── Passenger.java
│   │   │               │   └── User.java
│   │   │               └── routes/
│   │   │                   └── WebConfig.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── airway/
│                   └── tickets_management_system/
│                       └── TicketsManagementSystemApplicationTests.java
├── target/
├── .gitattributes
├── .gitignore
├── HELP.md
├── mvnw
├── mvnw.cmd
└── pom.xml
```

---
## Technologies Used

### Frontend Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | User Interface Development | 18.x |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | Client-side Routing | 6.x |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | API Communication | 1.x |
| ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) | Responsive UI Styling | 5.x |

### Backend Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) | Core Backend Language | 17 |
| ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white) | Backend Framework | 3.2.0 |
| ![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white) | Database ORM | 3.2.0 |
| ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white) | Persistence Layer | 6.x |
| ![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white) | Dependency Management | 3.8+ |
| ![Session](https://img.shields.io/badge/Session_Cookies-000000?style=for-the-badge&logo=session&logoColor=white) | Authentication | - |

### Database & Tools
| Technology | Purpose | Version |
|------------|---------|---------|
| ![MySQL Workbench](https://img.shields.io/badge/MySQL_Workbench-4479A1?style=for-the-badge&logo=mysql&logoColor=white) | Database Design & Management | 8.x |
| ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) | Version Control | 2.x |
| ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) | API Testing | Latest |

---
## Installation

### Frontend Dependencies
**Step 1. Setup React (JavaScript) + Vite Project:**
```bash
npm create vite@latest
```

**Step 2: Navigate and install dependencies:**
```bash
cd client
npm install
```

**Step 3: Install all dependencies:**
```bash
# React Router DOM
npm install react-router-dom

# Bootstrap 5
npm install bootstrap

# Font Awesome (all icon packages)
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/free-regular-svg-icons
npm install @fortawesome/free-brands-svg-icons
npm install @fortawesome/react-fontawesome
```

---
## License
**PROPRIETARY LICENSE**
© 2026 Ahmed Medhat. All Rights Reserved.
This project is a personal, non-commercial work created solely for the purpose of demonstrating full-stack web development skills.

*This software and associated documentation are proprietary and confidential. No part of this project may be reproduced, distributed, or transmitted in any form without prior written permission from the author.*

---
## Author
* **Ahmed Medhat** – Junior Full Stack Web Developer