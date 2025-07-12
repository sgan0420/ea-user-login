import { useWelcomeData } from "../hooks/useWelcomeData";
import LoadingScreen from "../components/welcome/LoadingScreen";
import BackgroundElements from "../components/welcome/BackgroundElements";
import UserInfo from "../components/welcome/UserInfo";
import WelcomeContent from "../components/welcome/WelcomeContent";
import AnimationEffects from "../components/welcome/AnimationEffects";
import "../styles/welcomePage.css";

export default function WelcomePage() {
  const {
    isVisible,
    currentTime,
    showAnimation,
    user,
    isLoading,
    handleTryMeClick,
    handleLogout,
  } = useWelcomeData();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="welcome-page">
      {/* Animated background elements */}
      <BackgroundElements />

      {/* User info and logout - positioned outside main content */}
      <UserInfo user={user} onLogout={handleLogout} />

      {/* Main content */}
      <WelcomeContent
        isVisible={isVisible}
        currentTime={currentTime}
        onTryMeClick={handleTryMeClick}
        onLogout={handleLogout}
      />

      {/* Fun animation elements */}
      <AnimationEffects showAnimation={showAnimation} />
    </div>
  );
}
