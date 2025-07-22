export const Statistics = () => {
  interface StatsProps {
    quantity: string;
    description: string;
  }

  const stats: StatsProps[] = [
    
    {
      quantity: "90%+",
      description: "Customer satisfaction with AI assistant",
    },
    {
      quantity: "99.9%",
      description: "System uptime guarantee",
    },
    {
      quantity: "<200ms",
      description: "AI response time",
    },
    {
      quantity: "500+",
      description: "App integrations supported",
    },
  ];

  return (
    <section id="statistics">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Cucumber AI: Transforming Restaurant Operations
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(({ quantity, description }) => (
          <div
            key={description}
            className="space-y-2 text-center"
          >
            <h3 className="text-3xl sm:text-4xl font-bold">{quantity}</h3>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-lg text-muted-foreground">
        <p>
          Cucumber AI is India’s first restaurant OS with an intelligent assistant at its core.
          <br />
          <span className="font-semibold">Conversational operations, zero learning curve, and predictive intelligence—built for Indian restaurants.</span>
        </p>
      </div>
    </section>
  );
};
