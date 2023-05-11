import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { Playlist } from "../features/playlists/playlistsSlice";

const useDefaultPlaylists = () => {
  const [trendingPlaylist, setTrendingPlaylist] = useState<Playlist>();
  const [mostPopularPlaylist, setMostPopularPlaylist] = useState<Playlist>();

  const status = useSelector((state: RootState) => state.playlists.status);
  const playlists = useSelector((state: RootState) => state.playlists.defaultPlaylists);

  useEffect(() => {
    playlists.forEach((playlist) => {
      if (playlist.name === "trending") {
        const trendingPlaylist = playlists?.filter((playlist) => playlist.name === "trending");

        if (!trendingPlaylist) return;

        setTrendingPlaylist(trendingPlaylist[0]);
      }

      if (playlist.name === "most popular") {
        const mostPopularPlaylist = playlists?.filter((playlist) => playlist.name === "most popular").at(0);

        setMostPopularPlaylist(mostPopularPlaylist as Playlist);
      }
    });
  }, [playlists]);

  return {
    trendingPlaylist,
    mostPopularPlaylist,
    status,
  };
};

export default useDefaultPlaylists;
