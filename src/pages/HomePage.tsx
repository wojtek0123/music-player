import styles from "../styles/Home.module.css";
import Section from "../components/Section";
import useGetDefaultPlaylists from "../hooks/useDefaultPlaylists";
import { useDispatch } from "react-redux";
import { changeSong } from "../features/player/playerSlice";

const HomePage = () => {
  const { mostPopularPlaylist, trendingPlaylist, status } = useGetDefaultPlaylists();

  // ! temp - remove later
  const dispatch = useDispatch();
  const songIds = ["ba898259-9001-44b1-a2ef-051922bcfcb3", "a57f8f99-9f15-4b62-b0d5-2677a5ad3da3"];
  const rsb = (
    <button
      style={{ position: "absolute", top: 0 }}
      onClick={() => dispatch(changeSong(songIds[Math.round((songIds.length - 1) * Math.random())]))}
    >
      change song
    </button>
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {status === "loading" && <div className={styles.message}>Loading...</div>}
        {status === "failed" && (
          <div className={styles.message}>
            <p>Error!</p>
            <p>Something went wrong. You should try later.</p>
          </div>
        )}
        {status === "succeeded" && (
          <>
            <Section playlist={trendingPlaylist} />
            <Section playlist={mostPopularPlaylist} />
          </>
        )}
      </div>
      {rsb}
    </main>
  );
};

export default HomePage;
