import { type Metadata } from "next";
import Playground from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Playground - ${slug}`,
    description: "Coding playground to solve programming problems",
  };
}

export default async function page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  return <Playground slug={slug} />;
}
