# Mittweida Project

This repository contains the full-stack Mittweida application, including both backend (NestJS) and frontend (React + Vite) projects.

## Project Structure

```folder
mittweida/
├── backend/    # NestJS API server
├── frontend/   # React + Vite web client
├── api_v0.1.json
└── README.md   # Project documentation
```

## Getting Started

### 1. Start the Backend

Navigate to the backend folder and install dependencies:

```sh
cd backend
npm install
```

Run the backend server (development mode):

```sh
npm run start:dev
```

The backend will print the actual IP and port it is running on in the console (e.g., `http://192.168.0.2:3000` or `http://localhost:3000`). Copy this exact URL for the next step.

### 2. Configure the Frontend

Navigate to the frontend folder:

```sh
cd ../frontend
```

Create a `.env` file in the `frontend` directory (if not present) and set the backend API URL:

```env
VITE_API_URL=<your-backend-url>
```

Paste the exact backend URL printed in the console (e.g., `http://192.168.0.2:3000` or `http://localhost:3000`) as the value for `VITE_API_URL`.

### 3. Start the Frontend

Install frontend dependencies:

```sh
npm install
```

Run the frontend development server:

```sh
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as shown in your terminal).

---

## API Documentation

- The OpenAPI specification for the backend is stored in [`api_v0.1.json`](./api_v0.1.json).
- After starting the backend, interactive Swagger documentation is available at `http://<your-backend-url>/api` (e.g., `http://localhost:3000/api`).

## Additional Notes

- Backend data is seeded from CSV files in `backend/data/`.
- Frontend expects the backend API URL in the `.env` file as `VITE_API_URL`.
- For production, build both projects and deploy as needed.

## Resources

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
