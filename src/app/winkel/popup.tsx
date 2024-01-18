import React from "react";
import styles from "./popup.module.css";

interface PopupProps {
    message: string;
    onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
    if (!message) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.popupContent}>
                    <p>{message}</p>
                    <button className={styles.closeButton} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Popup;