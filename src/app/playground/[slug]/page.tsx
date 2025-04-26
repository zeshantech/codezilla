import { type Metadata } from "next";
import Playground from "./client";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata> {
  return {
    title: `Playground - ${params.slug}`,
    description: "Coding playground to solve programming problems",
  };
}

export default function PlaygroundPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  return <Playground slug={params.slug} />;
}
