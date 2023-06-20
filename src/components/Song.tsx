import {
  filterOutSong,
  addToLikedSongsPlaylist,
  removeFromLikedSongsPlaylist,
  addSongToPlaylist,
  removeSongFromSelectedPlaylist,
} from "../features/playlists/playlistsSlice";
import { Icon } from "@iconify/react";
import styles from "../styles/Song.module.css";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Link } from "react-router-dom";
import { hideMenu, toggleMenu } from "../features/popup/popupSlice";
import { Song as SongType } from "../helpers/types";
import { ToastOptions, toast } from "react-toastify";
import { changeSong, playToggle, pushQueue } from "../features/player/playerSlice";

interface SongProps {
  song: SongType;
  size: "wide" | "standard";
  details: boolean;
  playlistOwnerId?: string;
  playlistId?: string;
}

export const options: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  progress: undefined,
  theme: "dark",
};

const Song = ({ song, size, details, playlistOwnerId, playlistId }: SongProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const userPlaylists = useSelector((state: RootState) => state.playlists.userPlaylists);
  const likedSongsPlaylist = useSelector((state: RootState) => state.playlists.likedSongsPlaylist);
  const userPlaylistsExceptLikedSongs = useSelector(
    (state: RootState) => state.playlists.userPlaylistsExpectLikedSongs,
  );
  const loggedInUserId = useSelector((state: RootState) => state.auth.session?.user.id);
  const { songId, show } = useSelector((state: RootState) => state.popupMenu.visibility);

  const getSongTime = () => {
    const hours = Math.floor(song.time / 3600);
    const minutes = Math.floor((song.time % 3600) / 60);
    const seconds = Math.floor(song.time % 60);

    if (hours >= 1) return `${hours}hr ${minutes}min ${seconds}s`;
    if (minutes >= 1) return `${minutes}min ${seconds}s`;
    if (seconds >= 1) return `${seconds}s`;
  };

  const removeFromPlaylist = async () => {
    const { error } = await supabase.from("songs").delete().match({ song_id: song.id, playlist_id: playlistId });
    if (error) {
      toast.error(error.message, options);
      return;
    }
    dispatch(hideMenu());
    dispatch(filterOutSong({ songId: song.id, playlistId: playlistId ?? "" }));

    toast.success("Successfully removed song from playlist", options);
  };

  const addToPlaylist = async (playlistId: string) => {
    const filteredPlaylist = userPlaylists.find((playlist) => playlist.id === playlistId);

    dispatch(hideMenu());

    if (!filteredPlaylist) {
      return;
    }

    if (filteredPlaylist.songs.findIndex((s) => s.id === song.id) !== -1) {
      toast.info("You cannot added this song multiple times", options);
      return;
    }

    const { error } = await supabase.from("songs").insert({ song_id: song.id, playlist_id: playlistId });
    if (error) {
      toast.error(error.message, options);
      return;
    }

    dispatch(addSongToPlaylist({ playlistId, song }));
    toast.success("Successfully added song to playlist", options);
  };

  const addToLikedSongs = async () => {
    dispatch(addToLikedSongsPlaylist({ song, likedSongsPlaylistId: likedSongsPlaylist?.id ?? "" }));
  };

  const removeFromLikedSongs = async () => {
    dispatch(removeFromLikedSongsPlaylist({ songId: song.id, likedSongsPlaylistId: likedSongsPlaylist?.id ?? "" }));

    if (playlistId === likedSongsPlaylist?.id) {
      dispatch(removeSongFromSelectedPlaylist(song.id));
    }
  };

  const isSongIncluded = () => {
    return likedSongsPlaylist?.songs.findIndex((s) => s.id === song.id) !== -1;
  };

  const filterPlaylists = () => {
    return userPlaylistsExceptLikedSongs?.filter((playlist) => playlist.id !== playlistId) ?? [];
  };

  const handlePlayClick = () => {
    dispatch(changeSong(song.id));
    dispatch(playToggle());
  };

  useEffect(() => {
    return () => {
      dispatch(hideMenu());
    };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={size === "wide" ? styles.wide + " " + styles.song : styles.standard + " " + styles.song}>
        <Icon className={styles.icon} icon="zondicons:music-album" color="white" width="100%" />
        <div className={details ? styles["wrapper-with-details"] : styles.wrapper}>
          <div className={styles.title}>
            <h3>{song.title}</h3>
            <p>{song?.author?.name ?? ""}</p>
          </div>
          <div className={details ? styles.details : styles.hide}>
            <span className={styles.time}>{getSongTime()}</span>
          </div>
          {loggedInUserId && (
            <>
              {!isSongIncluded() && (
                <button type="button" onClick={addToLikedSongs} aria-label="Like" className={styles["like-btn"]}>
                  <Icon icon="mdi:cards-heart-outline" color="white" />
                </button>
              )}
              {isSongIncluded() && (
                <button type="button" onClick={removeFromLikedSongs} aria-label="Like" className={styles["like-btn"]}>
                  <Icon icon="mdi:cards-heart" color="white" />
                </button>
              )}
            </>
          )}
          {!loggedInUserId && <div></div>}
          <button type="button" aria-label="Play" className={styles["play-btn"]} onClick={handlePlayClick}>
            <Icon icon="material-symbols:play-circle-rounded" width="100%" color="white" />
          </button>
          <button
            type="button"
            aria-label="Context menu"
            className={styles["context-menu-btn"]}
            onClick={() => dispatch(toggleMenu(song.id))}
          >
            <Icon icon="mdi:dots-vertical" color="white" width="100%" />
          </button>
        </div>
      </div>
      {show && song.id === songId && (
        <div className={styles["popup-menu"]}>
          <button
            className={styles["popup-menu-btn"]}
            type="button"
            onClick={() => {
              dispatch(pushQueue(song.id));
              dispatch(hideMenu());
            }}
          >
            Add to queue
          </button>
          {loggedInUserId === playlistOwnerId && playlistId !== likedSongsPlaylist?.id && (
            <button type="button" onClick={removeFromPlaylist} className={styles["popup-menu-btn"]}>
              Remove from this playlist
            </button>
          )}
          <div className={styles["popup-menu-playlist-container"]}>
            <div className={styles["popup-menu-playlist"]}>
              <span>Add to playlist</span>
              <Icon className="arrow-right" icon="material-symbols:arrow-right" color="white" width="100%" />
            </div>
            {loggedInUserId && (
              <ul className={styles["popup-menu-list"]}>
                {filterPlaylists().map((playlist) => (
                  <li key={playlist.id}>
                    <button onClick={() => addToPlaylist(playlist.id)}>{playlist.name}</button>
                  </li>
                ))}
              </ul>
            )}
            {!loggedInUserId && (
              <ul className={styles["popup-menu-list"]}>
                <Link className={styles.login} to="/login">
                  You have to log in!
                </Link>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Song;
