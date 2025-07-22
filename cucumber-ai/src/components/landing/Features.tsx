import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "./assets/growth.png";
import image3 from "./assets/reflecting.png";
import image4 from "./assets/looking-ahead.png";
import { StaticImageData } from "next/image";

interface FeatureProps {
  title: string;
  description: string;
  image: string | StaticImageData;
}

const features: FeatureProps[] = [
  {
    title: "Conversational AI Operations",
    description:
      "Manage your restaurant with natural language commands. Cucumber AI’s assistant handles everything from order entry to compliance, reducing training time and making operations as simple as a conversation.",
    image: image4,
  },
  {
    title: "Indian Market Focused",
    description:
      "Purpose-built for Indian restaurants: GST and FSSAI compliance, UPI payments, food aggregator (Swiggy, Zomato) integrations, and regional language support.",
    image: image3,
  },
  {
    title: "Predictive Intelligence & Insights",
    description:
      "Get proactive recommendations, demand forecasts, and actionable analytics. Cucumber AI helps you optimize inventory, staffing, and menu based on real-time data.",
    image: image,
  },
];

const featureList: string[] = [
  "AI POS",
  "Voice/Chat",
  "GST/FSSAI",
  "UPI Payments",
  "Aggregator",
  "Inventory",
  "Kitchen Ops",
  "Multi-location",
  "Loyalty",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Discover{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Cucumber AI’s Core Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={typeof image === "string" ? image : image.src}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
