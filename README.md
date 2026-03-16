# FE Smoking Cessation Support Platform

This repository contains two front-end applications for a smoking cessation support platform:

- `mobile/`: React Native app (Expo)
- `web/`: React web app (Create React App)

Both clients connect to the same backend API and share major business domains: authentication, quit plan management, blog/community, membership/subscription, achievements, chat, and profile management.

## Repository Structure

```text
FE/
|-- mobile/    # React Native + Expo client
|-- web/       # React + MUI web client
`-- README.md
```

## Core Features

- User authentication (login, signup, forgot/reset password)
- Smoking assessment and quit plan tracking
- Blog posting, editing, comments, and reactions
- Membership plans and subscription/payment flows
- Leaderboard and achievements
- Coach listing and user profile management
- Real-time chat, notifications, and video call integration (web)

## Tech Stack

- Mobile: React Native, Expo, React Navigation, React Native Paper, Axios
- Web: React 19, React Router, MUI, Axios, Socket.IO client, LiveKit
- Shared patterns: JWT access token usage, refresh handling, service-layer API modules

## Prerequisites

- Node.js 18+
- npm 9+
- For mobile:
	- Expo CLI (optional if using `npx expo ...`)
	- Android Studio emulator / iOS simulator / Expo Go app

## Environment Variables

### Web (`web/.env`)

Required variables used in code:

- `REACT_APP_API_URL`
- `REACT_APP_BACKEND_GOOGLE_AUTH_URL`
- `REACT_APP_LIVEKIT_URL`
- `REACT_APP_SOCKET_URL`
- `REACT_APP_NOTIFICATION_SOCKET_URL`

Example:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_BACKEND_GOOGLE_AUTH_URL=http://localhost:8000/api/v1/auth/google
REACT_APP_LIVEKIT_URL=ws://localhost:7880
REACT_APP_SOCKET_URL=http://localhost:8000/chat
REACT_APP_NOTIFICATION_SOCKET_URL=http://localhost:8000/notification
```

### Mobile (`mobile/.env`)

Required variable used in code:

- `EXPO_PUBLIC_API_BASE_URL`

Example:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Note: `mobile/service/api.js` has a localhost fallback (`http://localhost:8000/api/v1`). On a physical device this may not work unless your backend is reachable from the device network.

## Setup and Run

### 1. Mobile App (Expo)

```bash
cd mobile
npm install
npm run start
```

Useful scripts:

- `npm run android`
- `npm run ios`
- `npm run web`

Main entry points:

- `mobile/App.js`
- `mobile/navigation/Navigator.js`
- `mobile/service/api.js`

### 2. Web App (CRA)

```bash
cd web
npm install
npm start
```

Other scripts:

- `npm run build`
- `npm test`

Main entry points:

- `web/src/App.js`
- `web/src/router/Router.js`
- `web/src/services/api.js`

## Key Modules Overview

### Mobile (`mobile/`)

- Navigation: `navigation/`
- Screens by domain: `screens/auth`, `screens/blog`, `screens/quit-plan`, `screens/profile`, etc.
- API services: `service/*.js` (auth, blog, chat, membership, quitPlan, subscription, user...)
- Reusable UI: `components/`

### Web (`web/src/`)

- Routing and route guards: `router/Router.js`, `components/ProtectedRoute.js`
- Pages by domain: `pages/auth`, `pages/blog`, `pages/quit-plans`, `pages/profile`, `pages/admin`, etc.
- API services: `services/*.js`
- Layout/theme/context: `layout/`, `theme/`, `context/`

## Authentication and Token Handling

- Web:
	- Access token in `localStorage`
	- Auto-refresh and retry logic in `web/src/services/api.js`
	- Refresh failure clears auth state and redirects to `/login`
- Mobile:
	- Access token in `AsyncStorage`
	- Request interceptor injects bearer token
	- Token utility and refresh-related handling in `mobile/service/api.js`

## Notes

- This repository contains front-end clients only.
- Backend service endpoints are configured through environment variables.
- If both apps are developed together, keep API and socket URLs aligned to the same backend environment.