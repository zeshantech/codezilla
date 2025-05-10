"use client";

import { UserProfile } from "@/types/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, StarIcon, ZapIcon, RocketIcon } from "lucide-react";

interface ProfilePremiumProps {
  user: UserProfile;
}

export function ProfilePremium({}: ProfilePremiumProps) {
  // Mock data for premium plans
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      description: "Get started with basic features",
      features: [
        "Access to basic problems",
        "Community discussions",
        "Progress tracking",
        "Public profile",
      ],
      isPopular: false,
      isCurrentPlan: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9.99",
      period: "monthly",
      description: "Best for serious learners",
      features: [
        "Everything in Basic",
        "Access to all problems",
        "Advanced analytics",
        "Skill assessments",
        "Solution explanations",
        "Ad-free experience",
      ],
      isPopular: true,
      isCurrentPlan: false,
    },
    {
      id: "team",
      name: "Team",
      price: "$49.99",
      period: "monthly",
      description: "Perfect for teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Shared workspaces",
        "Team analytics",
        "Custom problem sets",
        "Priority support",
      ],
      isPopular: false,
      isCurrentPlan: false,
    },
  ];

  // Benefits of premium
  const benefits = [
    {
      title: "Comprehensive Learning",
      description:
        "Access to a vast library of problems, solutions, and explanations",
      icon: <StarIcon className="h-5 w-5" />,
    },
    {
      title: "Performance Analytics",
      description:
        "Detailed insights into your strengths and areas for improvement",
      icon: <ZapIcon className="h-5 w-5" />,
    },
    {
      title: "Career Growth",
      description:
        "Prepare for interviews with company-specific problem sets and guidance",
      icon: <RocketIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Upgrade Your Coding Experience
        </h2>
        <p className="text-muted-foreground">
          Choose the plan that helps you achieve your coding goals faster
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${
              plan.isPopular ? "border-primary shadow-md relative" : ""
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-primary hover:bg-primary">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">/{plan.period}</span>
                )}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.isCurrentPlan ? (
                <Button className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  Upgrade to {plan.name}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="pt-8 border-t mt-8">
        <h3 className="text-xl font-semibold mb-6 text-center">
          Why Upgrade to Premium?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-muted/40">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted/40 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            Ready to take your coding skills to the next level?
          </h3>
          <p className="text-muted-foreground">
            Join thousands of developers who have accelerated their learning
            with our premium features.
          </p>
        </div>
        <Button size="lg" className="mt-4 md:mt-0">
          See All Premium Features
        </Button>
      </div>
    </div>
  );
}
