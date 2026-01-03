# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## MOOWEE frontend notes

- This folder (`front/y`) is a React + Vite frontend wired to the local MOOWEE backend.
- Expected backend: run `server.js` (defaults to port `5000`). The frontend targets `http://localhost:5000/api`.

Quick start (from `front/y`):

```bash
npm install
npm run dev
```

Usage notes:
- Login: use the app's Login form. On success the JWT is stored in `localStorage`.
- Upload: use the Upload panel to POST a movie file. The upload returns the new movie `_id` — copy it.
- Stream: paste the movie `_id` into the Stream panel to play via `GET /api/stream/:id`.

Important constraints:
- This frontend was adjusted to work with the existing backend without changing server code.
- The backend exposes only `/api/auth/register`, `/api/auth/login`, `/api/movies/upload` and `/api/stream/:id`.
- There is no API to list movies; the app uses the upload response `_id` for streaming.
