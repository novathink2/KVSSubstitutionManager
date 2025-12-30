import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logos */}
        <div className="flex items-center justify-center gap-8 mb-8 animate-fade-in-up">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center p-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/KVS_SVG_logo.svg/2553px-KVS_SVG_logo.svg.png" 
              alt="KVS Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center p-2">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvjveY4wScoGhaa-5390lmWmRyT8ZR4SnpYw&s" 
              alt="PM SHRI Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Welcome to
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold gradient-text">
            KVS AI Substitution Manager
          </h2>
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Effortlessly manage teacher absences and generate optimized substitution schedules in seconds using advanced AI.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 animate-scale-in"
          style={{ animationDelay: '0.6s' }}
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Footer */}
        <div className="mt-16 text-white/70 text-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p>© 2025 KVS AI Substitution Manager</p>
          <p className="mt-1">Made by students of PM SHRI KV PATTOM-2</p>
        </div>
      </div>
    </div>
  );
}
