export const en = {
  // Navigation
  back: "Back",
  backToHome: "Back to Home",
  next: "Next",
  previous: "Previous",
  finish: "Finish",
  start: "Start",
  continue: "Continue",

  // Settings
  settings: "Settings",
  textSize: "Text Size",
  preview: "Preview",
  previewText:
    "This is how text will appear in the app with your selected size.",
  sample: "Sample",
  enableAudioNarration: "Enable Audio Narration",
  highContrastMode: "High Contrast Mode",
  language: "Language",

  // Text sizes
  small: "Small",
  medium: "Medium",
  large: "Large",

  // Languages
  english: "English",
  german: "German",

  // Notifications
  textSizeChanged: "Text size changed to {{size}}",
  audioNarrationEnabled: "Audio narration enabled",
  audioNarrationDisabled: "Audio narration disabled",
  highContrastEnabled: "High contrast mode enabled",
  highContrastDisabled: "High contrast mode disabled",
  languageChanged: "Language changed to {{language}}",
  settingsSaved: "Settings saved successfully",
  // Welcome page
  welcome: "Welcome",
  welcomeTitle: "Welcome to Mittweida",
  welcomeSubtitle: "Let's explore at your pace",
  startExploring: "Start Exploring",

  // Tour selection
  selectTour: "Select a Suggested Tour",
  chooseTour: "What would you like to do?",
  // Create tour
  createTour: "Create Tour",
  createCustomTour: "Create a Custom Tour",
  createYourOwnTour: "Create Your Own Tour",
  interactiveMap: "Interactive Map",
  tapToAddLocations: "Tap to add locations",
  yourLocation: "Your Location",
  availableSpots: "Available Spots",
  selectAttractions: "Select Attractions",
  selected: "selected",
  previewRoute: "Preview Route",
  startTour: "Start Tour",

  // Attractions
  stAfraChurch: "St. Afra Church",
  mittweidaCastle: "Mittweida Castle",
  townPark: "Town Park",
  localCafe: 'Local Café "Kaffeestube"',
  textileMuseum: "Textile Museum",
  historical: "historical",
  nature: "nature",
  cultural: "cultural",
  // Guided tour
  guidedTour: "Guided Tour",
  route: "Route",
  currentStop: "Current Stop",
  stop: "Stop",
  playAudio: "Play Audio",
  viewPhotos: "View Photos",
  accessibility: "Accessibility",
  benchNearby: "Bench nearby for resting",
  nextStop: "Next Stop",
  pauseTour: "Pause Tour",

  // Church location
  stAfraChurchDescription:
    "Built in the 14th century, St. Afra Church stands as one of Mittweida's most significant historical landmarks. The Gothic architecture features beautiful stained glass windows and intricate stone carvings.",

  // Story view
  storyView: "Story View",
  exitStory: "Exit Story",
  exteriorView: "Exterior View",
  stainedGlass: "Stained Glass",
  stoneCarvings: "Stone Carvings",
  exteriorDescription:
    "Built in the 14th century, this Gothic church has witnessed centuries of history.",
  stainedGlassDescription:
    "The magnificent stained glass windows tell stories of saints and local legends.",
  stoneCarvingsDescription:
    "Intricate stone carvings showcase the masterful craftsmanship of medieval artisans.", // Route selection
  routeSelection: "Route Selection",
  tapOnRoute: "Tap on a route line to see details:",
  showingRoutes: "Showing {{start}}-{{end}} of {{total}} routes",
  showingAllRoutes: "Showing all {{total}} routes",
  previousPage: "Previous page",
  nextPage: "Next page",
  swipeToNavigate: "Swipe left or right to see more routes",
  shortHistoricalWalk: "Short Historical Walk",
  churchParkStroll: "Church & Park Stroll",
  universityCampusTour: "University Campus Tour",
  cityCenterLoop: "City Center Loop",
  natureTrail: "Nature Trail",
  architecturalHighlights: "Architectural Highlights",
  familyFriendlyRoute: "Family-Friendly Route",
  quickHighlights: "Quick Highlights",
  eveningStroll: "Evening Stroll",
  studentLifeTour: "Student Life Tour",
  benchesAlongWay: "benches along the way",
  wheelchairAccessible: "wheelchair accessible",
  cafesNearby: "cafés nearby",
  shadedPaths: "shaded paths",
  indoorSections: "indoor sections",
  shoppingNearby: "shopping nearby",
  scenicViews: "scenic views",
  photoOpportunities: "photo opportunities",
  playgroundsNearby: "playgrounds nearby",
  wellLit: "well lit",
  nightlifeNearby: "nightlife nearby",
  stops: "stops",
  historicalRoute: "Historical Route",
  churchRoute: "Church Route",

  // Completion
  completion: "Completion",
  congratulations: "Congratulations!",
  tourCompleted: "You have completed the tour",
  youCompletedTour: "You completed the tour:",
  completedOn: "Completed on",
  yourTravelJournal: "Your Travel Journal",
  pdf: "PDF",
  email: "Email",
  print: "Print",
  restartTour: "Restart Tour",
  thankYouExploring: "Thank you for exploring Mittweida with us!",

  // Common
  loading: "Loading...",
  error: "Error",
  retry: "Retry",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  edit: "Edit",
  delete: "Delete",

  // Filters
  filterRoutes: "Filter Routes",
  maxDuration: "Maximum Duration",
  numberOfStops: "Number of Stops",
  minimum: "Minimum",
  maximum: "Maximum",
  any: "Any",
  routeFeatures: "Route Features",
  selectDesiredFeatures: "Select desired features",
  clearAll: "Clear All",
  applyFilters: "Apply Filters",

  // Accessibility
  closeNotification: "Close notification",
  toggleSettings: "Toggle settings",
  selectLanguage: "Select language",
  toggleAudioNarration: "Toggle audio narration",
  toggleHighContrast: "Toggle high contrast mode",
};

export type TranslationKey = keyof typeof en;
