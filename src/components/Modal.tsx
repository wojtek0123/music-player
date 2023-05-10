import { createPortal } from "react-dom";
import React, { useEffect, useState } from "react";

import styles from "../styles/Modal.module.css";
import { supabase } from "../lib/supabase";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const Modal = () => {
  const [visibility, setVisibility] = useState(false);
  const [enteredPlaylistName, setEnteredPlaylistName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const session = useSelector((state: RootState) => state.auth.session);

  const addPlaylist = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitted(true);

    if (enteredPlaylistName.length === 0) return;

    const { error } = await supabase.from("playlist").insert({ name: enteredPlaylistName, user_id: session?.user.id });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  const closeModal = () => {
    setErrorMessage("");
    setIsSubmitted(false);
    setEnteredPlaylistName("");
    setVisibility(false);
  };

  useEffect(() => {
    document.body.style.overflowY = visibility ? "hidden" : "scroll";
  }, [visibility]);

  return (
    <>
      <button className={styles["open-modal-btn"]} type="button" onClick={() => setVisibility(true)}>
        Add playlist
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
