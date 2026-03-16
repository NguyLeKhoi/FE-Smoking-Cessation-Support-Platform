# Quit Smoking Web (React)

Web client for the Smoking Cessation Support Platform.

## Tech Stack

- React 19 + Create React App
- React Router
- Material UI (MUI)
- Axios
- Socket.IO client
- LiveKit (video call)

## Features

- Authentication: login, signup, forgot/reset password, Google OAuth redirect
- Quit plan flow: assessment, habit check, plan details, phase records
- Blog: list, detail, create, edit, user posts, reactions, comments
- Membership and payment pages
- Coach list and member chat page
- Profile, notifications, leaderboard, achievements
- Admin dashboard routes (`/admin/*`)

## Project Structure

```text
web/
|-- public/
|-- src/
|   |-- components/
|   |-- context/
|   |-- layout/
|   |-- pages/
|   |-- router/
|   |-- services/
|   |-- styles/
|   |-- theme/
|   `-- utils/
|-- package.json
`-- .env
```

Key files:

- `src/App.js`: app bootstrap, providers, token auto-refresh start/stop
- `src/router/Router.js`: all route definitions and guarded routes
- `src/services/api.js`: Axios instance and token refresh interceptor

## Environment Variables

Create `web/.env` with:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_BACKEND_GOOGLE_AUTH_URL=http://localhost:8000/api/v1/auth/google
REACT_APP_LIVEKIT_URL=ws://localhost:7880
REACT_APP_SOCKET_URL=http://localhost:8000/chat
REACT_APP_NOTIFICATION_SOCKET_URL=http://localhost:8000/notification
```

## Installation

```bash
npm install
```

## Run

```bash
npm start
```

App runs at `http://localhost:3000` by default.

## Scripts

- `npm start`: start development server
- `npm run build`: production build
- `npm test`: run tests
- `npm run eject`: eject CRA config

## Authentication Notes

- Access token is stored in `localStorage`.
- API interceptor attaches `Authorization: Bearer <token>`.
- On `401`, app attempts refresh via `/auth/refresh` and retries failed request.
- If refresh fails, auth state is cleared and user is redirected to `/login`.

## Main Route Groups

- Public: `/`, `/blog`, `/blog/:id`, auth pages
- Protected user: `/profile`, `/quit-plan`, `/my-blog`, `/leaderboard`, `/notifications`
- Membership-protected: `/coaches-list`, `/chat-page`
- Admin-protected: `/admin/*`
