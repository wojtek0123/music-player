import Navigation from "../components/Navigation";
import styles from "../styles/Home.module.css";
import Section from "../components/Section";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Playlist } from "../helpers/types";

const HomePage = () => {
  const [trendingPlaylist, setTrendingPlaylist] = useState<Playlist>();
  const [mostPopularPlaylist, setMostPopularPlaylist] = useState<Playlist>();
  const [status, setStatus] = useState<"ok" | "loading" | "error" | "idle">("idle");

  const getPlaylists = async () => {
    setStatus("loading");
    try {
      const { data: playlists, status } = await supabase
        .from<"playlist", Playlist>("playlist")
        .select("id, name, songs:song( *, author ( * ) )");

      if (status !== 200) {
        throw new Error("Something went wrong!");
      }

      if (!playlists?.at(0)?.songs) {
        setStatus("error");
        return;
      }

      setStatus("ok");

      playlists.map((playlist) => {
        if (playlist.name === "trending") {
          const trendingPlaylist = playlists?.filter((playlist) => playlist.name === "trending").at(0);

          setTrendingPlaylist(trendingPlaylist as Playlist);
        }

        if (playlist.name === "most popular") {
          const mostPopularPlaylist = playlists?.filter((playlist) => playlist.name === "most popular").at(0);

          setMostPopularPlaylist(mostPopularPlaylist as Playlist);
        }
      });
    } catch (error) {
      setStatus("error");
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <main className={styles.main}>
      <Navigation />
      <div className={styles.container}>
        {status === "loading" && <div className={styles.message}>Loading...</div>}
        {status === "error" && (
          <div className={styles.message}>
            <p>Error!</p>
            <p>Something went wrong. You should try later.</p>
          </div>
        )}
        {status === "ok" && (
          <>
            <Section playlist={trendingPlaylist} />
            <Section playlist={mostPopularPlaylist} />
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;
