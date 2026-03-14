import { notFound } from "next/navigation";
import { getAllCars, getCarBySlug } from "@/data/cars";
import CarDetailsClient from "./CarDetailsClient";

export function generateStaticParams() {
  return getAllCars().map((car) => ({
    slug: car.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = getCarBySlug(slug);

  if (!car) {
    return { title: "Car Not Found" };
  }

  return {
    title: `${car.brand} ${car.model} - Autocar`,
    description: car.description,
  };
}

export default async function CarDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = getCarBySlug(slug);

  if (!car) {
    notFound();
  }

  return <CarDetailsClient car={car} />;
}
