import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomMark = () => {
  const adjectives = [
    "vacuous",
    "tearful",
    "faint",
    "jumbled",
    "wandering",
    "mature",
    "savory",
    "mighty",
    "disgusted",
    "abstracted",
    "telling",
  ];
  const nouns = [
    "person",
    "inspector",
    "significance",
    "chapter",
    "reputation",
    "outcome",
    "association",
    "failure",
    "population",
    "wealth",
    "bird",
  ];
  const randomNum = Math.floor(Math.random() * 10000);
  return `${
    adjectives[Math.floor(Math.random() * adjectives.length)]
  }-${nouns[Math.floor(Math.random() * nouns.length)]}-${randomNum}`;
};

export const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000")
  );
};
