import { Router, Route } from "wouter";
import { SettingsProvider } from "./contexts/SettingsContext";
import { TourProvider } from "./contexts/TourContext";
import Welcome from "./pages/Welcome";
import RouteSelection from "./pages/RouteSelection";
import CreateTour from "./pages/CreateTour";
import Settings from "./pages/Settings";
import GuidedTour from "./pages/GuidedTour";
import StoryView from "./pages/StoryView";
import Completion from "./pages/Completion";

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-cream">
          <Route path="/" component={Welcome} />
          <Route path="/routes" component={RouteSelection} />
          <Route path="/create" component={CreateTour} />
          <Route path="/settings" component={Settings} />
          <TourProvider>
            <Route path="/tour/:routeId" component={GuidedTour} />
            <Route path="/story/:routeId/:stopId" component={StoryView} />
          </TourProvider>
          <Route path="/completion" component={Completion} />
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
