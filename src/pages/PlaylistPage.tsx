import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { filterOutPlaylist, getPlaylist } from "../features/playlists/playlistsSlice";
import { useNavigate, useParams } from "react-router-dom";
import Song from "../components/Song";
import styles from "../styles/PlaylistPage.module.css";
import backgroundImage from "../assets/turntable.jpg";
import { Icon } from "@iconify/react";
import { supabase } from "../lib/supabase";
import { addPlaylistToLiked, removePlaylistFromLiked } from "../features/liked-playlists/likedPlaylists";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = useSelector((state: RootState) => state.playlists.selectedPlaylistStatus);
  const fetchedPlaylist = useSelector((state: RootState) => state.playlists.selectedPlaylist);
  const loggedInUserId = useSelector((state: RootState) => state.auth.session?.user.id);
  const likedPlaylists = useSelector((state: RootState) => state.likedPlaylists.likedPlaylists);

  const getSongsTime = () => {
    const songsLengthInSeconds = fetchedPlaylist?.songs.reduce((prev, curr) => prev + curr.time, 0) ?? 0;

    const hours = Math.floor(songsLengthInSeconds / 3600);
    const minutes = Math.floor((songsLengthInSeconds % 3600) / 60);
    const seconds = Math.floor(songsLengthInSeconds % 60);

    if (hours >= 1) return `${hours}hr ${minutes}min ${seconds}s`;
    if (minutes >= 1) return `${minutes}min ${seconds}s`;
    if (seconds >= 1) return `${seconds}s`;
  };

  const addToLikedPlaylist = async () => {
    const { error } = await supabase
      .from("liked-playlists")
      .insert({ user_id: loggedInUserId, playlist_id: playlistId });

    if (error) {
      console.error(error.message);
      return;
    }
    if (!fetchedPlaylist) return;

    dispatch(addPlaylistToLiked(fetchedPlaylist));
  };

  const removeFromLikedPlaylist = async () => {
    const { error } = await supabase
      .from("liked-playlists")
      .delete()
      .match({ user_id: loggedInUserId, playlist_id: playlistId });

    if (error) {
      console.error(error.message);
      return;
    }
    if (!playlistId) return;

    dispatch(removePlaylistFromLiked(playlistId));
  };

  const removePlaylist = async () => {
    if (!playlistId) return;

    const { error } = await supabase.from("playlist").delete().match({ user_id: loggedInUserId, id: playlistId });

    if (error) {
      console.error(error.message);
      return;
    }

    dispatch(filterOutPlaylist(playlistId));
    navigate("/");
  };

  const isPlaylistIncluded = () => {
    if (!likedPlaylists) return false;

    return likedPlaylists.findIndex((playlist) => playlist.id === playlistId) !== -1;
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
          <div className={styles["button-wrapper"]}>
            <button type="button" aria-label="Play" className={styles.btn}>
              <Icon icon="material-symbols:play-circle-rounded" width="100%" color="white" />
            </button>
            {loggedInUserId && (
              <>
                {!isPlaylistIncluded() && (
                  <button type="button" onClick={addToLikedPlaylist} aria-label="Like" className={styles.btn}>
                    <Icon icon="mdi:cards-heart-outline" color="white" width="100%" />
                  </button>
                )}
                {isPlaylistIncluded() && (
                  <button type="button" onClick={removeFromLikedPlaylist} aria-label="Like" className={styles.btn}>
                    <Icon icon="mdi:cards-heart" color="white" width="100%" />
                  </button>
                )}
              </>
            )}
            {fetchedPlaylist?.user_id === loggedInUserId && (
              <button type="button" onClick={removePlaylist} className={styles.btn}>
                <Icon icon="material-symbols:delete-outline" color="white" width="100%" />
              </button>
            )}
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
