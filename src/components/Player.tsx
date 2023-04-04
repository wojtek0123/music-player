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

  const albumCover = <Icon icon="akar-icons:music-album-fill" color="white" width={50} />;

  const playToggleButton = (
    <Icon
      icon={isPlaying ? "material-symbols:pause-circle-rounded" : "material-symbols:play-circle-rounded"}
      color="white"
      width={50}
      onClick={() => dispatch(playToggle())}
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.songBox}>
        {albumCover}
        <div className={styles.songInfo}>
          <div className={styles.title}>{song?.title ?? "unknown"}</div>
          <div className={styles.author}>{song?.author ?? "unknown"}</div>
        </div>
      </div>
      {playToggleButton}
    </div>
  );
};
