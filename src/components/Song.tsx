import {
  Song,
  filterOutSong,
  addToLikedSongsPlaylist,
  removeFromLikedSongsPlaylist,
} from "../features/playlists/playlistsSlice";
import { Icon } from "@iconify/react";
import styles from "../styles/Song.module.css";
import { useContext } from "react";
import { PopupContext } from "../context/popup-context";
import { supabase } from "../lib/supabase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Link } from "react-router-dom";

interface SongProps {
  song: Song;
  size: "wide" | "standard";
  details: boolean;
  playlistOwnerId?: string;
  playlistId?: string;
}

const Song = ({ song, size, details, playlistOwnerId, playlistId }: SongProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    popupMenuVisibility: { show, songId },
    onToggleMenu,
  } = useContext(PopupContext);
  const userPlaylists = useSelector((state: RootState) => state.playlists.userPlaylists);
  const likedSongsPlaylist = useSelector((state: RootState) => state.playlists.likedSongsPlaylist);
  const userPlaylistsExceptLikedSongs = useSelector(
    (state: RootState) => state.playlists.userPlaylistsExpectLikedSongs,
  );
  const loggedInUserId = useSelector((state: RootState) => state.auth.session?.user.id);

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
      console.error(error.message);
      return;
    }
    dispatch(filterOutSong({ songId: song.id, playlistId: playlistId ?? "" }));
  };

  const addToPlaylist = async (playlistId: string) => {
    // todo: after adding a song to playlist pop up should disappear
    const filteredPlaylist = userPlaylists.find((playlist) => playlist.id === playlistId);

    if (!filteredPlaylist) return;

    if (filteredPlaylist.songs.findIndex((s) => s.id === song.id) !== -1) {
      // todo: Notify a user that this song is already in liked playlist
      console.log("You cannot added this song multiple times");
      return;
    }

    const { error } = await supabase.from("songs").insert({ song_id: song.id, playlist_id: playlistId });
    if (error) {
      console.error(error.message);
      return;
    }
  };

  const addToLikedSongs = async () => {
    const { error } = await supabase
      .from("songs")
      .insert({ song_id: song.id, playlist_id: likedSongsPlaylist?.id ?? "" });
    if (error) {
      console.error(error.message);
      return;
    }
    dispatch(addToLikedSongsPlaylist(song));
  };

  const removeFromLikedSongs = async () => {
    const { error } = await supabase
      .from("songs")
      .delete()
      .match({ song_id: song.id, playlist_id: likedSongsPlaylist?.id ?? "" });

    if (error) {
      console.error(error.message);
      return;
    }
    dispatch(removeFromLikedSongsPlaylist(song.id));
  };

  const isSongIncluded = () => {
    return likedSongsPlaylist?.songs.findIndex((s) => s.id === song.id) !== -1;
  };

  const filterPlaylists = () => {
    return userPlaylistsExceptLikedSongs?.filter((playlist) => playlist.id !== playlistId) ?? [];
  };

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
          <button type="button" aria-label="Play" className={styles["play-btn"]}>
            <Icon icon="material-symbols:play-circle-rounded" width="100%" color="white" />
          </button>
          <button
            type="button"
            aria-label="Context menu"
            className={styles["context-menu-btn"]}
            onClick={() => onToggleMenu(song.id)}
          >
            <Icon icon="mdi:dots-vertical" color="white" width="100%" />
          </button>
        </div>
      </div>
      {show && song.id === songId && (
        <div className={styles["popup-menu"]}>
          <button className={styles["popup-menu-btn"]} type="button">
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
