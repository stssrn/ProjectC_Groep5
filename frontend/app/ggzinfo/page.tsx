"use client";
import styles from "./page.module.css";
import React, { useState } from "react";
import image from "./classroom.svg";
import Image from "next/image";
import Link from "next/link";

const Display = () => {
    const ggzInfo: string[] = [
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis ",
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, \
        sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, \
        sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. \
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis.",
    ];

    const [currentInfoIndex, setCurrentInfoIndex] = useState(0);

    const handleContinue = () => {
        // Increment the index and loop back to the beginning if at the end
        setCurrentInfoIndex((prevIndex) => (prevIndex + 1) % ggzInfo.length);
    };

    return (
        <div>
            <div>
                <Link href="/login" className={styles.skipButton}>
                    Skip
                </Link>
            </div>
            <div className={styles.center}>
                <Image className={styles.image} src={image} alt="" />
            </div>
            <div className={styles.ggzText}>
                <p>{ggzInfo[currentInfoIndex]}</p>
            </div>
            <div>
                <button className={styles.continueButton} onClick={handleContinue}>
                    Verder
                </button>
            </div>
        </div>
    );
};

export default Display;
