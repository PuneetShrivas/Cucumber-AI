import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number | string;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Starter",
    popular: 0,
    price: "Free",
    description:
      "Ideal for independent restaurants and food trucks looking to digitize operations with AI-powered basics.",
    buttonText: "Get Started",
    benefitList: [
      "AI-powered POS (voice & text)",
      "GST & FSSAI compliance",
      "UPI & digital payments",
      "Basic inventory management",
      "Single outlet support",
      "Community support",
    ],
  },
  {
    title: "Growth",
    popular: 1,
    price: "₹3,999",
    description:
      "Perfect for QSRs, casual dining, and cloud kitchens ready to scale with advanced AI and integrations.",
    buttonText: "Start Free Trial",
    benefitList: [
      "All Starter features",
      "AI-driven kitchen & inventory",
      "Food aggregator integration (Swiggy, Zomato)",
      "Conversational ordering (QR, WhatsApp)",
      "AI-powered analytics & insights",
      "Multi-location management",
      "Priority support",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: "Custom",
    description:
      "For large chains and enterprises needing tailored AI, integrations, and compliance at scale.",
    buttonText: "Contact Sales",
    benefitList: [
      "All Growth features",
      "Custom AI workflows & integrations",
      "Dedicated onboarding & training",
      "Advanced compliance automation",
      "Franchise & regional support",
      "Dedicated account manager",
      "24/7 premium support",
    ],
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Cucumber AI Pricing
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Simple, scalable plans for every Indian restaurant. Unlock AI-powered operations, compliance, and growth—no steep learning curve.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge
                    variant="secondary"
                    className="text-sm text-primary"
                  >
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">
                  {typeof pricing.price === "number" ? `₹${pricing.price}` : pricing.price}
                </span>
                {pricing.price !== "Custom" && (
                  <span className="text-muted-foreground"> /month</span>
                )}
              </div>
              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button className="w-full">{pricing.buttonText}</Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-green-500" />
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center text-muted-foreground mt-10 text-sm">
        All plans include AI-powered assistance, Indian market compliance, and seamless upgrades as you grow.
      </div>
    </section>
  );
};
