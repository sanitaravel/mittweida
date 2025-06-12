import { useParams, Link } from "wouter";
import {
  Filter,
  Play,
  Image as ImageIcon,
  Pause,
  SkipForward,
} from "lucide-react";

const GuidedTour = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const currentStop = 1;
  const totalStops = 5;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Map Area */}
      <div className="h-1/2 bg-sandstone/20 relative">
        <div className="absolute top-4 right-4">
          <button className="bg-white p-3 rounded-xl shadow-lg hover:bg-beige transition-colors">
            <Filter size={24} className="text-charcoal" />
          </button>
        </div>

        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-body text-lg text-charcoal/60 mb-4">
              Interactive Map - {routeId} Route
            </div>
            <div className="space-y-2 text-sm text-charcoal/80">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {currentStop}
                </div>
                <span>Current Stop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stop Information */}
      <div className="flex-1 p-6">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-display text-2xl font-bold text-charcoal">
              Stop {currentStop}: St. Afra Church
            </h2>
            <span className="text-body text-sm text-charcoal/60 bg-beige px-3 py-1 rounded-full">
              {currentStop}/{totalStops}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-body text-lg text-charcoal leading-relaxed">
              Built in the 14th century, St. Afra Church stands as one of
              Mittweida's most significant historical landmarks. The Gothic
              architecture features beautiful stained glass windows and
              intricate stone carvings.
            </p>

            {/* Media Controls */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-dustyBlue text-white px-6 py-3 rounded-xl hover:bg-dustyBlue/90 transition-colors">
                <Play size={20} />
                Play Audio
              </button>

              <Link href="/story/church">
                <button className="flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-xl hover:bg-terracotta/90 transition-colors">
                  <ImageIcon size={20} />
                  View Photos
                </button>
              </Link>
            </div>

            <div className="text-body text-sm text-charcoal/70 bg-sage/10 p-3 rounded-lg">
              ♿ Accessibility: Bench nearby for resting
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="p-6 bg-cream border-t border-sandstone/20">
        <div className="grid grid-cols-2 gap-4">
          <button className="btn-primary">
            <div className="flex items-center justify-center gap-2">
              <SkipForward size={20} />
              Next Stop
            </div>
          </button>

          <button className="btn-secondary">
            <div className="flex items-center justify-center gap-2">
              <Pause size={20} />
              Pause Tour
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
