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
import { PopupContextProvider } from "./context/popup-context";
import Modal from "./components/Modal";

store.dispatch(getSession());
store.dispatch(getUserPlaylists(""));

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <ErrorBoundary>
        <HomePage />
        <Modal />
      </ErrorBoundary>
    ),
  },
  {
    path: "playlist/:playlistId",
    element: <PlaylistPage />,
  },
  {
    path: "",
    element: (
      <ErrorBoundary>
        <AuthGuard />
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PopupContextProvider>
        <RouterProvider router={router} />
      </PopupContextProvider>
    </Provider>
  </React.StrictMode>,
);
