import React from "react";
import styles from "../styles/popup.module.css"

interface PopUpParams {
  text: string;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  status: string;
}
const PopUp: React.FC<PopUpParams> = ({ text, onClose, status }) => {

  return(
    <>
        <div className={styles.popUpBox}>
            <p>{text}</p>
            <button onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </button>
            <div className={status === "success" ? styles.successBar : styles.errorBar }></div>
        </div>
    </>
  )
}

export default PopUp;