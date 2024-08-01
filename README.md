# Hospital Triage Application (CSI3140 A4)

This web application was made for assignment 4 of CSI3140 by Jay Ghosh and Noah do Régo. The admin user can add/admit patients to the triage queue,
and patients can log in using their assigned user code to see their wait time and severity.

**Please note that the patient wait times update as follows:**

| When patients are added   | When patients are admitted |
| ------------------------- | -------------------------- |
| Critical severity: +5 min | Critical severity: -20 min |
| High severity: +10 min    | High severity: -15 min     |
| Medium severity +15 min   | Medium severity -10 min    |
| Low severity +20 min      | Low severity -5 min        |

## Installation

### Prerequisites

The following libraries, frameworks and tools must be installed in order to run the web app:

- PostgreSQL: can be download via website (https://www.postgresql.org/), and pgAdmin 4 can be downloaded to set up/manage the database (https://www.pgadmin.org/download/).
- Composer for php: Can be downloaded through their site (https://getcomposer.org/download/) or via homebrew on MacOS
- Node.js: Runtime engine for JS, used to run React (https://nodejs.org/en)

### Setting Up the Backend Application

Navigate to the `backend` directory. Then run the command `composer update`.

For this project, Postgres is being used for DB management. To properly set up and access the backend application, create the following file at the specific path: `backend/backend.env`.

In the file, enter the following data:

```env
DB_HOST=<your-db-host (default = localhost)>
DB_PORT=<your-db-port (default = 5432)>
DB_NAME=<your-db-name>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
```

After the empty db is setup, you can run the code in `setup.sql` to define the db tables and data. You can either run it using the psql terminal, or navigate to the correct db in pgAdmin
and copy/paste the code into the Query Tool (right-click public schema -> Query tool), then run the code.

### Setting Up the Frontend Application

Navigate to the `frontend` directory. Then, run the following commands:

```
npm install # this will create node_modules folder and package-lock.json
npm start # this will start your react app
```

## Logins

- **To login as admin, use the following credentials: username = admin, password = adminCSI3140**
- To login as a user, use one of the user codes from the admin view

## App Layout

Users must select the login type that they desire (patient/admin)

Admins must login with the appropriate credentials (username: admin / password: adminCSI3140)

Users must login with their assigned user code (can be viewed from the admin page).

![Login Page UI](./frontend/src/images/login.png)

### Admin Layout

Admins can add patients using the "Add Patient" button at the top right

Admins can view the queue of patients and admit them by selecting the checkmark next to a specific user's row.

![Admin Page UI](./frontend/src/images/adminpage.png)\

### Patient Layout

Patients can login using their assigned user code to view their estimated wait time and other details.

![User Page UI](./frontend/src/images/userpage.png)
