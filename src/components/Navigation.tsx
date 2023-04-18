import styles from "../styles/Navigation.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Link } from "react-router-dom";

const Navigation = () => {
  const session = useSelector((state: RootState) => state.auth.session);

  return (
    <nav className={styles.nav}>
      <h1>Music-Streamer</h1>
      {!session && <Link to="/login">Sign in</Link>}
      {session && <span>{session.user.user_metadata.username}</span>}
    </nav>
  );
};

export default Navigation;
