import { Icon } from "@iconify/react";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { pushHistory, playToggle, changeSong, popHistory } from "../features/player/playerSlice";
import styles from "../styles/Player.module.css";
import { useEffect, useRef, useState } from "react";

export const Player = (): JSX.Element => {
  const currentSong = useSelector((state: RootState) => state.player.currentSong);
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  const lastSongFromHistory = useSelector((state: RootState) => state.player.history.slice(-1)[0]);

  const dispatch = useDispatch<AppDispatch>();

  const [mobileFullscreenView, setMobileFullscreenView] = useState(false);
  const [songProgress, setSongProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(new Audio(currentSong?.link));
  const intervalRef = useRef<number | null>(null);
  const isReadyRef = useRef<boolean>(false);

  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(currentSong?.link);
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    setSongProgress(audioRef.current.currentTime);

    if (isReadyRef.current && currentSong !== undefined) {
      audioRef.current.play();
      if (!isPlaying) dispatch(playToggle());
      startTimer();
    } else {
      isReadyRef.current = true;
    }
  }, [currentSong]);

  const startTimer = () => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (audioRef.current.ended) {
        // to next track
      } else {
        setSongProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const onScrub = (value: number) => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setSongProgress(audioRef.current.currentTime);
    startTimer();
  };

  const onSkipBackButtonClick = () => {
    if (songProgress < 1) {
      const song = lastSongFromHistory;
      if (song !== undefined) {
        dispatch(changeSong(song.id));
        dispatch(popHistory());
      } else {
        console.log("No songs left in history");
      }
    } else {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      audioRef.current.currentTime = 0;
      setSongProgress(audioRef.current.currentTime);
      startTimer();
    }
  };

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
            {currentSong?.author?.name ?? "unknown"}
          </button>
        </div>
        {mobileFullscreenView ? (
          <Icon className={styles.heartIcon} icon="mdi:cards-heart-outline" color="white" />
        ) : null}
      </div>
    </div>
  );

  const progressBar = (
    <div>
      <input
        className={styles.progressBar}
        type="range"
        name="progressBar"
        min={0}
        max={audioRef.current?.duration.toString()}
        value={songProgress}
        onChange={(e) => onScrub(+e.target.value)}
      />
      <div className={styles.timeLabels}>
        <p className={styles.currentSongTime}>{Math.round(songProgress)}</p>
        <p className={styles.leftSongTime}></p>
      </div>
    </div>
  );

  const repeatButton = (
    <button className={styles.repeatButton} tabIndex={0}>
      <Icon icon="ph:repeat-bold" color="white" width={50} />
    </button>
  );

  const skipBackButton = (
    <button className={styles.skipBackButton} tabIndex={0} onClick={onSkipBackButtonClick}>
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

        if (isPlaying) {
          if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
          audioRef.current?.pause();
        } else {
          audioRef.current?.play();
          startTimer();
        }
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
    <button className={styles.skipForwardButton} tabIndex={0} onClick={() => dispatch(pushHistory(currentSong))}>
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
      onKeyDown={(e) => {
        if (e.key === "Enter") setMobileFullscreenView(true);
      }}
    >
      {minimizeButton}
      {songBox}
      {controls}
    </div>
  );
};
