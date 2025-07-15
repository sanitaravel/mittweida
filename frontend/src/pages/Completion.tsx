import { Link, useParams } from "wouter";
import {  RotateCcw, LogOut, Star } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useState } from "react";

// Add mittweidaRoutes import
import { mittweidaRoutes } from "../data/routes";

const Completion = () => {
  const { t } = useTranslation();
  const params = useParams<{ routeId: string }>();
  const routeId = params.routeId;

  // Find route stats by routeId
  let tourStats = {
    name: "Tour",
    stops: 0,
    duration: "-",
    date: new Date().toLocaleDateString(),
    startedAt: null as number | null,
  };
  const activeTourRaw = localStorage.getItem('activeTour');
  console.log("Active Tour Raw:", activeTourRaw);
  if (activeTourRaw) {
    try {
      const activeTour = JSON.parse(activeTourRaw);
      if (activeTour && activeTour.tourId === routeId) {
        // Match route name from mittweidaRoutes
        const routeObj = mittweidaRoutes.find(r => r.id === routeId);
        let routeName = routeObj ? routeObj.name : "Route name";
        // Calculate duration in minutes
        let durationMinutes = "-";
        if (activeTour.startedAt) {
          const now = Date.now();
          const diffMs = now - activeTour.startedAt;
          durationMinutes = Math.max(1, Math.round(diffMs / 60000)).toString() + " min";
        }
        tourStats = {
          name: routeName,
          stops: activeTour.stops,
          duration: durationMinutes,
          date: new Date(activeTour.startedAt).toLocaleDateString(),
          startedAt: activeTour.startedAt,
        };
      }
    } catch {}
  }

  // State for review
  const [reviewStars, setReviewStars] = useState<number | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");

  const handleStarClick = (star: number) => {
    setReviewStars(star);
  };

  // const handleStarMouseEnter = (star: number) => {
  //   setHoveredStar(star);
  // };

  const handleStarMouseLeave = () => {
    setHoveredStar(null);
  };

  const handleSubmitReview = () => {
    setReviewSubmitted(true);
    // Here you could send the review to a backend or analytics
    // e.g. sendReview(routeId, reviewStars)
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Main Content */}
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        {/* Review Section */}
        {!reviewSubmitted && (
          <div className="w-full max-w-md mb-10 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-charcoal mb-4">{"Rate your experience"}</h2>
            <p className="text-charcoal/80 mb-6 text-center">{"How would you rate this route?"}</p>
            <div
              className="flex gap-2 mb-6"
              onMouseLeave={handleStarMouseLeave}
            >
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  className="focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={40}
                    className={
                      star <= (hoveredStar !== null ? hoveredStar : reviewStars ?? 0)
                        ? "text-sandstone drop-shadow scale-110 transition-all duration-150"
                        : "text-beige transition-all duration-150"
                    }
                    fill={star <= (hoveredStar !== null ? hoveredStar : reviewStars ?? 0) ? "var(--color-sandstone)" : "none"}
                  />
                </button>
              ))}
            </div>
            <textarea
              className="w-full min-h-[80px] max-h-[200px] p-3 rounded-lg border border-sandstone/30 focus:border-sandstone focus:outline-none text-charcoal bg-beige mb-2 resize-vertical"
              placeholder="Leave your review here..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              maxLength={500}
            />
            <div
              className={`w-full text-right text-xs mb-4 ${reviewText.length >= 500 ? 'text-terracotta' : 'text-sandstone'}`}
            >
              {500 - reviewText.length} symbols left
            </div>
            <button
              className="bg-sage text-white rounded-lg px-6 py-3 font-semibold text-lg shadow-md hover:bg-sandstone transition-all duration-150"
              disabled={reviewStars === null}
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
          </div>
        )}

        {/* Congratulations and rest of content after review */}
        {reviewSubmitted && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-display text-4xl md:text-5xl font-bold text-charcoal mb-6">
                {t("congratulations")}
              </h1>
              <div className="text-body text-xl text-charcoal/80 space-y-2">
                <p>{t("youCompletedTour")}</p>
                <p className="font-semibold">
                  "{tourStats.name}" • {tourStats.stops} {t("stops")} • {tourStats.duration}
                </p>
                <p className="text-lg text-charcoal/60">
                  {t("completedOn" )} {tourStats.date}
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="w-full max-w-md space-y-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Link href={`/tour/${routeId || "historical"}`} className="h-full w-full">
                  <button
                    className="h-full w-full btn-secondary bg-terracotta text-white hover:bg-sandstone px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-150 flex items-center justify-center gap-2"
                    onClick={() => {
                      // Update startedAt in localStorage for activeTour
                      const activeTourRaw = localStorage.getItem('activeTour');
                      if (activeTourRaw) {
                        try {
                          const activeTour = JSON.parse(activeTourRaw);
                          if (activeTour && activeTour.tourId === routeId) {
                            activeTour.startedAt = Date.now();
                            localStorage.setItem('activeTour', JSON.stringify(activeTour));
                          }
                        } catch {}
                      }
                    }}
                  >
                    <RotateCcw size={20} />
                    Restart Tour
                  </button>
                </Link>

                <Link href="/" className="h-full w-full">
                  <button className="h-full w-full btn-primary bg-sage text-white hover:bg-sandstone px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-150 flex items-center justify-center gap-2">
                    <LogOut size={20} />
                    Back
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-body text-sm text-charcoal/60">
          {t("thankYouExploring")}
        </p>
      </footer>
    </div>
  );
};

export default Completion;
