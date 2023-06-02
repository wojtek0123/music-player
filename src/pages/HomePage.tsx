import styles from "../styles/Home.module.css";
import Section from "../components/Section";
import useGetDefaultPlaylists from "../hooks/useDefaultPlaylists";
import { useDispatch } from "react-redux";
import { changeSong, pushQueue } from "../features/player/playerSlice";
import { AppDispatch } from "../app/store";

const HomePage = () => {
  const { mostPopularPlaylist, trendingPlaylist, status } = useGetDefaultPlaylists();

  // ! temp - remove later
  const dispatch = useDispatch<AppDispatch>();
  const songIds = [
    "a57f8f99-9f15-4b62-b0d5-2677a5ad3da3",
    "9f422242-af2f-4ea1-8f43-e8342189773c",
    "236174e5-6d94-47ac-9b37-b708162921a9",
    "3d79211a-fc1b-4c8e-846d-c37e7e4855a4",
    "37b2eae8-6654-49ec-b151-2f7fc6d53fc8",
    "ebc73604-8f11-45cc-b451-4a9ca920e560",
    "02d3abc4-34d4-4646-8b68-695efb3d250b",
    "ba898259-9001-44b1-a2ef-051922bcfcb3",
    "779f2573-25df-473b-88dc-22e86611ebe8",
    "ef6259ef-c4cd-4222-b2f9-a413d179fdc3",
    "3bc3f688-77d8-4ba1-9cc9-5247c7106c5f",
    "0514228e-6933-4dd7-a5ea-24bce83899c9",
    "41b04b37-dada-475c-be13-f0977825cd55",
    "d5e8251c-9284-4e4c-b5ee-34ee9d518b3c",
    "abdb7c1e-420c-4bbf-8690-019bae4e24d0",
    "6f43f998-3edd-4855-bd5e-a959b71b3bb9",
    "6eee6c74-9cff-4512-9613-68b1a14f0274",
    "a3ee9546-5e18-4511-9dcb-1522fa5e623d",
  ];
  const selectRandomSongButton = (
    <button
      style={{ position: "absolute", top: 0 }}
      onClick={() => {
        const songId = songIds[Math.round((songIds.length - 1) * Math.random())];
        dispatch(changeSong(songId));
      }}
    >
      change song
    </button>
  );

  const addQueueButton = (
    <button
      style={{ position: "absolute", top: 0, left: 50 }}
      onClick={() => {
        const songId = songIds[Math.round((songIds.length - 1) * Math.random())];
        dispatch(pushQueue(songId));
      }}
    >
      add to queue
    </button>
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {status === "loading" && <div className={styles.message}>Loading...</div>}
        {status === "failed" && (
          <div className={styles.message}>
            <p>Error!</p>
            <p>Something went wrong. You should try later.</p>
          </div>
        )}
        {status === "succeeded" && (
          <>
            <Section playlist={trendingPlaylist} />
            <Section playlist={mostPopularPlaylist} />
          </>
        )}
      </div>
      {selectRandomSongButton}
      {addQueueButton}
    </main>
  );
};

export default HomePage;
