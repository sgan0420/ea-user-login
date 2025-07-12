interface BackgroundElementsProps {}

export default function BackgroundElements({}: BackgroundElementsProps) {
  return (
    <>
      {/* Animated background elements */}
      <div
        className="float-animation"
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(64, 224, 208, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div
        className="float-animation-reverse"
        style={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: "150px",
          height: "150px",
          background:
            "radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </>
  );
}
