"use client";
import React, { useState } from "react";
import Container from "../components/Container";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const CasusListDiv = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #edc7b7;
`;

const CasusButton = styled.button`
  display: block;
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  &:active {
    transform: scale(0.98);
  }
  animation: ${fadeIn} 0.5s ease;
`;

const CasusContentDiv = styled.div`
  flex: 3;
  padding: 16px;
  border-left: 1px solid #ddd;
  animation: ${fadeIn} 0.5s ease;
`;

const CasusPageLayout = styled.div`
  display: flex;
  height: 100%;
  background-color: #edc7b7;
`;

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
    <CasusListDiv>
      {casusData.map((casus) => (
        <CasusButton key={casus.id} onClick={() => onSelect(casus)}>
          {casus.title}
        </CasusButton>
      ))}
    </CasusListDiv>
  );
};

type CasusContentProps = {
  casus: { id: string; title: string; content: string };
};

const CasusContent: React.FC<CasusContentProps> = ({ casus }) => {
  return (
    <CasusContentDiv>
      <h2>{casus.title}</h2>
      <p>{casus.content}</p>
    </CasusContentDiv>
  );
};

const CasusPage: React.FC = () => {
  const [selectedCasus, setSelectedCasus] = useState(casusData[0]);

  return (
    <Container title="Casussen">
      <CasusPageLayout>
        <CasusList onSelect={setSelectedCasus} />
        <CasusContent casus={selectedCasus} />
      </CasusPageLayout>
    </Container>
  );
};

export default CasusPage;
