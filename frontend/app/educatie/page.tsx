"use client";
import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import styles from "./page.module.css";
import Image from "next/image";
import searchIcon from "./search_icon.svg";
import hamburgerMenu from "./menu.png";

interface Module {
    name: string;
    info: string;
}

const Page: React.FC = () => {
    const modules: Module[] = [
        { name: "Module", info: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum." },
        { name: "Test", info: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum." },
        { name: "Banaan", info: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum." },
        { name: "Rekenen", info: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum." },
        { name: "Brein", info: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est eopksio laborum." },

    ];

    const [selectedModule, setSelectedModule] = useState(modules[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);



    const handleModuleClick = (module: Module) => {
        setSelectedModule(module);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredModules = modules.filter((module) =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMenuToggle = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

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
                                    key={module.name}
                                    className={styles.moduleItem}
                                    onClick={() => handleModuleClick(module)}
                                >
                                    {module.name}
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <div className={styles.moduleTitle}>{selectedModule.name}</div>
                        <div className={styles.moduleInfo}>{selectedModule.info}</div>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default Page;
