import { Icon } from "@iconify/react";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { changeSong, playToggle } from "../features/player/playerSlice";
import styles from "../styles/Player.module.css";
import { useEffect, useState } from "react";

export const Player = (): JSX.Element => {
  const currentSong = useSelector((state: RootState) => state.player.currentSong);
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  const dispatch = useDispatch<AppDispatch>();

  // ! temp loading song
  useEffect(() => {
    dispatch(changeSong("ba898259-9001-44b1-a2ef-051922bcfcb3"));
  }, []);

  useEffect(() => {
    setMyAudio(new Audio(currentSong?.link));
  }, [currentSong]);

  const [mobileFullscreenView, setMobileFullscreenView] = useState(false);
  const [myAudio, setMyAudio] = useState(new Audio(currentSong?.link));

  const minimizeButton = mobileFullscreenView ? (
    <button
      className={styles.minimizeButton}
      onClick={(e) => {
        e.stopPropagation();
        setMobileFullscreenView(false);
      }}
    >
      <Icon className={styles.minimizeButtonIcon} icon="material-symbols:keyboard-arrow-down-rounded" color="white" />
    </button>
  ) : null;

  const albumCover = <Icon className={styles.albumCoverIcon} icon="akar-icons:music-album-fill" color="white" />;

  const songBox = (
    <div className={styles.songBox}>
      {albumCover}
      <div className={styles.songInfoWithHeart}>
        <div className={styles.songInfo}>
          <button className={styles.title} tabIndex={0} onClick={(e) => e.stopPropagation()}>
            {currentSong?.title ?? "unknown"}
          </button>
          <button className={styles.author} tabIndex={0} onClick={(e) => e.stopPropagation()}>
            {currentSong?.author ?? "unknown"}
          </button>
        </div>
        {mobileFullscreenView ? (
          <Icon className={styles.heartIcon} icon="mdi:cards-heart-outline" color="white" />
        ) : null}
      </div>
    </div>
  );

  const progressBar = <input className={styles.progressBar} type="range" name="progressBar" />;

  const repeatButton = (
    <button className={styles.repeatButton} tabIndex={0}>
      <Icon icon="ph:repeat-bold" color="white" width={50} />
    </button>
  );

  const skipBackButton = (
    <button className={styles.skipBackButton} tabIndex={0}>
      <Icon icon="ph:skip-back-fill" color="white" width={50} />
    </button>
  );

  const playToggleButton = (
    <button
      className={styles.playToggleButton}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(playToggle());
        isPlaying ? myAudio?.pause() : myAudio?.play();
      }}
    >
      <Icon
        icon={isPlaying ? "material-symbols:pause-circle-rounded" : "material-symbols:play-circle-rounded"}
        color="white"
        width={50}
      />
    </button>
  );

  const skipForwardButton = (
    <button className={styles.skipForwardButton} tabIndex={0}>
      <Icon icon="ph:skip-forward-fill" color="white" width={50} />
    </button>
  );

  const shuffleButton = (
    <button className={styles.shuffleButton} tabIndex={0}>
      <Icon icon="ph:shuffle-bold" color="white" width={50} />
    </button>
  );

  const controls = (
    <div className={styles.controls}>
      {progressBar}
      <div className={styles.controlButtons}>
        {repeatButton}
        {skipBackButton}
        {playToggleButton}
        {skipForwardButton}
        {shuffleButton}
      </div>
    </div>
  );

  if (currentSong?.link === undefined) return <></>;

  return (
    <div
      className={mobileFullscreenView ? `${styles.container} ${styles.mobileFullscreenView}` : styles.container}
      role="button"
      tabIndex={0}
      onClick={() => setMobileFullscreenView(true)}
      onKeyPress={(e) => {
        if (e.key === "Enter") setMobileFullscreenView(true);
      }}
    >
      {minimizeButton}
      {songBox}
      {controls}
    </div>
  );
};
