import styles from "../styles/Home.module.css";
import Section from "../components/Section";
import { useEffect, useState } from "react";
import { Playlist, Status } from "../features/playlists/playlistsSlice";
import { supabase } from "../lib/supabase";

const HomePage = () => {
  const [defaultPlaylists, setDefaultPlaylists] = useState<Playlist[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const getDefaultPlaylists = async () => {
    setStatus("loading");
    const { data, error } = await supabase
      .from("playlist")
      .select("id, name, user_id, created_at, songs:song( *, author ( * ) )")
      .is("user_id", null);

    if (error) {
      setStatus("failed");
      setErrorMessage(error.message);
      throw new Error(error.message);
    }
    setStatus("succeeded");
    return data as Playlist[];
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      const response = await getDefaultPlaylists();

      if (!ignore) {
        setDefaultPlaylists(response);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {status === "loading" && <div className={styles.message}>Loading...</div>}
        {status === "failed" && <div className={styles.message}>{errorMessage}</div>}
        {status === "succeeded" &&
          defaultPlaylists.map((playlist) => <Section key={playlist.id} playlist={playlist} />)}
      </div>
    </main>
  );
};

export default HomePage;
