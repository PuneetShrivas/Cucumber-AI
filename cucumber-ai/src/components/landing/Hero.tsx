import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { IconBrandYoutube } from "@tabler/icons-react";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#b0eace]  to-[#72E3AD] text-transparent bg-clip-text">
              Cucumber AI
            </span>{" "}
            for Indian Restaurants
          </h1>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          The most intuitive restaurant operating system for India, powered by an intelligent AI assistant. Simplify GST, UPI, food aggregator, and FSSAI compliance—manage your restaurant with natural language, zero learning curve, and predictive intelligence.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3">Request a Demo</Button>

          <a
            rel="noreferrer noopener"
            href="https://github.com/leoMirandaa/shadcn-landing-page.git"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Watch video
            <IconBrandYoutube className="ml-2 w-5 h-5" />
          </a>
        </div>

        <ul className="mt-6 text-left text-base text-muted-foreground space-y-2 md:w-10/12 mx-auto lg:mx-0">
          <li>
            <span className="font-semibold text-foreground">Conversational Operations:</span> Manage orders, inventory, and compliance with simple voice or text commands.
          </li>
          <li>
            <span className="font-semibold text-foreground">Zero Learning Curve:</span> AI assistant guides every step—no training required.
          </li>
          <li>
            <span className="font-semibold text-foreground">Built for India:</span> GST, UPI, Swiggy/Zomato, FSSAI, and regional language support.
          </li>
          <li>
            <span className="font-semibold text-foreground">Scalable:</span> From single outlets to multi-location chains and cloud kitchens.
          </li>
        </ul>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
