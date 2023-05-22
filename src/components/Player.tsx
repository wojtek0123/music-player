import { Icon } from "@iconify/react";
import type { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { playToggle } from "../features/player/playerSlice";
import { Song } from "../helpers/types";
import styles from "../styles/Player.module.css";

type PlayerProps = {
  song?: Song;
};

export const Player = ({ song }: PlayerProps): JSX.Element => {
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  const dispatch = useDispatch();

  // const myAudio = new Audio(song?.link);

  return (
    <div className={styles.container}>
      <Icon icon="zondicons:music-album" color="white" />
      <div className="songInfo">
        <div>{song?.title ?? "unknown"}</div>
        <div>{song?.author?.name ?? "unknown"}</div>
        <p>isPlaying: {isPlaying.valueOf()}</p>
      </div>

      <Icon icon="material-symbols:pause-circle-rounded" color="white" onClick={() => dispatch(playToggle())} />
    </div>
  );
};
