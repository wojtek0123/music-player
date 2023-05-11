import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Auth.module.css";
import { checkEmailValidation } from "../utils/emailValidation";
import { checkMinLength } from "../utils/minLength";
import { isTextLengthEqualZero } from "../utils/isTextLengthEqualZero";
import { useDispatch } from "react-redux";
import { setSession } from "../features/auth/authSlice";
import { getUserPlaylists } from "../features/playlists/playlistsSlice";
import { AppDispatch } from "../app/store";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<"ok" | "loading" | "error">("ok");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (isTextLengthEqualZero(enteredEmail)) return;
    if (isTextLengthEqualZero(enteredPassword)) return;
    if (!checkEmailValidation(enteredEmail)) return;
    if (checkMinLength(enteredPassword, 8)) return;

    setStatus("loading");

    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: enteredEmail,
      password: enteredPassword,
    });

    clearInputs();

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }

    dispatch(setSession(session));
    dispatch(getUserPlaylists(session?.user.id ?? ""));
    setStatus("ok");
    navigate("/");
  };

  const clearInputs = () => {
    setEnteredEmail("");
    setEnteredPassword("");
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Sign in</h2>
        <input
          type="email"
          onChange={(event) => setEnteredEmail(event.target.value)}
          value={enteredEmail}
          className={styles.input}
          placeholder="Email"
          aria-label="Email"
        />
        {isSubmitted && enteredEmail.length === 0 && errorMessage.length === 0 && <small>Email is required</small>}
        {isSubmitted && !checkEmailValidation(enteredEmail) && enteredEmail.length !== 0 && (
          <small>Email is not valid</small>
        )}
        <input
          type="password"
          onChange={(event) => setEnteredPassword(event.target.value)}
          value={enteredPassword}
          className={styles.input}
          placeholder="Password"
          aria-label="Password"
        />
        {isSubmitted && enteredPassword.length === 0 && errorMessage.length === 0 && (
          <small>Password is required</small>
        )}
        {isSubmitted && checkMinLength(enteredPassword, 8) && enteredPassword.length !== 0 && (
          <small>Password should have at least 8 characters</small>
        )}

        {errorMessage.length !== 0 && <span className={styles["error-message"]}>{errorMessage}</span>}
        <button type="submit" className={styles["submit-btn"]}>
          {status === "loading" ? "Loading..." : "Sign in"}
        </button>
        <div className={styles.message}>
          <span>Already have an account?</span>{" "}
          <Link to="/register" className={styles["change-btn"]}>
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
