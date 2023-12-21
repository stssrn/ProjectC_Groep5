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
    frameBorder="0"
    allowFullScreen
  ></iframe>
);

const CasusPage: React.FC = () => {
  const [casusData, setCasusData] = useState<Casus[]>([]);
  const [selectedCasus, setSelectedCasus] = useState<Casus | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/casussen');
      const data: Casus[] = await response.json();
      setCasusData(data);
      setSelectedCasus(data[0] || null);
    };
    fetchData();
  }, []);

  const onSelect = (casus: Casus) => setSelectedCasus(casus);

  return (
    <Container title="Casussen">
      <div className={styles.casusPageLayout}>
        <div className={styles.casusListDiv}>
          {casusData.map((casus) => (
            <button
              key={casus.id}
              className={styles.casusButton}
              onClick={() => onSelect(casus)}
            >
              {casus.name}
            </button>
          ))}
        </div>
        {selectedCasus && <CasusContent casus={selectedCasus} />}
      </div>
    </Container>
  );
};

const CasusContent: React.FC<{ casus: Casus }> = ({ casus }) => (
  <div className={styles.casusContentDiv}>
    <h1>{casus.name}</h1>
    <p>{casus.description}</p>
    <details className={styles.detailsknop}>
      <summary>Behandeling</summary>
      <p>{casus.treatment}</p>
      <YouTubeVideo url={casus.url ?? ''} />
    </details>
  </div>
);

export default CasusPage;