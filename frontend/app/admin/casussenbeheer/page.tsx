"use client";
import styles from "./page.module.css";
import Container from "@/app/components/Container";
import { useState, useEffect, useId } from "react";

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
    const [isLoading, setIsLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);

    const dialogName = useId();
    const dialogDescription = useId();
    const dialogTreatment = useId();
    const dialogUrl = useId();

    const fetchCasussen = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/casussenBeheer`);
        if (!response.ok) {
            console.error('Failed to fetch casussen');
            setIsLoading(false);
            return;
        }
        const data = await response.json();
        setCasussen(data);
        setIsLoading(false);
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
        const response = await fetch(`/api/casussenBeheer?id=${id}`, { method: 'DELETE' });
        if (!response.ok) {
            console.error('Failed to delete casus');
            return;
        }
        fetchCasussen();
    };

    useEffect(() => {
        fetchCasussen();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container title="Casussen Beheer">
            <div className={styles.filterOptions}>
                {/*ik zal hier nog filter etc toevoegen*/}
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
                    {casussen.map((casus) => (
                        <tr key={casus.id}>
                            <td>{casus.id}</td>
                            <td>{casus.name}</td>
                            <td>{casus.description}</td>
                            <td>{casus.treatment}</td>
                            <td>{casus.url}</td>
                            <td>
                                <button className={styles.edit} onClick={() => {
                                    setCurrentCasus(casus);
                                    setShowDialog(true);
                                }}>Bewerk</button>
                                <button className={styles.delete} onClick={() => handleDeleteCasus(casus.id)}>Verwijder</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDialog && (
                <div className={styles.dialogBackdrop}>
                    <div className={styles.dialog}>
                        <label htmlFor={dialogName}>Naam</label>
                        <input
                            type="text"
                            id={dialogName}
                            value={currentCasus?.name || ""}
                            onChange={(e) => updateField('name', e.target.value)}
                        />
                        <label htmlFor={dialogDescription}>Beschrijving</label>
                        <input
                            type="text"
                            id={dialogDescription}
                            value={currentCasus?.description || ""}
                            onChange={(e) => updateField('description', e.target.value)}
                        />
                        <label htmlFor={dialogTreatment}>Behandeling</label>
                        <input
                            type="text"
                            id={dialogTreatment}
                            value={currentCasus?.treatment || ""}
                            onChange={(e) => updateField('treatment', e.target.value)}
                        />
                        <label htmlFor={dialogUrl}>URL</label>
                        <input
                            type="text"
                            id={dialogUrl}
                            value={currentCasus?.url || ""}
                            onChange={(e) => updateField('url', e.target.value)}
                        />
                        <button className={styles.button} onClick={handleSaveCasus}>Opslaan</button>
                        <button className={styles.button} onClick={() => setShowDialog(false)}>Sluiten</button>
                    </div>
                </div>
            )}
        </Container>
    );

};

export default Page;
