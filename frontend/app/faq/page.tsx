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
      </div>
    </Container>
  );
};

export default FAQPage;
