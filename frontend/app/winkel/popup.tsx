import styled from "@emotion/styled";
import style from "./popup.module.css";

export const ClickButton = styled.div`
    background: powderblue;
    padding: 10px;
    z-index: 999;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    width: 90px;
    text-align: center;
`
const PopupCard = styled.div`
  width: 20vw;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 998;
  margin-left: -150px;
  background-color: white;
  padding: 40px;
  transform: translateY(-50%);
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 900;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(1px);
`;


type PopupProps = {
    isPopupVisible: boolean;
    togglePopup: () => void;
};

export const Popup: React.FC<PopupProps> = ({ isPopupVisible, togglePopup }) => {
    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            // Close the popup if the click is outside the PopupCard
            togglePopup();
        }
    };

    return (
        <>
            {/* Show the clickable element only when isPopupVisible is false */}
            <ClickButton className={style.ClickButton} onClick={togglePopup}>Meer info</ClickButton>

            {/* Conditionally render the Popup based on the prop */}
            {isPopupVisible && (
                <Overlay onClick={handleClickOutside}>
                    <PopupCard>
                        <ClickButton onClick={togglePopup}>Close</ClickButton>
                    </PopupCard>
                </Overlay>
            )}
        </>
    );
};
