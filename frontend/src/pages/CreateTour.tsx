import { Link } from "wouter";
import { Filter, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface Attraction {
  id: string;
  name: string;
  type: string;
  selected: boolean;
}

const attractions: Attraction[] = [
  {
    id: "church",
    name: "stAfraChurch",
    type: "historical",
    selected: false,
  },
  {
    id: "castle",
    name: "mittweidaCastle",
    type: "historical",
    selected: false,
  },
  { id: "park", name: "townPark", type: "nature", selected: false },
  {
    id: "cafe",
    name: "localCafe",
    type: "cultural",
    selected: false,
  },
  { id: "museum", name: "textileMuseum", type: "cultural", selected: false },
];

const CreateTour = () => {
  const { t } = useTranslation();
  const [selectedAttractions, setSelectedAttractions] =
    useState<Attraction[]>(attractions);

  const toggleAttraction = (id: string) => {
    setSelectedAttractions((prev) =>
      prev.map((attraction) =>
        attraction.id === id
          ? { ...attraction, selected: !attraction.selected }
          : attraction
      )
    );
  };

  const selectedCount = selectedAttractions.filter((a) => a.selected).length;

  return (
    <div className="min-h-screen bg-cream flex flex-col">      {/* Header */}
      <header className="p-6 border-b border-sandstone/20">
        <div className="flex justify-between items-center">
          <h1 className="text-display text-2xl font-bold text-charcoal">
            {t("createYourOwnTour")}
          </h1>
          <button className="bg-white p-3 rounded-xl shadow-lg hover:bg-beige transition-colors">
            <Filter size={24} className="text-charcoal" />
          </button>
        </div>
      </header>

      {/* Map Area */}
      <div className="h-[40vh] bg-sandstone/20 relative">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-body text-lg text-charcoal/60 mb-4">
              {t("interactiveMap")}
            </div>
            <div className="text-sm text-charcoal/80">{t("tapToAddLocations")}</div>
            <div className="mt-4 space-y-2 text-sm text-charcoal/80">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{t("yourLocation")}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-sage rounded-full"></div>
                <span>{t("availableSpots")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attractions List */}
      <div className="flex-1 p-6">
        <h2 className="text-display text-xl font-semibold text-charcoal mb-6">
          {t("selectAttractions")} ({selectedCount} {t("selected")})
        </h2>

        <div className="space-y-4 mb-8">
          {selectedAttractions.map((attraction) => (
            <label
              key={attraction.id}
              className="flex items-center gap-4 p-4 bg-beige rounded-xl border border-sandstone/20 cursor-pointer hover:bg-sandstone/10 transition-colors"
            >
              <input
                type="checkbox"
                checked={attraction.selected}
                onChange={() => toggleAttraction(attraction.id)}
                className="w-6 h-6 rounded border-2 border-charcoal text-sage focus:ring-sage focus:ring-2"
              />              <div className="flex-1">
                <div className="text-body text-lg text-charcoal font-medium">
                  {t(attraction.name as any)}
                </div>
                <div className="text-body text-sm text-charcoal/60 capitalize">
                  {t(attraction.type as any)}
                </div>
              </div>
            </label>
          ))}
        </div>        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`btn-secondary ${
              selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedCount === 0}
          >
            {t("previewRoute")}
          </button>

          <Link href={selectedCount > 0 ? "/tour/custom" : "#"}>
            <button
              className={`btn-primary ${
                selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={selectedCount === 0}
            >
              {t("startTour")}
            </button>
          </Link>
        </div>

        <Link href="/">
          <button className="btn-secondary mt-4">
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft size={20} />
              {t("back")}
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CreateTour;
