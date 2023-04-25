import { Song } from "../features/playlists/playlistsSlice";
import { Icon } from "@iconify/react";
import styles from "../styles/Song.module.css";

interface SongProps {
  song: Song;
  size: "wide" | "standard";
}

const Song = ({ song, size }: SongProps) => {
  const getSongTime = () => {
    // const songsLengthInSeconds = playlist?.songs.reduce((prev, curr) => prev + curr.time, 0) ?? 0;

    const hours = Math.floor(song.time / 3600);
    const minutes = Math.floor((song.time % 3600) / 60);
    const seconds = Math.floor(song.time % 60);

    if (hours >= 1) return `${hours}hr ${minutes}min ${seconds}s`;
    if (minutes >= 1) return `${minutes}min ${seconds}s`;
    if (seconds >= 1) return `${seconds}s`;
  };

  return (
    <div className={size === "wide" ? styles.wide + " " + styles.song : styles.standard + " " + styles.song}>
      <Icon className={styles.icon} icon="zondicons:music-album" color="white" width="100%" />
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h3>{song.title}</h3>
          <p>{song?.author?.name ?? ""}</p>
        </div>
        <div className={styles.details}>
          <span>{getSongTime()}</span>
        </div>
        <button type="button" className={styles["like-btn"]}>
          <Icon icon="mdi:cards-heart-outline" color="white" />
        </button>
      </div>
    </div>
  );
};

export default Song;
