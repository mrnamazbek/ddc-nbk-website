import { type Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Ecommerce page",
};

export default function EcommercePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ecommerce</CardTitle>
        <CardDescription>
          The future of ecommerce is here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This is the ecommerce page.
        </p>
      </CardContent>
    </Card>
  );
}