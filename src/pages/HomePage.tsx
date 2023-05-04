import styles from "../styles/Home.module.css";
import Section from "../components/Section";
import useGetDefaultPlaylists from "../hooks/useDefaultPlaylists";

const HomePage = () => {
  const { mostPopularPlaylist, trendingPlaylist, status } = useGetDefaultPlaylists();

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
    </main>
  );
};

export default HomePage;
