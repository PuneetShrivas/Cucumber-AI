import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "./Icons";
import { JSX } from "react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Conversational Operations",
    description:
      "Manage your restaurant with natural language commands—place orders, update menus, and handle billing just by talking to Cucumber AI. No training required.",
  },
  {
    icon: <MapIcon />,
    title: "Indian Market Focused",
    description:
      "Seamless GST and FSSAI compliance, UPI payments, and food aggregator integrations. Built for the unique needs of Indian restaurants, from single outlets to large chains.",
  },
  {
    icon: <PlaneIcon />,
    title: "Predictive Intelligence",
    description:
      "Get proactive recommendations and real-time insights—AI predicts demand, optimizes inventory, and suggests actions to boost efficiency and revenue.",
  },
  {
    icon: <GiftIcon />,
    title: "Zero Learning Curve",
    description:
      "Cucumber AI’s intuitive assistant eliminates complex onboarding. Staff can complete core tasks in their first session, reducing training time by 80%.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How Cucumber{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          AI Works{" "}
        </span>
        Step-by-Step
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Cucumber AI transforms restaurant management by combining proven POS features with an intelligent assistant. Here’s how it simplifies operations for Indian restaurants:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
