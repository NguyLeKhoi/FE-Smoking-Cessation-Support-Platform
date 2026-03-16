# Quit Smoking Mobile (React Native + Expo)

Mobile client for the Smoking Cessation Support Platform.

## Tech Stack

- React Native 0.79
- Expo SDK 53
- React Navigation (stack, drawer, bottom tabs)
- React Native Paper
- Axios
- AsyncStorage

## Features

- Authentication: login, signup, forgot password
- Home/blog feed and blog details
- Blog create and edit
- AI chatbox screen
- Quit plan list, detail, and phase record tracking
- Smoking assessment (quiz)
- Membership plans, subscription, payment success
- Profile, achievements, leaderboard
- Toast-based motivational popup messaging

## Project Structure

```text
mobile/
|-- assets/
|-- components/
|-- navigation/
|-- screens/
|-- service/
|-- theme/
|-- App.js
|-- index.js
|-- app.json
|-- package.json
`-- .env
```

Key files:

- `App.js`: app bootstrap, provider setup, token checks, motivational popup
- `navigation/Navigator.js`: root stack + drawer + tab navigation
- `service/api.js`: Axios client, auth header injection, token utilities

## Environment Variable

Create `mobile/.env` with:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Note:

- `service/api.js` has fallback `http://localhost:8000/api/v1`.
- On a physical device, `localhost` points to the device itself, so use LAN/public backend URL instead.

## Installation

```bash
npm install
```

## Run

```bash
npm run start
```

Then choose target in Expo:

- `a`: Android emulator/device
- `i`: iOS simulator (macOS only)
- `w`: web preview

Or run directly:

```bash
npm run android
npm run ios
npm run web
```

## Scripts

- `npm run start`: start Expo development server
- `npm run android`: open on Android
- `npm run ios`: open on iOS
- `npm run web`: run app in browser through Expo

## Authentication Notes

- Access token is stored in `AsyncStorage`.
- Request interceptor injects `Authorization: Bearer <token>`.
- App includes token status/debug helpers in `service/api.js`.
- Navigation chooses initial screen based on `isAuthenticated()` check.

## Main Navigation Flows

- Auth stack: `Login`, `SignUp`, `ForgotPassword`
- Main app: drawer + bottom tabs
- Tab modules: Home/Blog, AI Coach, Quit Plan, Profile
- Additional stack screens: Blog detail/create/edit, quiz, membership, subscription, payment, achievements, phase records
