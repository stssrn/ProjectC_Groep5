"use client";
import { useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Container from "../components/Container";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const QuestionButton = styled.button`
  background: none;
  border: none;
  font-weight: bold;
  text-align: left;
  width: 100%;
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  &:active {
    transform: scale(0.98);
  }
  animation: ${fadeIn} 0.3s ease;
`;

const Answer = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease;
`;

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <QuestionButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "-" : "+"} {question}
      </QuestionButton>
      {isOpen && <Answer>{answer}</Answer>}
    </div>
  );
};

const FAQPage = () => {
  return (
    <Container title="FAQ">
      <FAQItem
        question="Officia laboris eu irure fugiat qui duis mollit labore."
        answer="Ipsum minim dolore laborum aute fugiat est Lorem id qui velit duis aute anim sit."
      />
      <FAQItem
        question="Ea nostrud aliquip aliqua magna do nostrud occaecat."
        answer="Est ad proident occaecat non tempor."
      />
      <FAQItem
        question="Quis consectetur sunt occaecat aliqua non laborum enim dolor sit qui."
        answer="Deserunt veniam cillum culpa do deserunt fugiat ex ad aliquip officia sint."
      />
    </Container>
  );
};

export default FAQPage;
