import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Author, Playlist, Song as SongType, Status } from "../helpers/types";
import Song from "../components/Song";
import Section from "../components/Section";
import styles from "../styles/SearchPage.module.css";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [fetchedSongs, setFetchedSongs] = useState<SongType[]>();
  const [fetchedPlaylists, setFetchedPlaylists] = useState<Playlist[]>([]);
  const [fetchedAuthors, setFetchedAuthors] = useState<Author[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchSongsPlaylist, setSearchSongsPlaylist] = useState<Playlist>();

  useEffect(() => {
    const searchParamValue = searchParams.get("text") ?? "";
    let ignore = false;

    setStatus("loading");
    setFetchedSongs([]);
    setFetchedPlaylists([]);
    setFetchedAuthors([]);

    (async () => {
      const { data: songs, error: songsError } = await supabase
        .from("song")
        .select("*, author(*)")
        .ilike("title", `%${searchParamValue}%`);

      const { data: playlists, error: playlistsError } = await supabase
        .from("playlist")
        .select("*, songs:song(*, author(*))")
        .ilike("name", `%${searchParamValue}%`);

      const { data: authors, error: authorsError } = await supabase
        .from("author")
        .select("*, song(*, author(*))")
        .ilike("name", `%${searchParamValue}%`);

      if (songsError) {
        setStatus("failed");
        setErrorMessage(songsError.message);
        return;
      }

      if (playlistsError) {
        setStatus("failed");
        setErrorMessage(playlistsError.message);
        return;
      }

      if (authorsError) {
        setStatus("failed");
        setErrorMessage(authorsError.message);
        return;
      }

      if (!ignore) {
        setFetchedSongs(songs as SongType[]);
        setFetchedPlaylists(playlists as Playlist[]);
        setFetchedAuthors(authors as Author[]);

        const songsPlaylist: Playlist = {
          id: (Math.random() * 1000).toString(),
          user_id: "",
          songs: songs as SongType[],
          name: "",

          created_at: new Date().toString(),
        };

        setSearchSongsPlaylist(songsPlaylist);

        setStatus("succeeded");
      }
    })();

    return () => {
      ignore = true;
    };
  }, [searchParams]);

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
      {fetchedSongs?.length !== 0 && <h3 className={styles.header}>Searched Songs</h3>}
      {fetchedSongs?.length !== 0 && <Section playlist={searchSongsPlaylist} />}
      {fetchedPlaylists.length !== 0 && <h3 className={styles.header}>Searched Playlists</h3>}
      {fetchedPlaylists?.map((playlist) => (
        <Section key={playlist.id} playlist={playlist} />
      ))}
      {fetchedSongs?.length === 0 && fetchedPlaylists.length === 0 && <div className={styles.message}>No results</div>}
    </div>
  );
};

export default SearchPage;
