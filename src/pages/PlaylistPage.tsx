import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { getPlaylist } from "../features/playlists/playlistsSlice";
import { useParams } from "react-router-dom";
import Song from "../components/Song";
import styles from "../styles/PlaylistPage.module.css";
import backgroundImage from "../assets/turntable.jpg";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.playlists.selectedPlaylistStatus);
  const fetchedPlaylist = useSelector((state: RootState) => state.playlists.selectedPlaylist);

  const getSongsTime = () => {
    const songsLengthInSeconds = fetchedPlaylist?.songs.reduce((prev, curr) => prev + curr.time, 0) ?? 0;

    const hours = Math.floor(songsLengthInSeconds / 3600);
    const minutes = Math.floor((songsLengthInSeconds % 3600) / 60);
    const seconds = Math.floor(songsLengthInSeconds % 60);

    if (hours >= 1) return `${hours}hr ${minutes}min ${seconds}s`;
    if (minutes >= 1) return `${minutes}min ${seconds}s`;
    if (seconds >= 1) return `${seconds}s`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!playlistId) return;
    dispatch(getPlaylist(playlistId));
  }, [dispatch, playlistId]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "failed") {
    return <div>Something went wrong! Try later</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={backgroundImage} alt="" />
        <div className={styles.body}>
          <h2>{fetchedPlaylist?.name ?? ""}</h2>
          <div className={styles.details}>
            <span>{fetchedPlaylist?.songs.length ?? 0} songs</span>
            <span>|</span>
            <span>{getSongsTime()}</span>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <ul className={styles.list}>
          {fetchedPlaylist?.songs.map((song) => (
            <Song
              playlistId={fetchedPlaylist.id}
              playlistOwnerId={fetchedPlaylist.user_id}
              details={true}
              size="wide"
              song={song}
              key={song.id}
            />
          ))}
        </ul>
      </main>
    </div>
  );
};

export default PlaylistPage;
