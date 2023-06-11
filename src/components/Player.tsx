import { Icon } from "@iconify/react";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  pushHistory,
  playToggle,
  changeSong,
  popHistory,
  shiftQueue,
  putRandomSongFirstInQueue,
} from "../features/player/playerSlice";
import styles from "../styles/Player.module.css";
import { useEffect, useRef, useState } from "react";

export const Player = (): JSX.Element => {
  const currentSong = useSelector((state: RootState) => state.player.currentSong);
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  const lastSongIdFromHistory = useSelector((state: RootState) => state.player.history.slice(-1)[0]);
  const queue = useSelector((state: RootState) => state.player?.queue);
  const firstSongIdFromQueue = useSelector((state: RootState) => state.player?.queue[0]);

  const dispatch = useDispatch<AppDispatch>();

  const [mobileFullscreenView, setMobileFullscreenView] = useState(false);
  const [isLoopOn, setIsLoopOn] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
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
        if (isPlaying) dispatch(playToggle());
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        if (currentSong !== undefined) return;
        else onSkipForwardButtonClick();
      } else {
        setSongProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const strPadLeft = (string: string, pad: string, length: number) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

  const convertSeconds = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds - minutes * 60;

    return strPadLeft(minutes.toString(), "0", 2) + ":" + strPadLeft(seconds.toString(), "0", 2);
  };

  const onScrub = (value: number) => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setSongProgress(audioRef.current.currentTime);
    startTimer();
  };

  const onLoopButtonClick = () => {
    setIsLoopOn(!isLoopOn);
  };

  const onSkipBackButtonClick = () => {
    if (songProgress < 1) {
      const songId: string = lastSongIdFromHistory;
      if (songId !== undefined) {
        dispatch(changeSong(songId));
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

  const onSkipForwardButtonClick = () => {
    if (isLoopOn) {
      if (currentSong?.id !== undefined) dispatch(changeSong(currentSong?.id));
    } else if (firstSongIdFromQueue === undefined) {
      // if (intervalRef.current !== null) window.clearInterval(intervalRef.current);

      audioRef.current.currentTime = audioRef.current.duration + 1;
      console.log(audioRef.current.ended);
      setSongProgress(audioRef.current.currentTime);
    } else if (isShuffleOn && queue.length > 1) {
      dispatch(pushHistory(currentSong?.id));
      dispatch(putRandomSongFirstInQueue());
      dispatch(changeSong(firstSongIdFromQueue));
      dispatch(shiftQueue());
    } else {
      dispatch(pushHistory(currentSong?.id));
      dispatch(changeSong(firstSongIdFromQueue));
      dispatch(shiftQueue());
    }
  };

  const onShuffleButtonClick = () => {
    setIsShuffleOn(!isShuffleOn);
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
    <div className={styles.progressBarContainer}>
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
        <p className={styles.currentSongTime}>
          {audioRef.current.duration ? convertSeconds(Math.round(songProgress)) : ""}
        </p>
        <p className={styles.leftSongTime}>
          {audioRef.current.duration ? convertSeconds(Math.round(audioRef.current.duration - songProgress)) : ""}
        </p>
      </div>
    </div>
  );

  const loopButton = (
    <button className={styles.loopButton} tabIndex={0} onClick={onLoopButtonClick}>
      <Icon icon="ph:repeat-bold" color={isLoopOn ? "c33764" : "ffffff"} width={50} />
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
    <button className={styles.skipForwardButton} tabIndex={0} onClick={onSkipForwardButtonClick}>
      <Icon icon="ph:skip-forward-fill" color="white" width={50} />
    </button>
  );

  const shuffleButton = (
    <button className={styles.shuffleButton} tabIndex={0} onClick={onShuffleButtonClick}>
      <Icon icon="ph:shuffle-bold" color={isShuffleOn ? "c33764" : "ffffff"} width={50} />
    </button>
  );

  const controls = (
    <div className={styles.controls}>
      {progressBar}
      <div className={styles.controlButtons}>
        {loopButton}
        {skipBackButton}
        {playToggleButton}
        {skipForwardButton}
        {shuffleButton}
      </div>
    </div>
  );

  if (currentSong?.link === undefined)
    return (
      <div
        className={mobileFullscreenView ? `${styles.container} ${styles.mobileFullscreenView}` : styles.container}
      ></div>
    );

  return (
    <div
      className={mobileFullscreenView ? `${styles.container} ${styles.mobileFullscreenView}` : styles.container}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (window.innerWidth < 1024) setMobileFullscreenView(true);
      }}
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
