"use client";
import { useState, useRef, useEffect } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";
import { Popup } from "./popup";

const Page = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);
    const [rewardsPerPage, setRewardsPerPage] = useState(4);
    const [hasMounted, setHasMounted] = useState(false);


    const [isPopupVisible, setPopupVisible] = useState(false);
    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };
    const carouselRef = useRef(null);

    const generateReward = (index: number) => {
        return {
            name: `Reward ${index + 1}`,
            image: `Image ${index + 1}`,
            prijs: Math.floor(Math.random() * 25) + 1,
            reward_type: "Thema",
            info: `Short info about Reward ${index + 1}`,
        };
    };

    const rewards = new Array(20)
        .fill(null)
        .map((_, index) => generateReward(index));
    const rewardsLength = rewards.length;

    useEffect(() => {
        setHasMounted(true);
        // Update the windowWidth state after component mounts
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        setHasMounted(true);
        if (windowWidth <= 420) {
            setRewardsPerPage(rewardsLength);
        } else {
            setRewardsPerPage(4);
        }
    }, [windowWidth, rewardsLength]);


    const loadRewards = rewards.slice(currentIndex, currentIndex + rewardsPerPage);

    const showItems = (direction: "next" | "previous") => {
        const totalItems = rewardsLength;
        const itemsPerPage = rewardsPerPage;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (direction === "next") {
            if (currentIndex < (totalPages - 1) * itemsPerPage) {
                setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
            } else {
                setCurrentIndex(0);
            }
        } else if (direction === "previous") {
            if (currentIndex > 0) {
                setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
            } else {
                setCurrentIndex((totalPages - 1) * itemsPerPage);
            }
        }
    }

    return (
        <Container title="Punten winkel">
            {hasMounted && (<div className={styles.rewardsContainer} ref={carouselRef}>
                <div className={styles.rewardsContainer} ref={carouselRef}>
                    <div className={styles.rewards}>
                        {loadRewards.map((reward, i) => (
                            <article key={i} className={styles.reward}>
                                <div className={styles.rewardLeft}>

                                    <div className={styles.postImage}>
                                        <svg width="83" height="87" viewBox="0 0 83 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M81.1886 21.332V63.246L70.1086 85.601L69.7576 86.307L40.4236 84.37L29.1476 83.624L2.97656 81.895V31.76L29.1476 32.498L40.8476 32.829L70.4566 33.665L81.1886 21.332Z" fill="#6C63FF" />
                                            <path opacity="0.1" d="M81.1875 23.8066V63.2487L78.4795 68.7086L75.7035 74.3087L70.1035 85.6006L70.7295 43.6866L70.8555 35.2317L76.1795 29.3487L78.4995 26.7816L81.1875 23.8066Z" fill="black" />
                                            <path d="M82.6928 10.2014V24.8414L81.1928 27.2414L78.5058 31.5233L76.1258 35.3163L70.8658 43.6974L70.7398 43.6913L0.675781 40.0914V25.6434L0.852783 25.4534L9.21777 16.3983L12.2458 13.1214L17.7228 7.19336L82.6928 10.2014Z" fill="#6C63FF" />
                                            <path opacity="0.1" d="M70.8609 29.2531V43.6911L0.669922 40.0811V25.6431L0.846924 25.4531L70.8609 29.2531Z" fill="black" />
                                            <path opacity="0.15" d="M82.6913 10.2031V24.8431L70.8594 43.6941V29.2551L82.6913 10.2031Z" fill="black" />
                                            <path d="M78.5089 16.938L78.5029 26.775V31.52L78.4829 68.707L75.7069 74.307L76.1229 35.313L76.1849 29.345L76.2789 20.535L9.21289 16.402L12.2409 13.125L78.5089 16.938Z" fill="#2F2E41" />
                                            <path d="M45.5915 17.4229L40.8915 27.6289L40.8495 32.8289L40.4225 84.3709L29.1465 83.6249V26.9459L35.1625 17.4199L45.5915 17.4229Z" fill="#2F2E41" />
                                            <path d="M30.1135 18.109C27.4003 19.0131 24.4843 19.1172 21.7136 18.409C21.1739 18.3044 20.6679 18.0695 20.2396 17.725C19.7785 17.2157 19.4634 16.5914 19.3275 15.918C18.8374 14.5269 18.5659 13.0683 18.5225 11.594C18.5072 10.8556 18.6615 10.1236 18.9736 9.4542C19.2856 8.78482 19.7471 8.19598 20.3225 7.733C20.5668 7.58538 20.7957 7.41351 21.0056 7.22C21.2561 6.9037 21.436 6.53755 21.5335 6.14603C22.3555 3.69503 23.9476 1.10703 26.5026 0.715029C28.8596 0.353029 31.0025 1.99902 32.8215 3.54502L36.8076 6.93701C37.2497 5.74811 38.0411 4.7207 39.0778 3.98969C40.1144 3.25868 41.3479 2.85825 42.6163 2.84094C43.8846 2.82364 45.1285 3.19028 46.1848 3.89273C47.241 4.59519 48.0601 5.60061 48.5345 6.77701C50.95 4.05578 53.9945 1.96674 57.4025 0.692019C57.7602 0.505523 58.1547 0.400625 58.5578 0.38489C58.9609 0.369155 59.3624 0.442971 59.7335 0.601015C60.1587 0.914963 60.4813 1.34784 60.6605 1.845C61.7456 4.22023 62.3337 6.79224 62.3886 9.40302C62.6672 9.3077 62.9696 9.30805 63.2481 9.40405C63.5265 9.50006 63.7649 9.68621 63.9255 9.93302C64.2345 10.4361 64.4107 11.0093 64.4376 11.599C64.5439 12.5101 64.597 13.4267 64.5966 14.344C64.6873 15.3157 64.432 16.2883 63.8756 17.09C63.0606 18.038 61.6545 18.138 60.4045 18.168C60.5291 18.3221 60.6192 18.5011 60.669 18.6929C60.7188 18.8847 60.727 19.0849 60.6931 19.2802C60.6592 19.4754 60.584 19.6612 60.4725 19.825C60.361 19.9888 60.2157 20.1269 60.0465 20.23C59.3328 20.6122 58.5204 20.7701 57.7155 20.683C54.6155 20.653 51.3155 20.565 48.7355 18.843C47.7165 18.163 46.8635 17.258 45.8425 16.582C43.3425 14.926 40.1966 14.846 37.2996 14.982C34.6816 15.102 32.6055 17.275 30.1135 18.109Z" fill="#2F2E41" />
                                            <path d="M29.5484 17.4219C29.5484 17.4219 3.67836 21.0319 0.0683594 36.6739L5.48334 35.8739L9.29333 42.6929C9.29333 42.6929 13.3043 27.4519 25.1363 23.8419C36.9683 20.2319 41.1803 19.6309 41.1803 19.6309C41.1803 19.6309 49.4024 21.6359 56.8224 45.5009L61.0334 39.6849L68.4533 41.2849C68.4533 41.2849 63.0383 22.6339 48.3983 17.4199L29.5484 17.4219Z" fill="#2F2E41" />
                                        </svg>

                                    </div>
                                </div>
                                <div className={styles.rewardRight}>
                                    <h2 className={styles.rewardName}>{reward.name}</h2>
                                    <p className={styles.rewardInfo}><b>type:</b> {reward.reward_type}</p>
                                    <p className={styles.rewardInfo}><b>prijs:</b> {reward.prijs}</p>
                                    <p className={styles.rewardInfo}><b>info:</b> {reward.info}</p>
                                    <Popup isPopupVisible={isPopupVisible} togglePopup={togglePopup} />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>)}
            <button className={styles.showPrev} onClick={() => showItems("previous")}>&lt;</button>
            <button className={styles.showNext} onClick={() => showItems("next")}>&gt;</button>

        </Container>
    );
};

export default Page;