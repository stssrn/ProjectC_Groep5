"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Container from "../components/Container";

// Dummy data for the casus list
const casusData = [
  {
    id: "casus1",
    title: "Casus 1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "casus2",
    title: "Casus 2",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  // ...add more cases as needed
];

type CasusListProps = {
  onSelect: (casus: { id: string; title: string; content: string }) => void;
};

const CasusList: React.FC<CasusListProps> = ({ onSelect }) => {
  return (
    <div className={styles.casusListDiv}>
      {casusData.map((casus) => (
        <button
          key={casus.id}
          className={styles.casusButton}
          onClick={() => onSelect(casus)}
        >
          {casus.title}
        </button>
      ))}
    </div>
  );
};

type CasusContentProps = {
  casus: { id: string; title: string; content: string };
};

const CasusContent: React.FC<CasusContentProps> = ({ casus }) => {
  return (
    <div className={styles.casusContentDiv}>
      <h2>{casus.title}</h2>
      <p>{casus.content}</p>
    </div>
  );
};

const CasusPage: React.FC = () => {
  const [selectedCasus, setSelectedCasus] = useState(casusData[0]);

  return (
    <Container title="Casussen">
      <div className={styles.casusPageLayout}>
        <CasusList onSelect={setSelectedCasus} />
        <CasusContent casus={selectedCasus} />
      </div>
    </Container>
  );
};

export default CasusPage;