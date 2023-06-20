import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { filterOutPlaylist, getPlaylist } from "../features/playlists/playlistsSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Song, { options } from "../components/Song";
import styles from "../styles/PlaylistPage.module.css";
import backgroundImage from "../assets/turntable.jpg";
import { Icon } from "@iconify/react";
import { supabase } from "../lib/supabase";
import { addPlaylistToLiked, removePlaylistFromLiked } from "../features/liked-playlists/likedPlaylists";
import { toast } from "react-toastify";
import { changeSong, playToggle, pushQueue } from "../features/player/playerSlice";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = useSelector((state: RootState) => state.playlists.selectedPlaylistStatus);
  const fetchedPlaylist = useSelector((state: RootState) => state.playlists.selectedPlaylist);
  const loggedInUserId = useSelector((state: RootState) => state.auth.session?.user.id);
  const likedPlaylists = useSelector((state: RootState) => state.likedPlaylists.likedPlaylists);
  const errorMessage = useSelector((state: RootState) => state.playlists.selectedPlaylistErrorMsg);
  const likedSongPlaylistId = useSelector((state: RootState) => state.playlists.likedSongsPlaylist?.id);

  const getSongsTime = () => {
    const songsLengthInSeconds = fetchedPlaylist?.songs.reduce((prev, curr) => prev + curr.time, 0) ?? 0;

    const hours = Math.floor(songsLengthInSeconds / 3600);
    const minutes = Math.floor((songsLengthInSeconds % 3600) / 60);
    const seconds = Math.floor(songsLengthInSeconds % 60);

    if (hours === 0 && minutes === 0 && seconds === 0) return "0s";
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
      toast.error(error.message, options);
      return;
    }
    if (!fetchedPlaylist) return;

    dispatch(addPlaylistToLiked(fetchedPlaylist));
    toast.success("Successfully added playlist to liked");
  };

  const removeFromLikedPlaylist = async () => {
    const { error } = await supabase
      .from("liked-playlists")
      .delete()
      .match({ user_id: loggedInUserId, playlist_id: playlistId });

    if (error) {
      console.error(error.message);
      toast.error(error.message, options);
      return;
    }
    if (!playlistId) return;

    dispatch(removePlaylistFromLiked(playlistId));
    toast.success("Successfully removed playlist from liked", options);
  };

  const removePlaylist = async () => {
    if (!playlistId) {
      toast.info("Not found this playlist", options);
      return;
    }

    const { error } = await supabase.from("playlist").delete().match({ user_id: loggedInUserId, id: playlistId });

    if (error) {
      toast.error(error.message, options);
      return;
    }

    dispatch(filterOutPlaylist(playlistId));
    toast.success("Successfully remove playlist", options);
    navigate("/");
  };

  const isPlaylistIncluded = () => {
    if (!likedPlaylists) {
      return false;
    }

    return likedPlaylists.findIndex((playlist) => playlist.id === playlistId) !== -1;
  };

  const handlePlayAll = () => {
    console.log(fetchedPlaylist?.songs);
    if (fetchedPlaylist === undefined) return;

    dispatch(changeSong(fetchedPlaylist?.songs[0]?.id));
    dispatch(playToggle());

    const otherSongs = fetchedPlaylist?.songs.slice(1);

    if (otherSongs !== undefined) {
      otherSongs.forEach((song) => {
        dispatch(pushQueue(song.id));
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!playlistId) return;

    dispatch(getPlaylist(playlistId));
  }, [dispatch, playlistId]);

  if (status === "loading") {
    return <div className={styles.message}>Loading...</div>;
  }

  if (status === "failed") {
    return (
      <div className={styles.message}>
        <p>{errorMessage}</p>
        <Link className={styles["message-link"]} to="/">
          Home
        </Link>
      </div>
    );
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
            <button type="button" aria-label="Play" className={styles.btn} onClick={handlePlayAll}>
              <Icon icon="material-symbols:play-circle-rounded" width="100%" color="white" />
            </button>
            {loggedInUserId && fetchedPlaylist?.user_id !== loggedInUserId && (
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
            {fetchedPlaylist?.user_id === loggedInUserId && fetchedPlaylist?.id !== likedSongPlaylistId && (
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
        {fetchedPlaylist?.songs.length === 0 && <div className={styles.text}>Add songs to this playlist!</div>}
      </main>
    </div>
  );
};

export default PlaylistPage;
