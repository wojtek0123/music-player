import { useEffect } from "react";
import Navigation from "../components/Navigation";
import styles from "../styles/Home.module.css";
import { useDispatch } from "react-redux";
import { supabase } from "../helpers/supabase";
import { setSession } from "../features/auth/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      dispatch(setSession(session));
    })();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Navigation />
    </div>
  );
};

export default HomePage;
