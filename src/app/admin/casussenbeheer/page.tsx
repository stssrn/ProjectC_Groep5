"use client";
import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useState, useEffect, useId } from "react";
import TextareaAutosize from 'react-textarea-autosize';

interface Casus {
    id?: number;
    name: string;
    description: string;
    treatment: string;
    url: string;
}

const Page = () => {
    const [currentCasus, setCurrentCasus] = useState<Casus | undefined>();
    const [casussen, setCasussen] = useState<Casus[]>([]);
    const [filteredCasussen, setFilteredCasussen] = useState<Casus[]>([]);
    const [filterType, setFilterType] = useState("name");
    const [isLoading, setIsLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState("id");

    const dialogName = useId();
    const dialogDescription = useId();
    const dialogTreatment = useId();
    const dialogUrl = useId();

    const fetchCasussen = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/casussenBeheer`);
            if (!response.ok) throw new Error('Failed to fetch casussen');
            const data = await response.json();
            const sortedData = sortCasussen(data);
            setCasussen(sortedData);
            setFilteredCasussen(sortedData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
        let filtered;

        if (filterType === "id") {
            if (event.target.value.trim() === "") {
                filtered = casussen;
            } else {
                const searchId = parseInt(event.target.value, 10);
                filtered = casussen.filter(casus => casus.id === searchId);
            }
        } else {
            filtered = casussen.filter(casus => casus.name.toLowerCase().includes(event.target.value.toLowerCase()));
        }

        setFilteredCasussen(filtered);
    };

    const sortCasussen = (casussen: any[]) => {
        return casussen.sort((a, b) => {
            if (sortType === "name") {
                return a.name.localeCompare(b.name);
            }
            return a.id - b.id;
        });
    };

    const openNewCasusDialog = () => {
        setCurrentCasus({ name: '', description: '', treatment: '', url: '' });
        setShowDialog(true);
    };

    const updateField = <K extends keyof Casus>(field: K, value: Casus[K]) => {
        setCurrentCasus((prev) => {
            return prev ? { ...prev, [field]: value } : prev;
        });
    };

    const handleSaveCasus = async () => {
        let method = currentCasus?.id ? "PUT" : "POST";
        let endpoint = `/api/casussenBeheer`;

        if (currentCasus?.id) {
            endpoint += `?id=${currentCasus.id}`;
        }

        const response = await fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentCasus),
        });

        if (!response.ok) {
            console.error("Failed to save casus");
            return;
        }

        setShowDialog(false);
        fetchCasussen();
    };


    const handleDeleteCasus = async (id: number | undefined) => {
        if (id === undefined) {
            console.error('Error: No ID provided for deletion.');
            return;
        }

        if (!window.confirm("Weet je zeker dat je deze casus wilt verwijderen?")) {
            return;
        }


        const response = await fetch(`/api/casussenBeheer?id=${id}`, { method: 'DELETE' });
        if (!response.ok) {
            console.error('Failed to delete casus');
            return;
        }
        setShowDialog(false);
        fetchCasussen();
    };

    useEffect(() => {
        fetchCasussen();
    }, [sortType]);

    if (isLoading) {
        return <div>Laden...</div>;
    }

    return (
        <Container title="Casussen Beheer">
            <div className={styles.filterOptions}>
                <select
                    className={styles.select}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="name">Naam</option>
                    <option value="id">ID</option>
                </select>
                <input
                    type={filterType === "id" ? "number" : "text"}
                    placeholder={`Zoek op ${filterType === "id" ? "ID" : "naam"}...`}
                    className={styles.search}
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className={styles.sortOptions}>
                <select
                    className={styles.select}
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                >
                    <option value="id">Sorteer op ID</option>
                    <option value="name">Sorteer op Naam</option>
                </select>
            </div>
            <button className={styles.add} onClick={openNewCasusDialog}>
                Nieuwe Casus Toevoegen
            </button>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Naam</th>
                        <th>Beschrijving</th>
                        <th>Behandeling</th>
                        <th>URL</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCasussen.map((casus) => (
                        <tr key={casus.id}>
                            <td>{casus.id}</td>
                            <td>{casus.name}</td>
                            <td>{casus.description}</td>
                            <td>{casus.treatment}</td>
                            <td>{casus.url}</td>
                            <td>
                                <button
                                    className={styles.edit}
                                    onClick={() => {
                                        setCurrentCasus(casus);
                                        setShowDialog(true);
                                    }}
                                >
                                    <i className="symbol">edit</i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDialog && (
                <div className={styles.dialogBackdrop}>
                    <div className={styles.dialog}>
                        <label htmlFor={dialogName}>Naam</label>
                        <textarea
                            id={dialogName}
                            value={currentCasus?.name || ""}
                            onChange={(e) => updateField('name', e.target.value)}
                        />
                        <label htmlFor={dialogDescription}>Beschrijving</label>
                        <TextareaAutosize
                            maxRows={5}
                            id={dialogDescription}
                            value={currentCasus?.description || ""}
                            onChange={(e) => updateField('description', e.target.value)}
                        />
                        <label htmlFor={dialogTreatment}>Behandeling</label>
                        <TextareaAutosize
                            maxRows={5}
                            id={dialogTreatment}
                            value={currentCasus?.treatment || ""}
                            onChange={(e) => updateField('treatment', e.target.value)}
                        />
                        <label htmlFor={dialogUrl}>URL</label>
                        <textarea
                            id={dialogUrl}
                            value={currentCasus?.url || ""}
                            onChange={(e) => updateField('url', e.target.value)}
                        />
                        <button className={styles.button} onClick={handleSaveCasus}>Opslaan</button>
                        {currentCasus?.id && (
                            <button className={styles.button} onClick={() => handleDeleteCasus(currentCasus.id)}>Verwijderen</button>
                        )}
                        <button className={styles.button} onClick={() => setShowDialog(false)}>Sluiten</button>
                    </div>
                </div>
            )}
        </Container>
    );

};

export default Page;
