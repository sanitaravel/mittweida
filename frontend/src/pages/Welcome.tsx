import { Link } from "wouter";
import { Settings } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col">      {/* Header with Settings */}
      <header className="flex justify-end items-center p-6">
        <Link href="/settings">
          <button className="p-3 rounded-full hover:bg-beige transition-colors">
            <Settings size={28} className="text-charcoal" />
          </button>
        </Link>
      </header>{" "}
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 pb-16">
        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h1 className="text-display text-4xl md:text-5xl font-bold text-charcoal mb-3">
            Welcome to Mittweida.
          </h1>
          <p className="text-body text-lg md:text-xl text-charcoal/80">
            Let's explore at your pace.
          </p>
        </div>{" "}        {/* Question and Buttons */}
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-display text-2xl md:text-3xl text-center text-charcoal mb-8">
            What would you like to do?
          </h2>{" "}
          <div className="flex flex-col items-center gap-6">
            <Link href="/routes">
              <button className="btn-primary">Select a Suggested Tour</button>
            </Link>

            <Link href="/create">
              <button className="btn-secondary">Create Your Own Tour</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
