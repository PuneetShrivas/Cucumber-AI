import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rohit Sharma",
    userName: "QSR Chain Owner, Mumbai",
    comment:
      "Cucumber AI’s conversational POS has made order taking and billing effortless for my staff. Training new team members now takes minutes, not days.",
  },
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Menon",
    userName: "Cloud Kitchen Operator, Bangalore",
    comment:
      "The AI assistant predicts demand spikes and helps optimize my kitchen workflow. We’ve reduced food waste and improved delivery times significantly.",
  },
  {
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "Sandeep Singh",
    userName: "Casual Dining, Delhi",
    comment:
      "GST and FSSAI compliance used to be a headache. Now, Cucumber AI handles it automatically and even reminds me about renewals. Total peace of mind.",
  },
  {
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Anjali Gupta",
    userName: "Independent Restaurant, Pune",
    comment:
      "I love the natural language interface. I just tell the assistant what I want, and it gets done—whether it’s inventory, menu updates, or staff scheduling.",
  },
  {
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    name: "Vikram Patel",
    userName: "Food Truck Owner, Ahmedabad",
    comment:
      "UPI payments and aggregator orders are all managed in one place. Cucumber AI’s mobile POS is perfect for my on-the-go business.",
  },
  {
    image: "https://randomuser.me/api/portraits/women/23.jpg",
    name: "Meera Iyer",
    userName: "Catering Business, Chennai",
    comment:
      "The AI-driven analytics help me understand customer trends and optimize my menu. My average order value has gone up by 20%.",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        Why Indian Restaurants Choose
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Cucumber AI{" "}
        </span>
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Hear from restaurant owners and operators across India who have transformed their business with Cucumber AI’s intelligent, conversational platform.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt={name}
                    src={image}
                  />
                  <AvatarFallback>
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
