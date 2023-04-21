import type { Song } from "../helpers/types";
import styles from "../styles/Section.module.css";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface SectionProps {
  songs: Song[];
  header: string;
}

const Section = ({ songs, header }: SectionProps) => {
  const [displayedSongs, setDisplayedSongs] = useState(songs.slice(0, 4));
  const [displayedCount, setDisplayedCount] = useState(4);

  const handleShowMoreLess = () => {
    const newCount = displayedCount >= songs.length ? 4 : displayedCount + 5;
    const newDisplayedSongs = songs.slice(0, newCount);
    setDisplayedSongs(newDisplayedSongs);
    setDisplayedCount(newCount);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.header}>{header}</h2>
      <div className={styles.songs}>
        {displayedSongs.map((song) => (
          <div className={styles.song} key={song.id}>
            <Icon className={styles.icon} icon="zondicons:music-album" color="white" />
            <div className={styles.wrapper}>
              <div className={styles.title}>
                <h3>{song.title}</h3>
                <p>{song.author}</p>
              </div>
              <button type="button" className={styles["like-btn"]}>
                <Icon icon="mdi:cards-heart-outline" color="white" />
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={styles["show-more-btn"]} onClick={handleShowMoreLess}>
          {displayedCount >= songs.length ? "Show less" : "Show more"}
        </button>
      </div>
    </section>
  );
};
export default Section;
