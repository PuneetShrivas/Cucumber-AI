import { Statistics } from "./Statistics";
import pilot from "./assets/pilot.png";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot.src}
            alt="Cucumber AI mascot"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Cucumber AI
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Cucumber AI is a comprehensive restaurant operating system built for the Indian market, featuring an intelligent AI assistant that simplifies restaurant operations at every touchpoint. Designed for GST and FSSAI compliance, UPI payments, and seamless food aggregator integration, Cucumber AI transforms complex workflows into simple, conversational experiences.
                <br /><br />
                With AI-powered assistance embedded throughout the platform, restaurant teams can manage orders, inventory, kitchen operations, compliance, and customer engagement using natural language—reducing training time and boosting efficiency. Whether you run a single outlet or a multi-location chain, Cucumber AI adapts to your needs, offering predictive insights, proactive recommendations, and a zero learning curve for staff.
                <br /><br />
                Our vision is to make restaurant management as intuitive as having a conversation with an intelligent assistant, empowering Indian restaurants to deliver exceptional service and grow with confidence.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
