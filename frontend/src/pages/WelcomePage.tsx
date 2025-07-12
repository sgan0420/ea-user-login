import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, ApiError, tokenManager } from "../services/authApi";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAnimation, setShowAnimation] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!tokenManager.hasToken()) {
      navigate("/login", { replace: true });
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const result = await authApi.getUserData();
        setUser(result.user);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          // Token expired or invalid, redirect to login
          tokenManager.removeToken();
          navigate("/login", { replace: true });
          return;
        }
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, [navigate]);

  const handleTryMeClick = () => {
    setShowAnimation(true);
    // Reset animation after it completes
    setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
  };

  const handleLogout = () => {
    authApi.logout();
    navigate("/login", { replace: true });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d1b69 100%)",
          color: "#ffffff",
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d1b69 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        color: "#ffffff",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(64, 224, 208, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: "150px",
          height: "150px",
          background:
            "radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* User info and logout - positioned outside main content */}
      {user && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "15px",
            padding: "10px 20px",
            zIndex: 20,
          }}
        >
          <span style={{ color: "#a0a0b0", fontSize: "0.9rem" }}>
            {user.username} ({user.email})
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              color: "#ffffff",
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: "0.8rem",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          textAlign: "center",
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          opacity: isVisible ? 1 : 0,
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 10,
        }}
      >
        {/* Welcome heading */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            fontWeight: "700",
            background: "linear-gradient(45deg, #40e0d0, #8a2be2, #00ffff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          WELCOME
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            color: "#a0a0b0",
            marginBottom: "3rem",
            fontWeight: "300",
            letterSpacing: "0.05em",
          }}
        >
          Access Granted • System Online
        </p>

        {/* Time and date display */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            padding: "2rem",
            marginBottom: "3rem",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontFamily: "monospace",
              fontWeight: "bold",
              color: "#00ffff",
              marginBottom: "0.5rem",
            }}
          >
            {formatTime(currentTime)}
          </div>
          <div
            style={{
              fontSize: "1rem",
              color: "#40e0d0",
              fontWeight: "300",
            }}
          >
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleTryMeClick}
            style={{
              background: "linear-gradient(45deg, #40e0d0, #8a2be2)",
              border: "none",
              borderRadius: "50px",
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 32px rgba(64, 224, 208, 0.3)",
              minWidth: "150px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(64, 224, 208, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(64, 224, 208, 0.3)";
            }}
          >
            Try Me! 🎈
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50px",
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              minWidth: "150px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Logout
          </button>
        </div>

        {/* Status indicator */}
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            color: "#40e0d0",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#40e0d0",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}
          />
          System Status: Operational
        </div>
      </div>

      {/* Fun animation elements */}
      {showAnimation && (
        <>
          {/* Flying balloons */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${20 + i * 15}%`,
                bottom: "-100px",
                animation: `balloonFlyUp 2s ease-out forwards`,
                animationDelay: `${i * 0.2}s`,
                zIndex: 100,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "50px",
                  background: `linear-gradient(45deg, ${
                    ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"][i]
                  }, ${
                    ["#ff8e8e", "#6fcfc9", "#5bc2d4", "#a8d5b8", "#fdcb6e"][i]
                  })`,
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  position: "relative",
                  boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "25%",
                    left: "30%",
                    width: "10px",
                    height: "15px",
                    background: "rgba(255, 255, 255, 0.4)",
                    borderRadius: "50%",
                    transform: "rotate(-30deg)",
                  }}
                />
              </div>
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  background: "#666",
                  margin: "0 auto",
                }}
              />
            </div>
          ))}

          {/* Sparkle effects */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              style={{
                position: "absolute",
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                fontSize: "20px",
                animation: `sparkle 1.5s ease-out forwards`,
                animationDelay: `${i * 0.1}s`,
                zIndex: 50,
              }}
            >
              ✨
            </div>
          ))}
        </>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes balloonFlyUp {
          0% { 
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-300px) scale(1.2) rotate(10deg);
            opacity: 0.8;
          }
          100% { 
            transform: translateY(-600px) scale(0.5) rotate(20deg);
            opacity: 0;
          }
        }
        
        @keyframes sparkle {
          0% { 
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% { 
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
