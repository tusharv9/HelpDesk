# HelpDesk Service

This project is a Helpdesk management application. It has been converted to use **Podman** for containerization and local orchestration.

## Tech Stack
- **Backend:** .NET 10 (ASP.NET Core Web API)
- **Frontend:** React + TypeScript + Vite
- **Database:** PostgreSQL 15

---

## Prerequisites
To run this project, you need [Podman](https://podman.io/) installed.

### Installing Podman on macOS
1. Install Podman via [Homebrew](https://brew.sh/):
   ```bash
   brew install podman
   ```
2. Initialize and start the Podman machine (required on macOS/Windows):
   ```bash
   podman machine init
   # Increase machine resources (recommended for building .NET apps)
   podman machine set --cpus 2 --memory 2048
   podman machine start
   ```
3. (Optional) Podman Compose is natively supported since Podman v4.x. If needed, install `podman-compose`:
   ```bash
   brew install podman-compose
   ```

---

## Running the Application with Podman Compose

The services are configured in `compose.yaml` and build the backend using `backend/Containerfile`.

### 1. Start the services
Run the following command in the project root:
```bash
podman compose up --build -d
```
*Note: If you are using the `podman-compose` python tool directly, you can run:*
```bash
podman-compose up --build -d
```

### 2. Verify containers are running
```bash
podman ps
```
You should see:
- `helpdesk-postgres` running on port `5432`
- `helpdesk-api-container` running on port `5000`

### 3. Check logs
```bash
podman compose logs -f
```

### 4. Stop the services
```bash
podman compose down
```

---

## Accessing the API & Database

- **Backend API (Swagger UI):** [http://localhost:5000/swagger](http://localhost:5000/swagger)
- **PostgreSQL Database:**
  - Host: `localhost`
  - Port: `5432`
  - Database: `HelpdeskDB`
  - Username: `postgres`
  - Password: `postgres`

---

## Local Development (Without Containers)

### Backend
1. Make sure a PostgreSQL instance is running on localhost:5432 (or update connection string in `backend/appsettings.Development.json`).
2. Run backend:
   ```bash
   cd backend
   dotnet run
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start local Vite server:
   ```bash
   npm run dev
   ```
