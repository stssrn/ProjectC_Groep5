import styles from "./popup.module.css";
import { useCallback } from "react";

type PopupProps = {
    isPopupVisible: boolean;
    togglePopup: () => void; // Update the type to accept no arguments
    name: string;
    reward_type: string;
    prijs: number;
    info: string;
};

export const Popup: React.FC<PopupProps> = ({ isPopupVisible, togglePopup, name, reward_type, prijs, info }) => {
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            // Close the popup if the click is outside the PopupCard
            togglePopup();
        }
    };

    // Use useCallback to memoize the function
    const memoizedTogglePopup = useCallback(() => togglePopup(), [togglePopup]);

    return (
        <>
            {/* Show the clickable element only when isPopupVisible is false */}
            <div className={styles.ClickButton} onClick={memoizedTogglePopup}>
                Meer info
            </div>

            {/* Conditionally render the Popup based on the prop */}
            {isPopupVisible && (
                <div className={styles.Overlay} onClick={handleClickOutside}>
                    <div className={styles.PopupCard}>
                        <div className={styles.content}>
                            <h1>{name}</h1>
                            <p>
                                <b>Genre: </b>
                                {reward_type}
                            </p>
                            <p>
                                <b>Prijs: </b>
                                {prijs}
                            </p>
                            <p>
                                <b>Details: </b>
                                {info}
                            </p>
                        </div>
                        <div className={styles.ClickButton} onClick={memoizedTogglePopup}>
                            Close
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};