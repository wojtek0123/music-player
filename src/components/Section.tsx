import { Link } from "react-router-dom";
import styles from "../styles/Section.module.css";
import { Playlist } from "../features/playlists/playlistsSlice";
import Song from "./Song";

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
            return <Song size="standard" song={song} key={song.id} />;
          }
        })}
        <Link to={"/playlist/" + playlist.id} className={styles["show-more-btn"]}>
          Show more
        </Link>
      </div>
    </section>
  );
};
export default Section;
