import { Song } from "../features/playlists/playlistsSlice";
import { Icon } from "@iconify/react";
import styles from "../styles/Song.module.css";

interface SongProps {
  song: Song;
  size: "wide" | "standard";
  details: boolean;
}

const Song = ({ song, size, details = false }: SongProps) => {
  const getSongTime = () => {
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
      <div className={details ? styles["wrapper-with-details"] : styles.wrapper}>
        <div className={styles.title}>
          <h3>{song.title}</h3>
          <p>{song?.author?.name ?? ""}</p>
        </div>
        <div className={details ? styles.details : styles.hide}>
          <span>{getSongTime()}</span>
        </div>
        <button type="button" aria-label="Like" className={styles["like-btn"]}>
          <Icon icon="mdi:cards-heart-outline" color="white" />
        </button>
        <button type="button" aria-label="Play" className={styles["play-btn"]}>
          <Icon icon="material-symbols:play-circle-rounded" width="100%" color="white" />
        </button>
        <button type="button" aria-label="Context menu" className={styles["context-menu-btn"]}>
          <Icon icon="mdi:dots-vertical" color="white" width="100%" />
        </button>
      </div>
    </div>
  );
};

export default Song;
