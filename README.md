# TravelMapFrontend

**TravelMapFrontend** is a social travel platform designed to connect explorers and share journeys. It features interactive maps, real-time communication, and gamified trip tracking to make travel planning and sharing an engaging experience.

## Application Link

[Open Application](https://travel-map-frontend.onrender.com)

> ⚠️ **Note:**  
> The application is hosted on Render (free tier).  
> The **first load may take up to 20–30 seconds** due to a cold start if the service was inactive.  
> Subsequent loads are significantly faster.

## Backend

The frontend communicates with a dedicated backend service:

- **Repository**: https://github.com/yagorka1/travel-map-backend
- **Tech Stack**: NestJS, PostgreSQL, WebSockets (Socket.io), JWT authentication
- **Responsibilities**:
  - User authentication and authorization
  - Trip and route management
  - Real-time chat functionality
  - Leaderboard and gamification logic

## Key Features

- **📊 Dashboard**: Visualize your travel statistics and recent activity at a glance.
- **🗺️ Trip Management**: Plan and track your trips on an interactive map using Leaflet.
- **💬 Real-time Chats**: Connect with other travelers instantly via Socket.io powered messaging.
- **🏆 Leaderboard**: Compete with other users and track your ranking based on travel achievements.
- **⚙️ User Settings**: Customize your profile and application preferences.

## Architecture & Technologies

The application is built with a modern, scalable frontend stack:

- **Framework**: [Angular](https://angular.io/) (Latest version)
- **State Management**: [NgRx](https://ngrx.io/) (Store, Effects, Entity) for robust reactive state management.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first, responsive design.
- **Maps**: [Leaflet](https://leafletjs.com/) for interactive map visualizations.
- **Real-time**: [Socket.io Client](https://socket.io/) for live chat functionality.
- **Build System**: [Nx](https://nx.dev/) monorepo for efficient build and test execution.

## Setup & Installation

1. Install dependencies:
   ```sh
   npm install
   ```

## Development Server

To run the dev server for your app, use:

```sh
npx nx serve travel-map-frontend
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

To create a production bundle:

```sh
npx nx build travel-map-frontend
```

## Running Tests

To execute the unit tests via [Jest](https://jestjs.io):

```sh
npx nx test travel-map-frontend
```

To execute the end-to-end tests via [Cypress](https://www.cypress.io):

```sh
npx nx e2e travel-map-frontend-e2e
```

## Linting

To lint the project (and fix issues):

```sh
npx nx lint travel-map-frontend
```
