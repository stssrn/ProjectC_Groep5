"use client";
import { useState, useRef, useEffect } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";
import { Popup } from "./popup";
import image from "./reward_image.svg";
import Image from "next/image";

interface Reward {
    name: string;
    reward_type: string;
    prijs: number;
    info: string;
}

const generateReward = (index: number) => {
    return {
        name: `Reward ${index + 1}`,
        image: `Image ${index + 1}`,
        prijs: Math.floor(Math.random() * 25) + 1,
        reward_type: "Thema",
        info: `Short info about Reward ${index + 1}`,
    };
};

const rewards = new Array(20).fill(null).map((_, index) => generateReward(index));

const Page = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);
    const [rewardsPerPage, setRewardsPerPage] = useState(4);
    const [hasMounted, setHasMounted] = useState(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

    const [isPopupVisible, setPopupVisible] = useState(false);
    const togglePopup = (reward: Reward) => {
        // If the popup is already open for the selected reward, close it
        if (selectedReward && selectedReward.name === reward.name) {
            setSelectedReward(null);
        } else {
            // Open the popup for the selected reward
            setSelectedReward(reward);
        }
    };
    const carouselRef = useRef(null);

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
                                        <Image src={image} alt="" />
                                    </div>
                                </div>
                                <div className={styles.rewardRight}>
                                    <h2 className={styles.rewardName}>{reward.name}</h2>
                                    <p className={styles.rewardInfo}><b>type:</b> {reward.reward_type}</p>
                                    <p className={styles.rewardInfo}><b>prijs:</b> {reward.prijs}</p>
                                    <p className={styles.rewardInfo}><b>info:</b> {reward.info}</p>
                                    <Popup
                                        isPopupVisible={selectedReward !== null && selectedReward.name === reward.name}
                                        togglePopup={() => togglePopup(reward)}
                                        name={reward.name}
                                        reward_type={reward.reward_type}
                                        prijs={reward.prijs}
                                        info={reward.info}
                                    />
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
