import { Link } from "react-router-dom";
import styles from "../styles/Section.module.css";
import { Icon } from "@iconify/react";
import { Playlist } from "../helpers/types";

interface SectionProps {
  playlist: Playlist | undefined;
}

const displayNumberOfSongs = 5;

const Section = ({ playlist }: SectionProps) => {
  if (!playlist) {
    return <div>No playlist to display</div>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.header}>{playlist.name}</h2>
      <div className={styles.songs}>
        {playlist.songs.map((song, index) => {
          if (index < displayNumberOfSongs) {
            return (
              <div className={styles.song} key={song.id}>
                <Icon className={styles.icon} icon="zondicons:music-album" color="white" width="100%" />
                <div className={styles.wrapper}>
                  <div className={styles.title}>
                    <h3>{song.title}</h3>
                    <p>{song?.author?.name ?? ""}</p>
                  </div>
                  <button type="button" className={styles["like-btn"]}>
                    <Icon icon="mdi:cards-heart-outline" color="white" />
                  </button>
                </div>
              </div>
            );
          }
        })}
        <Link to={"/"} className={styles["show-more-btn"]}>
          Show more
        </Link>
      </div>
    </section>
  );
};
export default Section;
