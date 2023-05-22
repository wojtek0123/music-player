import styles from "../styles/Layout.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { createSearchParams, Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Modal from "./Modal";
import { FormEvent, useState } from "react";
import { Icon } from "@iconify/react";
import { setSession } from "../features/auth/authSlice";

const Layout = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(false);
  const [enteredText, setEnteredText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((state: RootState) => state.auth.session);
  const userPlaylists = useSelector((state: RootState) => state.playlists.userPlaylists);

  const onLogOut = async () => {
    await supabase.auth.signOut();
    dispatch(setSession(null));
    navigate("/");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (enteredText.length === 0) {
      setErrorMessage("You cannot search empty text");
      return;
    }

    navigate({
      pathname: "search",
      search: createSearchParams({
        text: enteredText,
      }).toString(),
    });

    setErrorMessage("");
  };

  return (
    <>
      <nav className={styles.nav}>
        <button type="button" className={styles.hamburger} onClick={() => setVisibility((prevState) => !prevState)}>
          <Icon icon="pajamas:hamburger" color="white" width="100%" />
        </button>

        <Link to="/" className={styles["search-btn"]}>
          <Icon icon="material-symbols:search" color="white" width="100%" />
        </Link>
      </nav>
      <main className={styles.main}>
        <aside className={visibility ? styles.aside + " " + styles.show : styles.aside}>
          <div className={styles.container}>
            <Link className={styles.logo} to="/">
              Music Streamer
            </Link>
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles["form-wrapper"]}>
                <input
                  className={styles.input}
                  onChange={(event) => setEnteredText(event.target.value)}
                  value={enteredText}
                  type="text"
                  placeholder="Search..."
                  aria-label="Search song"
                />
                <button type="submit" className={styles["submit-btn"]}>
                  Search
                </button>
              </div>
              <small>{errorMessage}</small>
            </form>
            {!session && (
              <Link className={styles["menu-field"]} to="/login">
                Sign in
              </Link>
            )}
            {session && (
              <>
                <div className={styles["header-container"]}>
                  <span className={styles.username}>{session.user.user_metadata.username}</span>
                  <button type="button" className={styles["menu-field"]} aria-label="Log out" onClick={onLogOut}>
                    <Icon icon="material-symbols:logout" color="white" />
                  </button>
                </div>

                <div className={styles["header-container"]}>
                  <h2>Playlists</h2>
                  <Modal />
                </div>
                <ul className={styles.list}>
                  {userPlaylists.map((userPlaylist) => (
                    <li className={styles["menu-field"]} key={userPlaylist.id}>
                      <Link className={styles.link} to={"/playlist/" + userPlaylist.id}>
                        {userPlaylist.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </aside>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
