import styles from "./score.module.css";
import { useCallback, useEffect } from "react";

type PopupProps = {
    isPopupVisible: boolean;
    togglePopup: () => void; // Update the type to accept no arguments
    score: number;
};

export const Popup: React.FC<PopupProps> = ({ isPopupVisible, togglePopup, score }) => {
    // Use useCallback to memoize the function
    const memoizedTogglePopup = useCallback(() => togglePopup(), [togglePopup]);

    useEffect(() => {
        // Redirect to the dashboard after 5 seconds when the popup becomes visible
        if (isPopupVisible) {
            const timeout = setTimeout(() => {
                // Add the redirection logic here
                window.location.href = '/dashboard';
            }, 3000);

            // Clear the timeout when the component unmounts or when the popup is closed
            return () => clearTimeout(timeout);
        }
    }, [isPopupVisible]);

    return (
        <>
            {/* Conditionally render the Popup based on the prop */}
            {isPopupVisible && (
                <div className={styles.Overlay}>
                    <div className={styles.PopupCard}>
                        <div className={styles.content}>
                            <h1></h1>
                            <p>
                                <b>Score: </b>
                                Je had {score} van de 10 vragen goed
                            </p>
                            <p>
                                Je krijgt ... punten
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};