import { useParams, useLocation } from "wouter";
import { useTourContext } from "../contexts/TourContext";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface Story {
  id: number;
  image: string;
  title: string;
  description: string;
}

const StoryView = () => {
  const { addVisitedWaypoint } = useTourContext();
  const { t } = useTranslation();
  const { routeId, stopId } = useParams<{ routeId: string; stopId: string }>();
  const [, setLocation] = useLocation();
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  // Removed unused isPaused state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const progressRef = useRef(0);
  const isPausedRef = useRef(false);
  // Duration for each story in seconds (can be customized per story or audio length)
  const STORY_DURATION = 8; // 8 seconds per story

  const stories: Story[] = [
    {
      id: 1,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Church_Mittweida1.JPG/800px-Church_Mittweida1.JPG",
      title: t("exteriorView"),
      description: t("exteriorDescription"),
    },
    {
      id: 2,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Mittweida-Pfarrkirche2-Altar.jpg/800px-Mittweida-Pfarrkirche2-Altar.jpg",
      title: t("stainedGlass"),
      description: t("stainedGlassDescription"),
    },
    {
      id: 3,
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Stadtkirche_Mittweida%2C_Orgel_%281%29.jpg/800px-Stadtkirche_Mittweida%2C_Orgel_%281%29.jpg",
      title: t("stoneCarvings"),
      description: t("stoneCarvingsDescription"),
    },
  ]; // Ensure currentStory is within valid bounds on mount
  useEffect(() => {
    if (
      stories &&
      stories.length > 0 &&
      (currentStory < 0 || currentStory >= stories.length)
    ) {
      setCurrentStory(0);
    }
  }, [currentStory, stories]); // Auto-progression effect
  useEffect(() => {
    // Immediately reset progress when story changes (before any intervals)
    progressRef.current = 0;
    setProgress(0);

    const interval = setInterval(() => {
      // Check pause state inside interval to avoid resetting progress
      if (isPausedRef.current) return;

      progressRef.current += 100 / (STORY_DURATION * 20); // Update every 50ms for smoother animation

      if (progressRef.current >= 100) {
        // Move to next story when progress is complete
        if (currentStory < stories.length - 1) {
          // Trigger transition animation for auto-progression
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentStory(currentStory + 1);
            isPausedRef.current = false;
            // setIsPaused removed
            setIsTransitioning(false);
          }, 150);
        } else {
          // Last story completed, stop progression and return to guided tour
          isPausedRef.current = true;
          // setIsPaused removed
          progressRef.current = 100;
          setProgress(100);

          if (stopId) {
            addVisitedWaypoint(stopId);
          }
          setLocation(`/tour/${routeId}`);
        }
        return; // Exit early to prevent further updates
      }

      setProgress(progressRef.current);
    }, 50); // Update every 50ms for smoother animation

    return () => clearInterval(interval);
  }, [currentStory, stories.length, STORY_DURATION]);
  const nextStory = () => {
    if (isTransitioning || !stories.length) return; // Prevent multiple transitions and ensure stories exist
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
      isPausedRef.current = false;
      // setIsPaused removed
      setIsTransitioning(false);
    }, 150); // Half of transition duration
  };

  const prevStory = () => {
    if (isTransitioning || !stories.length) return; // Prevent multiple transitions and ensure stories exist
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
      isPausedRef.current = false;
      // setIsPaused removed
      setIsTransitioning(false);
    }, 150); // Half of transition duration
  };

  // Handle navigation button clicks to prevent pause functionality
  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevStory();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextStory();
  };

  // Toggle pause/play when pressing and holding the screen
  const handleMouseDown = () => {
    isPausedRef.current = true;
    // setIsPaused removed
  };

  const handleMouseUp = () => {
    isPausedRef.current = false;
    // setIsPaused removed
  }; // Prevent context menu on long press
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const story = stories[currentStory];
  // Safety check to prevent errors when story is undefined or stories array is empty
  if (
    !stories.length ||
    !story ||
    currentStory < 0 ||
    currentStory >= stories.length
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Story Content */}
      <div className="h-screen flex flex-col">
        {/* Image Area */}
        <div
          className="flex-1 relative select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onContextMenu={handleContextMenu}
          style={
            {
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              touchAction: "manipulation",
            } as React.CSSProperties
          }
        >
          <img
            src={story.image}
            alt={story.title}
            className={`w-full h-full object-cover transition-all duration-300 ease-in-out ${
              isTransitioning ? "scale-105 opacity-80" : "scale-100 opacity-100"
            }`}
            key={currentStory} // Force re-render for animation
          />

          {/* Top shadow overlay */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Navigation Zones */}
          {/* Left zone for previous story */}
          {currentStory > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
              onClick={handlePrevClick}
            />
          )}

          {/* Right zone for next story */}
          {currentStory < stories.length - 1 && (
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
              onClick={handleNextClick}
            />
          )}

          {/* Story Progress */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{
                    width: `${
                      index < currentStory
                        ? 100
                        : index === currentStory
                        ? progress
                        : 0
                    }%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div
          className={`bg-gradient-to-t from-black/95 via-black/70 to-transparent absolute bottom-0 left-0 right-0 p-6 h-40 transition-all duration-300 ease-in-out ${
            isTransitioning
              ? "opacity-60 translate-y-2"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h2 className="text-2xl font-bold mb-2 text-white">{story.title}</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            {story.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
