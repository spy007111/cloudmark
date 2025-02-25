import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useMessages, useTranslations } from "next-intl";

export default async function Page() {
  const t = useTranslations("HomePage");
  const messages = useMessages();
  const keys = Object.keys(messages["HomePage.features"]);
  return (
    <div className="container relative">
      <div className="flex flex-col items-start pt-10 lg:pt-16 gap-4">
        {/* Main Title */}
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
          Cloudmark
        </h1>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-foreground max-w-3xl">
          {t("title")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-[42rem]">
          {t("description")}
        </p>
        <Button asChild>
          <Link href="/doc">
            {" "}
            <MoveRight />
            Quick Start
          </Link>
        </Button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-20">
        {keys.map((key) => (
          <div
            key={key}
            className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <h3 className="font-semibold mb-2 text-lg">
              {t(`features.${key}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(`features.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
