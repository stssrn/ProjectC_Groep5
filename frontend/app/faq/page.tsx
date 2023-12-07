"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Container from "../components/Container";

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button
        className={styles.questionButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "-" : "+"} {question}
      </button>
      {isOpen && <div className={styles.answer}>{answer}</div>}
    </div>
  );
};

const FAQPage = () => {
  return (
    <Container title="FAQ">
      <div className={styles.fixedWidth}>
        <FAQItem
          question="Wat is de geschiedenis en achtergrond van Antes?"
          answer="Antes is ontstaan uit een fusie tussen Delta Psychiatrisch Centrum Poortugaal en Bouman GGZ en fuseerde in oktober 2017 met de Parnassia Groep..."
        />

        <FAQItem
          question="Wat zijn de speerpunten van Antes binnen de Parnassia Groep?"
          answer="Antes richt zich op vijf speerpunten: cliënten die ons aanbevelen, onze hulpverlening dichterbij en lichter maken, extern partnerschap, interne verbinding, en een gezond, positief en uitdagend werkklimaat."
        />

        <FAQItem
          question="In welke regio's is Antes actief?"
          answer="Antes is actief in Rotterdam-Rijnmond, Nieuwe Waterweg-Noord, Drechtsteden, Alblasserwaard-Vijfheerenlanden, en de Zuid-Hollandse eilanden."
        />

        <FAQItem
          question="Voor wie is de onboarding-app bedoeld?"
          answer="De app is ontwikkeld voor nieuwe medewerkers in de geestelijke gezondheidszorg, waaronder psychiaters, psychologen, therapeuten, verpleegkundigen en ander zorgpersoneel."
        />

        <FAQItem
          question="Welke belangrijke functionaliteiten biedt de app?"
          answer="De app biedt welkomstberichten en introductie, GGZ-specifieke training en educatie, informatie over protocollen en richtlijnen, een agenda en planning, en interactieve functies zoals casusbesprekingen en quizzen."
        />

        <FAQItem
          question="Hoe zorgt de app voor een gebruikersvriendelijke en toegankelijke ervaring?"
          answer="De app is ontworpen met focus op gebruiksvriendelijkheid, toegankelijkheid voor mensen met beperkingen, schaalbaarheid, gegevensbeveiliging en privacy, en offline toegankelijkheid."
        />

        <FAQItem
          question="Hoe ondersteunt Antes het project?"
          answer="Antes biedt kennisdeling over de GGZ-sector, toegang tot experts, ondersteuning bij gebruikerstesten, het delen van relevante documentatie en richtlijnen, en beoordeling en evaluatie van de voortgang."
        />

        <FAQItem
          question="Wie zijn de contactpersonen voor dit project bij Antes?"
          answer="De primaire contactpersoon is Sergej Koopmans, ondersteund door Patrick Rancuret, Indra Kandhai en Bas Molijn."
        />
      </div>
    </Container>
  );
};

export default FAQPage;
