import { Link } from "wouter";
import { Settings } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const Welcome = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {" "}
      {/* Header with Settings */}
      <header className="flex justify-end items-center p-6">
        <Link href="/settings">
          <button
            className="p-3 rounded-full hover:bg-beige transition-colors"
            aria-label={t("toggleSettings")}
          >
            <Settings size={28} className="text-charcoal" />
          </button>
        </Link>
      </header>{" "}
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 pb-16">
        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h1 className="text-display text-4xl md:text-5xl font-bold text-charcoal mb-3">
            {t("welcomeTitle")}
          </h1>
          <p className="text-body text-lg md:text-xl text-charcoal/80">
            {t("welcomeSubtitle")}
          </p>
        </div>{" "}
        {/* Question and Buttons */}
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-display text-2xl md:text-3xl text-center text-charcoal mb-8">
            {t("chooseTour")}
          </h2>{" "}
          <div className="flex flex-col items-center gap-6">
            <Link href="/routes">
              <button className="btn-primary">{t("selectTour")}</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
