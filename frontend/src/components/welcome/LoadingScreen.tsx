interface LoadingScreenProps {}

export default function LoadingScreen({}: LoadingScreenProps) {
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
