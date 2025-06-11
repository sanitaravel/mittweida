import { Router, Route } from 'wouter'
import Welcome from './pages/Welcome'
import RouteSelection from './pages/RouteSelection'
import CreateTour from './pages/CreateTour'
import Settings from './pages/Settings'
import GuidedTour from './pages/GuidedTour'
import StoryView from './pages/StoryView'
import Completion from './pages/Completion'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream">
        <Route path="/" component={Welcome} />
        <Route path="/routes" component={RouteSelection} />
        <Route path="/create" component={CreateTour} />
        <Route path="/settings" component={Settings} />
        <Route path="/tour/:routeId" component={GuidedTour} />
        <Route path="/story/:stopId" component={StoryView} />
        <Route path="/completion" component={Completion} />
      </div>
    </Router>
  )
}

export default App
