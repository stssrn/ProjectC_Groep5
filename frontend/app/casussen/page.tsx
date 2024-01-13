"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Container from "../components/Container";

type Casus = {
  id: string;
  name: string;
  description: string;
  treatment: string;
  url?: string;
};

const YouTubeVideo: React.FC<{ url: string }> = ({ url }) => (
  <iframe
    className={styles.iframe}
    src={`https://www.youtube.com/embed/${url}`}
    allowFullScreen
  ></iframe>
);

const CasusPage: React.FC = () => {
  const [casusData, setCasusData] = useState<Casus[]>([]);
  const [selectedCasusId, setSelectedCasusId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/casussen');
      const data: Casus[] = await response.json();
      setCasusData(data);
      setSelectedCasusId(data[0]?.id || null);
    };
    fetchData();
  }, []);

  const onSelect = (casusId: string) => {
    setSelectedCasusId(prevId => prevId === casusId ? null : casusId);
  };

  const isSelected = (casusId: string) => selectedCasusId === casusId;

  return (
    <Container title="Casussen">
      <div className={styles.casusPageLayout}>
        <div className={styles.casusListDiv}>
          {casusData.map((casus) => (
            <button
              key={casus.id}
              className={styles.casusButton}
              onClick={() => onSelect(casus.id)}
            >
              <i className="symbol">{isSelected(casus.id) ? "-" : "+"}</i> {casus.name}
            </button>
          ))}
        </div>
        {selectedCasusId && <CasusContent casus={casusData.find(c => c.id === selectedCasusId)!} />}
      </div>
    </Container>
  );
};

const CasusContent: React.FC<{ casus: Casus }> = ({ casus }) => (
  <div className={styles.casusContentDiv}>
    <h1>{casus.name}</h1>
    <p>{casus.description}</p>
    <details className={styles.detailsknop} open>
      <summary>Behandeling</summary>
      <p>{casus.treatment}</p>
      <YouTubeVideo url={casus.url ?? ''} />
    </details>
  </div>
);

export default CasusPage;
