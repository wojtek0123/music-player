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
  setIsMobileView,
} from "../features/player/playerSlice";
import styles from "../styles/Player.module.css";
import { useEffect, useRef, useState } from "react";
import { addToLikedSongsPlaylist, removeFromLikedSongsPlaylist } from "../features/playlists/playlistsSlice";

export const Player = (): JSX.Element => {
  const currentSong = useSelector((state: RootState) => state.player.currentSong);
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  const lastSongIdFromHistory = useSelector((state: RootState) => state.player.history.slice(-1)[0]);
  const queue = useSelector((state: RootState) => state.player?.queue);
  const firstSongIdFromQueue = useSelector((state: RootState) => state.player?.queue[0]);
  const isMobileView = useSelector((state: RootState) => state.player.isMobileView);
  const likedSongsPlaylist = useSelector((state: RootState) => state.playlists.likedSongsPlaylist);

  const dispatch = useDispatch<AppDispatch>();

  const [mobileFullscreenView, setMobileFullscreenView] = useState(false);
  const [isLoopOn, setIsLoopOn] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement>(new Audio(currentSong?.link));
  const intervalRef = useRef<number | null>(null);
  const isReadyRef = useRef<boolean>(false);

  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(currentSong?.link);
    audioRef.current.volume = volume;

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

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setMobileFullscreenView(false);

    if (window.innerWidth < 1024) dispatch(setIsMobileView(true));
    else dispatch(setIsMobileView(false));
  };

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

  const handleHeartClick = () => {
    if (currentSong === undefined) return;

    const isIncluded = likedSongsPlaylist?.songs.map((song) => song.id).includes(currentSong?.id);

    if (!isIncluded) dispatch(addToLikedSongsPlaylist(currentSong));
    else dispatch(removeFromLikedSongsPlaylist(currentSong.id));
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
        <Icon
          className={styles.heartIcon}
          icon={
            currentSong !== undefined && likedSongsPlaylist?.songs.map((song) => song.id).includes(currentSong?.id)
              ? "mdi:cards-heart"
              : "mdi:cards-heart-outline"
          }
          color="white"
          onClick={handleHeartClick}
        />
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

  const volumeBar = (
    <div className={styles.volumeBarContainer}>
      <Icon icon="mingcute:volume-fill" color="white" />
      <input
        className={styles.volumeBar}
        type="range"
        name="progressBar"
        min={0}
        max={10}
        value={volume * 10}
        onChange={(e) => {
          console.log(e.target.value);
          setVolume(+e.target.value / 10);
          audioRef.current.volume = +e.target.value / 10;
        }}
      />
    </div>
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

  if (currentSong?.link === undefined && isMobileView) return <></>;

  if (currentSong?.link === undefined && !isMobileView)
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
        if (isMobileView) setMobileFullscreenView(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") setMobileFullscreenView(true);
      }}
    >
      {minimizeButton}
      {songBox}
      {controls}
      {volumeBar}
    </div>
  );
};
