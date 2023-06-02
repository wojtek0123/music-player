import React from "react";
import { store } from "./app/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import "../src/styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AuthGuard from "./components/AuthGuard";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";
import PlaylistPage from "./pages/PlaylistPage";
import { getUserPlaylists } from "./features/playlists/playlistsSlice";
import { getSession } from "./features/auth/authSlice";
import { getUserLikedPlaylists } from "./features/liked-playlists/likedPlaylists";
import Layout from "./components/Layout";
import SearchPage from "./pages/SearchPage";

store.dispatch(getSession());
store.dispatch(getUserPlaylists(""));
store.dispatch(getUserLikedPlaylists());

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <ErrorBoundary>
        <Layout></Layout>
      </ErrorBoundary>
    ),
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/search",
        element: <SearchPage />
      },
      {
        path: "playlist/:playlistId",
        element: <PlaylistPage />,
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ErrorBoundary>
        <AuthGuard />
        <LoginPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "/register",
    element: (
      <ErrorBoundary>
        <AuthGuard />
        <RegisterPage />
      </ErrorBoundary>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
