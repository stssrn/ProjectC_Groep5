"use client";
import { useState, useRef, useEffect } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";
import Image from "next/image";
import image from "./reward_image.svg";
import { useSession } from "next-auth/react";
import { Popup } from "./popup";


interface Item {
    id: number;
    title: string;
    genre: string;
    price: number;
    details: string;
}

interface UserData {
    id: number;
    points: number;
}

const Page = () => {
    const { data: session } = useSession();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);
    const [itemsPerPage, setitemsPerPage] = useState(4);
    const [hasMounted, setHasMounted] = useState(false);
    const [items, setitemsData] = useState<Item[] | null>(null);
    const [itemsLength, setitemsLength] = useState(0);
    const [user, setUserData] = useState<UserData | null>();
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);


    const carouselRef = useRef(null);
    const totalPages = Math.ceil(itemsLength / itemsPerPage);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (session?.user?.id) {
                    // Check if quiz is already fetched
                    if (!user) {
                        const userResponse = await fetch(`/api/quizzes/fetchUser?id=${session?.user?.id}`);
                        if (!userResponse.ok) throw new Error('Failed to fetch user data');
                        const userData: { user: UserData } = await userResponse.json();
                        setUserData(userData.user);
                    }
                }
            } catch (error) {
                console.error('Fetch data error:', error);
            }
        };

        fetchUser();
    }, [session]);

    const createStoreItemUser = async (itemId: number) => {
        try {
            if (!user || !itemId) return;

            const response = await fetch('api/storeItemsUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storeItemId: itemId,
                    userId: Number(session?.user?.id),
                }),
            });

            if (response.ok) {
                const createdStoreItemsUser = await response.json();
                console.log('Created storeItemsUser entry:', createdStoreItemsUser);
            } else if (response.status === 409) {
                const existingStoreItemsUser = await response.json();
                console.log('Existing storeItemsUser entry:', existingStoreItemsUser);
            } else {
                throw new Error('Failed to add storeItemsUser');
            }
        } catch (error) {
            console.error('Create quizUser error:', error);
        }
    };


    const fetchData = async () => {
        try {
            const response = await fetch(`/api/storeItems?userId=${session?.user?.id}`);
            const data: Item[] = await response.json();
            setitemsData(data);
            setitemsLength(data.length);
        } catch (error) {
            console.error("Fetch rewards error:", error);
        }
    };

    useEffect(() => {
        setHasMounted(true);
        fetchData(); // Call the fetchData function to fetch rewards data
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
        if (windowWidth <= 600) { // <- dit veranderd van 420 naar 600
            setitemsPerPage(itemsLength);
        } else {
            setitemsPerPage(4);
        }
    }, [windowWidth, itemsLength]);

    const loadRewards = items?.slice(currentIndex, currentIndex + itemsPerPage);

    const showItems = (direction: "next" | "previous") => {
        const totalItems = itemsLength;
        // const itemsPerPage = itemsPerPage;
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

    const handlePurchase = async (item: Item) => {
        try {
            if (user) {
                if (user.points >= item.price) {
                    await createStoreItemUser(item.id);
                    await userPayPoints(item);
                    console.log(`Purchased: ${item.title}`);

                    // Remove the purchased item from the list
                    setitemsData((prevItems: Item[] | null) => {
                        if (!prevItems) return prevItems;

                        return prevItems.filter((i) => i.id !== item.id);
                    });

                    // Set success feedback message
                    setPurchaseMessage(`je hebt item: ${item.title} gekocht.`);
                    setShowPopup(true);
                } else {
                    // Set insufficient points feedback message
                    setPurchaseMessage("Je hebt niet genoeg punten voor dit item.");
                    setShowPopup(true);
                }
            }
        } catch (error) {
            console.error('Handle purchase error:', error);
        }
    };

    const closePopup = () => {
        // Close the popup and reset the feedback message
        setShowPopup(false);
        setPurchaseMessage(null);
    };


    const userPayPoints = async (item: Item) => {
        try {
            if (!user || !item) return;

            const response = await fetch('api/storeItems/handlePurchase', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Number(session?.user?.id),
                    points: user.points - item.price,
                }),
            });

            if (response.ok) {
                console.log('Points updated');
            } else if (response.status === 409) {
                console.log('purchase already made');
            } else {
                throw new Error('Failed to update points');
            }
        } catch (error) {
            console.error('Update user points error:', error);
        }
    };

    return (
        <Container title="Punten winkel">
            {hasMounted && (
                <div className={styles.rewardsContainer} ref={carouselRef}>
                    <div className={styles.rewards}>
                        {loadRewards && loadRewards.map((item, i) => (
                            <article key={i} className={styles.reward}>
                                <div className={styles.rewardLeft}>
                                    <div className={styles.postImage}>
                                        <Image src={image} alt="" width={100} height={100} />
                                    </div>
                                </div>
                                <div className={styles.rewardRight}>
                                    <h2 className={styles.rewardName}>{item.title}</h2>
                                    <p className={styles.rewardInfo}><b>genre:</b> {item.genre}</p>
                                    <p className={styles.rewardInfo}><b>price:</b> {item.price}</p>
                                    <p className={styles.rewardInfo}><b>details:</b> {item.details}</p>
                                    <button className={styles.buyButton} onClick={() => handlePurchase(item)}>
                                        Kopen
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
            {totalPages > 1 && (
                <>
                    <button className={styles.showPrev} onClick={() => showItems("previous")}>&lt;</button>
                    <button className={styles.showNext} onClick={() => showItems("next")}>&gt;</button>
                </>
            )}
            {showPopup && (
                <Popup message={purchaseMessage || ''} onClose={closePopup} />
            )}
        </Container>
    );
};

export default Page;