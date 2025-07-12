import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, ApiError, tokenManager } from "../services/authApi";

export const useWelcomeData = () => {
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

  return {
    isVisible,
    currentTime,
    showAnimation,
    user,
    isLoading,
    handleTryMeClick,
    handleLogout,
  };
};
