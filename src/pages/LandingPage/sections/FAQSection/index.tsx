import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
  {
    question: 'What is forward deployed engineering?',
    answer:
      'Forward deployed engineers work closely with your team where the problem happens. We learn your workflows, connect the relevant data and tools, and build AI systems around the people who will use them.',
  },
  {
    question: 'How is this different from a typical development agency?',
    answer:
      'The work starts with understanding the problem together, rather than simply implementing a fixed feature list. Engineers stay involved through discovery, integration, evaluation, and handover, adapting the solution as we learn from real use.',
  },
  {
    question: 'What kinds of AI projects can we build together?',
    answer:
      'Examples include knowledge copilots, document processing, conversational interfaces, and workflows that connect AI to your existing tools. We choose the approach around your use case, available data, and how you will measure success.',
  },
  {
    question: 'Do we need clean data or an AI team to get started?',
    answer:
      'You do not need a finished data platform or an internal AI team. We start by reviewing the information, systems, and expertise you already have, then identify the access, data preparation, and team involvement the project needs.',
  },
  {
    question: 'How do you approach data access and reliability?',
    answer:
      'We agree on data boundaries, permissions, and deployment requirements before connecting systems. Evaluation, monitoring, and human review are designed around the workflow, especially where an incorrect answer or action could have consequences.',
  },
  {
    question: 'What happens after the first version is built?',
    answer:
      'We test the system with your team, review it against agreed outcomes, and refine it for everyday use. Documentation, handover, and any ongoing support are agreed as part of the engagement so your team knows how to operate and maintain it.',
  },
  {
    question: 'How do we start, and how long will it take?',
    answer:
      'Start with a conversation about the workflow you want to improve. We define a focused first scope, success criteria, and the dependencies together. Timing and cost depend on the integrations, data readiness, and complexity; we agree them before implementation.',
  },
];

function Answer({ text }: { text: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <p>{text}</p>;
  let offset = 0;
  return (
    <p>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, wordIndex) => {
          const start = offset;
          offset += word.length + 1;
          return (
            <span key={wordIndex}>
              <span className="faq-reveal-word">
                {Array.from(word).map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.25,
                      delay:
                        (start + index) * Math.min(0.008, 1.3 / text.length),
                      ease: 'easeOut',
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>{' '}
            </span>
          );
        })}
      </span>
    </p>
  );
}

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="fde-faq"
      aria-labelledby="faq-heading"
    >
      <div className="fde-faq-intro">
        <p className="eyebrow">A LITTLE MORE CLARITY</p>
        <h2 id="faq-heading">
          Good questions.
          <br />
          Clear answers.
        </h2>
        <p>
          What to expect when you build with our forward deployed engineers.
        </p>
        <a
          href="mailto:buddy@eigi.ai"
          className="fde-faq-contact"
        >
          Have another question? <ArrowUpRight size={18} />
        </a>
      </div>
      <Accordion
        className="fde-faq-list"
        multiple={false}
      >
        {questions.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`faq-${index}`}
          >
            <AccordionTrigger>
              <span className="fde-faq-number">0{index + 1}</span>
              <span>{item.question}</span>
            </AccordionTrigger>
            <AccordionContent>
              <Answer text={item.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
