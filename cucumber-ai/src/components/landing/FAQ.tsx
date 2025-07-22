import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is Cucumber AI?",
    answer:
      "Cucumber AI is a comprehensive restaurant operating system designed for the Indian market. It features an intelligent AI assistant that simplifies restaurant operations, including GST compliance, UPI payments, food aggregator integrations, and FSSAI compliance, all through a conversational interface.",
    value: "item-1",
  },
  {
    question: "How does the AI assistant help restaurant staff?",
    answer:
      "The AI assistant enables natural language interactions for complex restaurant operations, reducing training time and improving operational efficiency. Staff can use voice commands or chat to manage orders, inventory, compliance, and more.",
    value: "item-2",
  },
  {
    question: "Is Cucumber AI suitable for all types of restaurants?",
    answer:
      "Yes. Cucumber AI supports quick service restaurants, casual dining chains, cloud kitchens, independent restaurants, food trucks, catering businesses, and local eateries. Its scalable architecture fits single outlets to large chains.",
    value: "item-3",
  },
  {
    question: "What makes Cucumber AI different from other POS systems?",
    answer:
      "Cucumber AI is built specifically for Indian restaurants, with deep integrations for GST, UPI, food aggregators, and FSSAI. Its core differentiator is the AI-powered assistant that enables conversational operations and predictive intelligence.",
    value: "item-4",
  },
  {
    question: "How does Cucumber AI handle compliance and payments?",
    answer:
      "Cucumber AI automates GST calculation and filing, tracks FSSAI compliance, and supports UPI, digital wallets, and cash management. It provides compliance alerts and regulatory updates to keep your restaurant up to date.",
    value: "item-5",
  },
  {
    question: "Can Cucumber AI integrate with Swiggy, Zomato, and other platforms?",
    answer:
      "Yes. Cucumber AI offers two-way integration with major food aggregators like Swiggy and Zomato, as well as accounting software and payment gateways, ensuring seamless operations across channels.",
    value: "item-6",
  },
  {
    question: "What are the key benefits for restaurant owners?",
    answer:
      "Owners benefit from reduced training time, improved operational efficiency, predictive analytics, compliance automation, and increased revenue through AI-driven recommendations and marketing.",
    value: "item-7",
  },
  {
    question: "Is Cucumber AI available in regional languages?",
    answer:
      "Yes. The AI assistant supports Hindi, English, and other regional languages, making it accessible for diverse teams across India.",
    value: "item-8",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
