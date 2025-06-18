import { useParams, Link } from "wouter";
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface Story {
  id: number;
  image: string;
  title: string;
  description: string;
}

const StoryView = () => {
  const { t } = useTranslation();
  const { stopId } = useParams<{ stopId: string }>();
  const [currentStory, setCurrentStory] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const stories: Story[] = [
    {
      id: 1,
      image: "/api/placeholder/400/600",
      title: t("exteriorView"),
      description: t("exteriorDescription"),
    },
    {
      id: 2,
      image: "/api/placeholder/400/600",
      title: t("stainedGlass"),
      description: t("stainedGlassDescription"),
    },
    {
      id: 3,
      image: "/api/placeholder/400/600",
      title: t("stoneCarvings"),
      description: t("stoneCarvingsDescription"),
    },
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const story = stories[currentStory];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Story Content */}
      <div className="h-screen flex flex-col">
        {/* Image Area */}
        <div className="flex-1 relative">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          {currentStory > 0 && (
            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {currentStory < stories.length - 1 && (
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Audio Control */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="absolute bottom-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          >
            {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>

          {/* Story Progress */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index === currentStory ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-bold mb-2 text-white">{story.title}</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            {story.description}
          </p>
        </div>
      </div>      {/* Exit Button */}
      <Link href="/tour/historical">
        <button className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-full hover:bg-black/70 transition-colors flex items-center gap-2">
          <X size={20} />
          {t("exitStory")}
        </button>
      </Link>
    </div>
  );
};

export default StoryView;
