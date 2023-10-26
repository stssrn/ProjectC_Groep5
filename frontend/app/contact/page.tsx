"use client";
import React from "react";
import styled from "@emotion/styled";
import Container from "../components/Container";

const Title = styled.h1`
  text-align: center;
  margin-bottom: 32px;
  font-size: 2rem;
  color: #333;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 12px;
    color: #666;
    line-height: 1.5;
  }
`;

const ContactInfoPage = () => {
  return (
    <Container title="Contact informatie">
      <Title>Contact gegevens</Title>
      <InfoCard>
        <h2>Adres:</h2>
        <p>Albrandswaardsedijk 74, Poortugaal, Nederland, 3172 AA</p>
        <h2>Email:</h2>
        <p>contact@example.com</p>
        <h2>Telefoonnummer:</h2>
        <p>088 358 50 50</p>
      </InfoCard>
    </Container>
  );
};

export default ContactInfoPage;
