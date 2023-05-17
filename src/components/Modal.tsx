import { createPortal } from "react-dom";
import React, { useEffect, useState } from "react";

import styles from "../styles/Modal.module.css";
import { supabase } from "../lib/supabase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { hideMenu } from "../features/popup/popupSlice";
import { addPlaylistToCurrentFetched, Playlist } from "../features/playlists/playlistsSlice";
import { Icon } from "@iconify/react";

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loggedInUserId = useSelector((state: RootState) => state.auth.session?.user.id);
  const [visibility, setVisibility] = useState(false);
  const [enteredPlaylistName, setEnteredPlaylistName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addPlaylist = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!loggedInUserId) navigate("/login");
    if (enteredPlaylistName.length === 0) return;

    const { data, error } = await supabase
      .from("playlist")
      .insert({ name: enteredPlaylistName, user_id: loggedInUserId ?? "" })
      .select("id, name, user_id, created_at, songs:song( *, author ( * ) )");

    if (error) {
      setErrorMessage(error.message);
    }

    if (!data || data.length === 0) {
      setErrorMessage("Something went wrong. Try later!");
    }

    dispatch(addPlaylistToCurrentFetched(data?.at(0) as Playlist));
    closeModal();
  };

  const closeModal = () => {
    setErrorMessage("");
    setIsSubmitted(false);
    setEnteredPlaylistName("");
    setVisibility(false);
  };

  useEffect(() => {
    document.body.style.overflowY = visibility ? "hidden" : "scroll";
    dispatch(hideMenu());
  }, [visibility, dispatch]);

  return (
    <>
      <button className={styles["open-modal-btn"]} type="button" onClick={() => setVisibility(true)}>
        <Icon icon="ic:baseline-plus" color="white" />
      </button>
      {visibility &&
        createPortal(
          <div className={styles.modal}>
            <div className={styles.container}>
              <form className={styles.form} onSubmit={(event) => addPlaylist(event)}>
                <div className={styles.heading}>
                  <h3>Create a new playlist</h3>
                  <button className={styles["close-btn"]} type="button" onClick={closeModal}>
                    X
                  </button>
                </div>
                <div className={styles["form-body"]}>
                  <label className={styles.label}>
                    Title
                    <input
                      type="text"
                      className={styles.input}
                      onChange={(event) => setEnteredPlaylistName(event.target.value)}
                      value={enteredPlaylistName}
                    />
                  </label>
                  {enteredPlaylistName.length === 0 && isSubmitted && <span>Name is required</span>}
                  {isSubmitted && errorMessage.length !== 0 && <span>{errorMessage}</span>}
                  <button type="submit" className={styles["submit-btn"]}>
                    Add playlist
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Modal;
