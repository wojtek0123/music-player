import { Link } from "react-router-dom";
import styles from "../styles/Section.module.css";
import Song from "./Song";
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
              <Song
                details={false}
                size="standard"
                song={song}
                playlistOwnerId={playlist.user_id}
                playlistId={playlist.id}
                key={song.id}
              />
            );
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
