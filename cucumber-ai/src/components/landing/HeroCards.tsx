import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Executive Summary */}
      <Card className="absolute w-[340px] gap-0 -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>CAI</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Cucumber AI</CardTitle>
            <CardDescription>Restaurant OS for India</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <span>
            Simplifying Indian restaurant operations with an AI assistant.
          </span>
        </CardContent>
      </Card>

      {/* Core Value Proposition */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col gap-2 justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src="https://i.pravatar.cc/150?img=58"
            alt="ai assistant"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">AI Ops</CardTitle>
          <CardDescription className="font-normal text-primary">
            For Restaurants
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            Manage your restaurant by simply talking to your assistant.
          </p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://github.com/cucumber-ai"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Github icon</span>
              <GitHubLogoIcon className="w-5 h-5" />
            </a>
            <a
              rel="noreferrer noopener"
              href="https://www.linkedin.com/company/cucumber-ai/"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Linkedin icon</span>
              <Linkedin size="20" />
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Key Metrics */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Success Metrics
            <Badge
              variant="secondary"
              className="text-sm text-primary"
            >
              Measurable Impact
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">95%</span>
            <span className="text-muted-foreground"> adoption</span>
          </div>

          <CardDescription>
            80% less training time, 25% faster orders, 15% higher revenue, 90%+ user satisfaction.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full">See How It Works</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {[
              "Conversational POS & ordering",
              "AI-driven inventory & compliance",
              "Real-time analytics & insights",
            ].map((benefit: string) => (
              <span key={benefit} className="flex">
                <Check className="text-green-500" />
                <h3 className="ml-2">{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* AI Differentiator */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>AI at Every Touchpoint</CardTitle>
            <CardDescription className="text-md mt-2">
              Natural language interface for POS, kitchen, inventory, analytics, and compliance. Built for Indian restaurants, from QSRs to cloud kitchens.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
