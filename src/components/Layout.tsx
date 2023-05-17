import styles from "../styles/Layout.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Modal from "./Modal";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { setSession } from "../features/auth/authSlice";

const Layout = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((state: RootState) => state.auth.session);
  const userPlaylists = useSelector((state: RootState) => state.playlists.userPlaylists);

  const onLogOut = () => {
    supabase.auth.signOut();
    dispatch(setSession(null));
    navigate("/");
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
            <input className={styles.input} type="text" placeholder="Search..." />
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
