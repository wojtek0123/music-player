import { useState } from "react";
import styles from "../styles/Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { isTextLengthEqualZero } from "../utils/isTextLengthEqualZero";
import { useDispatch } from "react-redux";
import { setSession } from "../features/auth/authSlice";
import { AppDispatch } from "../app/store";
import { getUserPlaylists } from "../features/playlists/playlistsSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"ok" | "loading" | "error">("ok");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (isTextLengthEqualZero(enteredUsername)) return;
    if (isTextLengthEqualZero(enteredEmail)) return;
    if (isTextLengthEqualZero(enteredPassword)) return;
    if (isTextLengthEqualZero(enteredConfirmPassword)) return;
    if (!checkEmailValidation()) return;
    if (checkMinLength(enteredPassword, 8)) return;
    if (!checkPasswordsMatching()) return;

    setStatus("loading");

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: enteredEmail,
      password: enteredPassword,
      options: {
        data: {
          username: enteredUsername,
        },
      },
    });

    clearInputs();

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }

    if (!session) return;

    dispatch(setSession(session));

    const { error: playlistError } = await supabase
      .from("playlist")
      .insert({ name: "liked songs", user_id: session.user.id });

    if (playlistError) {
      setErrorMessage(playlistError.message);
      setStatus("error");
      return;
    }

    setStatus("ok");
    dispatch(getUserPlaylists(session.user.id));
    navigate("/");
  };

  const checkEmailValidation = () => {
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    return pattern.test(enteredEmail);
  };

  const checkMinLength = (text: string, minLength: number) => {
    return text.length < minLength;
  };

  const checkPasswordsMatching = () => {
    return enteredPassword === enteredConfirmPassword;
  };

  const clearInputs = () => {
    setEnteredUsername("");
    setEnteredEmail("");
    setEnteredPassword("");
    setEnteredConfirmPassword("");
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Sign up</h2>
        <input
          type="text"
          onChange={(event) => setEnteredUsername(event.target.value)}
          value={enteredUsername}
          className={styles.input}
          placeholder="Username"
          aria-label="Username"
        />
        {isSubmitted && enteredUsername.length === 0 && status === "ok" && <small>Username is required</small>}
        <input
          type="email"
          onChange={(event) => setEnteredEmail(event.target.value)}
          value={enteredEmail}
          className={styles.input}
          placeholder="Email"
          aria-label="Email"
        />
        {isSubmitted && enteredEmail.length === 0 && status === "ok" && <small>Email is required</small>}
        {isSubmitted && !checkEmailValidation() && enteredEmail.length !== 0 && <small>Email is not valid</small>}
        <input
          type="password"
          onChange={(event) => setEnteredPassword(event.target.value)}
          value={enteredPassword}
          className={styles.input}
          placeholder="Password"
          aria-label="Password"
        />
        {isSubmitted && enteredPassword.length === 0 && status === "ok" && <small>Password is required</small>}
        {isSubmitted && checkMinLength(enteredPassword, 8) && enteredPassword.length !== 0 && (
          <small>Password should have at least 8 characters</small>
        )}
        <input
          type="password"
          onChange={(event) => setEnteredConfirmPassword(event.target.value)}
          value={enteredConfirmPassword}
          className={styles.input}
          placeholder="Confirm password"
          aria-label="Confirm password"
        />
        {isSubmitted && enteredConfirmPassword.length === 0 && status === "ok" && (
          <small>Confirm password is required</small>
        )}
        {isSubmitted && !checkPasswordsMatching() && <small>Passwords are different</small>}
        {errorMessage.length !== 0 && <small>{errorMessage}</small>}
        <button type="submit" className={styles["submit-btn"]}>
          {status === "loading" ? "Loading..." : "Sign up"}
        </button>
        <div className={styles.message}>
          <span>Already have an account?</span>{" "}
          <Link to="/login" className={styles["change-btn"]}>
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterPage;
