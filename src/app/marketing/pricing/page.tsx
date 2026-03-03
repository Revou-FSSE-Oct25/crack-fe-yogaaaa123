import React from "react";

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  comingSoon?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "Coming Soon",
    description: "Basic access for small inventory usage.",
    features: [
      "Product management",
      "Stock tracking",
      "Incoming & outgoing logs",
      "Single user access",
    ],
    comingSoon: true,
  },
  {
    name: "Pro",
    price: "$19 / month",
    description:
      "Perfect for growing businesses managing inventory daily.",
    features: [
      "Unlimited products",
      "Real-time stock updates",
      "Multi-user access",
      "Export reports (CSV, PDF)",
      "Dashboard analytics",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    description:
      "Advanced solution for large-scale inventory systems.",
    features: [
      "All Pro features",
      "Role & permission management",
      "API integration",
      "Priority support",
      "Custom deployment",
    ],
  },
];

type PricingCardProps = {
  plan: PricingPlan;
};

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <div
      className={`rounded-2xl border p-8 flex flex-col justify-between shadow-sm transition-all
      ${
        plan.highlighted
          ? "border-black scale-105"
          : "border-gray-200"
      }`}
    >
      <div>
        <h3 className="text-2xl font-semibold">{plan.name}</h3>

        <p className="mt-2 text-gray-500 text-sm">
          {plan.description}
        </p>

        <div className="mt-6 text-3xl font-bold">
          {plan.price}
        </div>

        <ul className="mt-6 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-700">
              • {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        disabled={plan.comingSoon}
        className={`mt-8 w-full rounded-lg py-3 font-medium transition
          ${
            plan.comingSoon
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : plan.highlighted
              ? "bg-black text-white hover:opacity-90"
              : "border border-black hover:bg-black hover:text-white"
          }`}
      >
        {plan.comingSoon ? "Coming Soon" : "Get Started"}
      </button>
    </div>
  );
};

const PricingPage: React.FC = () => {
  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold">
          IMS Pricing
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Inventory Management System to manage products,
          track stock movement, and monitor incoming and
          outgoing inventory efficiently.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPage;