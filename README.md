GestionCongeTenstep - Employee Leave Management System
GestionCongeTenstep is a feature-rich, customizable leave management system designed for employees and managers. Built using the Mantis React Material UI template, it provides an intuitive interface for requesting, managing, and approving leave requests. Employees can easily submit requests while managers have the ability to review and approve or reject leave applications, all within a seamless user experience.


Key Features
Role-based access control: Separate views for employees and managers.
Responsive and modern design using Material UI React components.
Employees can request leave, view approved leave, and track requests.
Managers can approve/reject leave requests and view all employee leaves.
JWT-based authentication for secure access.
Built using React, Redux Toolkit, and React Router for efficient state management and navigation.
Supports Role-based Menu Rendering: Menu items change dynamically based on the user role.
Easy to extend and customize for future needs.

Installation Guide
Getting Started
Clone the repository
bash
Copier le code
git clone https://gitlab.com/tenstep/gestioncongefrontend.git
Install dependencies
Copier le code
yarn install
Start the development server
sql
Copier le code
yarn start
Authentication
This system uses JWT (JSON Web Tokens) to authenticate users. Upon successful login, the user is assigned a token that stores essential information like the user’s role (EMPLOYEE or MANAGER). This token is saved in local storage and helps determine access to specific pages and features.

Role-Based Access
Employee role has access to:

Submit leave requests
View accepted leaves
View leave history
Manager role has access to:

Approve/Reject leave requests
View all employee leave details
Technology Stack
The Employee Leave Management System is built with the following tools and technologies:

Material UI V5: For building intuitive, responsive components.
React: A modern JavaScript library for building fast user interfaces.
Redux Toolkit: For efficient state management.
React Router: Handles navigation between different pages in the app.
JWT: For secure authentication and role-based access.
Vite: For fast builds and optimized performance.
How the App Works
Login and Authentication:

Users log in with their credentials.
JWT is issued, stored in localStorage, and used for authentication.
Role-based Menu:

Depending on the user role (EMPLOYEE or MANAGER), the app renders different menu items and features.
Employees can only see options related to their leave requests.
Managers get an extended menu for managing leave requests from multiple employees.
Leave Request Workflow:

Employees submit leave requests via a simple form.
Managers can view these requests in their dashboard and approve or reject them.
Screenshots
Employee Dashboard

Manager Dashboard

How to Contribute
If you want to improve this app or fix bugs, please follow these steps:

Issues
If you encounter any issues or bugs, please create a GitHub issue to report them.

License
This project is licensed under tenstep co.

More Info
This application is built on top of the Mantis React Material UI template, providing a robust and scalable foundation for your web apps. Explore more about Mantis here:

Mantis Free Version
Mantis Pro Version