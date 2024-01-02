"use client";
import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";
import Image from "next/image";
import searchIcon from "./search_icon.svg";
import hamburgerMenu from "./menu.png";

interface Module {
    id: number,
    title: string;
    description: string;
}

const Page: React.FC = () => {


    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module>();


    const fetchEducatieModules = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/educatie?id=${0}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch educatie_modules data");
            }

            const data = await response.json();
            return data.educatieModules;
        } catch (error) {
            console.error("Error fetching educatie_modules data:", error);
        }
    };
    const handleModuleClick = (module: Module) => {
        setSelectedModule(module);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredModules = modules.filter((module) =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMenuToggle = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            const modules = await fetchEducatieModules();
            if (modules) {
                setModules(modules);
                setSelectedModule(modules[0]);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", updateWindowWidth);
        updateWindowWidth();

        return () => {
            window.removeEventListener("resize", updateWindowWidth);
        };
    }, []);

    if (isLoading) {
        return <div>Laden...</div>;
    }

    return (
        <Container title="Educatie">
            <div className={styles.container}>

                <div className={styles.hamburgerIcon} onClick={handleMenuToggle}>
                    <Image
                        src={hamburgerMenu}
                        alt=""
                        width={50}
                        height={50}
                    />
                </div>
                {(isMenuOpen || windowWidth >= 451) && (
                    <div className={styles.searchBar}>
                        <div>
                            <Image className={styles.searchIcon} src={searchIcon} alt="" />
                        </div>
                        <input
                            className={styles.inputBox}
                            type="text"
                            placeholder="Zoeken..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                )}

                <div className={styles.contentContainer}>
                    {(isMenuOpen || windowWidth >= 451) && (
                        <div className={styles.moduleList}>
                            {filteredModules.map((module) => (
                                <div
                                    key={module.title}
                                    className={styles.moduleItem}
                                    onClick={() => handleModuleClick(module)}
                                >
                                    {module.title}
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <div className={styles.moduleTitle}>{selectedModule?.title}</div>
                        <div className={styles.moduleInfo}>{selectedModule?.description}</div>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default Page;
