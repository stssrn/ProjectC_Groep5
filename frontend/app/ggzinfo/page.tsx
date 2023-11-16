"use client";
import styles from "./page.module.css";
import React from "react";
import image from "./image1.svg";
import Image from "next/image";



const DisplayInfo = () => {

    const ggzInfo: string[] = [
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
         Aenean commodo ligula eget dolor.Aenean massa.Cum sociis ",

        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, \
         sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",

        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, \
         sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\
         Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",

        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
         Aenean commodo ligula eget dolor.Aenean massa.Cum sociis.",
    ];
    return (
        <div>
            <div className={styles.middle}>
                <Image className={styles.image} src={image} alt="" />
            </div>
            <br></br><br></br><h1 className={styles.ggzTitel}>Antes informatie</h1>
            <div className={styles.ggzText}>
                <p>{ggzInfo[0]}</p>
            </div>
            
        </div>

        
    )

};

export default DisplayInfo;