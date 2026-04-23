import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Cinematic background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 blur-3xl opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Logo/Title */}
        <div className="mb-8 animate-float">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-gradient">
            Smart Classroom
          </h1>
          <p className="text-xl text-gray-300 mb-2">Manager</p>
          <div className="accent-line mx-auto w-24 mt-4"></div>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          Streamline attendance, manage assignments, and collect feedback all in one elegant platform.
          Built for modern education with a focus on simplicity and efficiency.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="card-cinematic">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-bold text-primary mb-2">Attendance</h3>
            <p className="text-sm text-gray-300">Track and manage student attendance with ease</p>
          </div>
          <div className="card-cinematic">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="text-lg font-bold text-primary mb-2">Assignments</h3>
            <p className="text-sm text-gray-300">Create and manage assignments effortlessly</p>
          </div>
          <div className="card-cinematic">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-lg font-bold text-primary mb-2">Feedback</h3>
            <p className="text-sm text-gray-300">Collect and respond to student feedback</p>
          </div>
        </div>

        {/* Login Button */}
        <a href={getLoginUrl()}>
          <Button className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            Sign In with Manus
          </Button>
        </a>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-12">
          Secure authentication powered by Manus OAuth
        </p>
      </div>
    </div>
  );
}
