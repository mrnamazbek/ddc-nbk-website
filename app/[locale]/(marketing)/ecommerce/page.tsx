import { type Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { BubbleText } from "@/components/ui/BubbleText";

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Ecommerce page",
};

export default function EcommercePage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
          <BubbleText text="Ecommerce" />
        </h1>
        <CardDescription>
          <BubbleText text="The future of ecommerce is here." />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <BubbleText text="This is the ecommerce page." />
        </p>
      </CardContent>
    </Card>
  );
}