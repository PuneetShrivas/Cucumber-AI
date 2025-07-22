import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import cubeLeg from "././assets/cube-leg.png";
import { JSX } from "react";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Conversational Operations",
    description:
      "Manage every aspect of your restaurant using natural language. Cucumber AI’s assistant enables voice and chat commands for orders, inventory, compliance, and more—no training required.",
    icon: <ChartIcon />,
  },
  {
    title: "AI-Powered Restaurant Management",
    description:
      "Automate POS, kitchen, inventory, and table management with predictive intelligence. Get proactive recommendations, demand forecasts, and compliance alerts tailored for Indian restaurants.",
    icon: <WalletIcon />,
  },
  {
    title: "Indian Market Specialization",
    description:
      "Built for India: GST & FSSAI compliance, UPI payments, food aggregator integrations, and multi-language support. Scale from single outlets to large chains with ease.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              AI-Driven{" "}
            </span>
            Restaurant Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Cucumber AI transforms restaurant management in India with an intelligent assistant, making complex operations as simple as a conversation. Experience zero learning curve, predictive insights, and seamless compliance—purpose-built for Indian restaurants.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={cubeLeg.src}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="Cucumber AI restaurant services"
        />
      </div>
    </section>
  );
};
