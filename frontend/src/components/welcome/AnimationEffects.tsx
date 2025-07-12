interface AnimationEffectsProps {
  showAnimation: boolean;
}

export default function AnimationEffects({ showAnimation }: AnimationEffectsProps) {
  if (!showAnimation) return null;

  return (
    <>
      {/* Flying balloons */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="balloon-fly-up"
          style={{
            position: "absolute",
            left: `${20 + i * 15}%`,
            bottom: "-100px",
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
          className="sparkle-animation"
          style={{
            position: "absolute",
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            fontSize: "20px",
            animationDelay: `${i * 0.1}s`,
            zIndex: 50,
          }}
        >
          ✨
        </div>
      ))}
    </>
  );
}
