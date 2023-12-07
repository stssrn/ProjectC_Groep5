"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Container from "../components/Container";

type Casus = {
  id: string;
  title: string;
  content: JSX.Element;
  treatment: string;
  videoId: string;
};

const casusData: Casus[] = [
  {
    id: "Angststoornis",
    title: "Angststoornis",
    content: (
      <>
        <p>Naam: David</p>
        <p>Leeftijd: 30 jaar</p>
        <p>Geslacht: Man</p>
        <p>
          Beroep: Grafisch Ontwerper
          <br />
          <br />
          Verhaal:
        </p>
        <p>
          David heeft sinds de universiteit te kampen met een gegeneraliseerde
          angststoornis. Hij ervaart constante zorgen over alledaagse zaken,
          vooral op zijn werk. Deze zorgen zijn vaak overweldigend en leiden tot
          fysieke symptomen zoals hartkloppingen, zweten en slapeloosheid.
        </p>
        <p>
          De angst heeft een impact op zijn sociale leven; David vermijdt
          sociale bijeenkomsten en heeft moeite met het onderhouden van
          relaties. Ondanks zijn talent en vaardigheden, heeft hij moeite met
          het presenteren van zijn werk en het spreken in het openbaar.
        </p>
        <p>
          David zoekt hulp bij een psychotherapeut en leert technieken om zijn
          angst te beheersen. Hij begint met cognitieve gedragstherapie (CGT) en
          maakt geleidelijk vorderingen in het omgaan met zijn angsten.
        </p>
      </>
    ),
    treatment:
      "Cognitieve gedragstherapie is een effectieve behandeling voor angststoornissen. Deze therapie helpt patiënten hun gedachten en gedragingen te herkennen en te veranderen. Medicatie kan ook worden voorgeschreven afhankelijk van de ernst van de symptomen.",
    videoId: "odo6v527jxI",
  },
  {
    id: "Psychose",
    title: "Psychose",
    content: (
      <>
        <p>Naam: Emma</p>
        <p>Leeftijd: 24 jaar</p>
        <p>Geslacht: Vrouw</p>
        <p>
          Beroep: Student
          <br />
          <br />
          Kenmerken:
        </p>
        <ul>
          <li>Moeite met concentreren</li>
          <li>Overgevoeligheid</li>
          <li>Behoefte aan terugtrekking</li>
          <li>Verminderde interesse</li>
          <br />
        </ul>
        <p>
          Emma ervaart intense psychoses, gekenmerkt door hallucinaties en
          wanen. Dit heeft een significante impact op haar studie en sociale
          leven.
        </p>
      </>
    ),
    treatment:
      "Behandelingen kunnen bestaan uit medicatie, psychotherapie en in sommige gevallen Electro Convulsie Therapie (ECT). Vroege interventie is cruciaal voor een effectief herstel.",
    videoId: "uypofJrs8oQ",
  },
];

const YouTubeVideo: React.FC<{ videoId: string }> = ({ videoId }) => (
  <iframe
    className={styles.iframe}
    src={`https://www.youtube.com/embed/${videoId}`}
    frameBorder="0"
    allowFullScreen
  ></iframe>
);

const CasusList: React.FC<{ onSelect: (casus: Casus) => void }> = ({
  onSelect,
}) => (
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

const CasusContent: React.FC<{ casus: Casus }> = ({ casus }) => (
  <div className={styles.casusContentDiv}>
    <h1>{casus.title}</h1>
    <p>{casus.content}</p>
    <details className={styles.detailsknop}>
      <summary>Behandeling</summary>
      <p>{casus.treatment}</p>
      <YouTubeVideo videoId={casus.videoId} />
    </details>
  </div>
);

const CasusPage: React.FC = () => {
  const [selectedCasus, setSelectedCasus] = useState<Casus>(casusData[0]);

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