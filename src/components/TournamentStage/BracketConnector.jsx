function Line({ className = "", style = {} }) {
  return (
    <div
      className={`absolute bg-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.25)] ${className}`}
      style={style}
    />
  );
}

export default function BracketConnector({
  left,
  top,
  width = 0,
  height = 0,
  orientation = "horizontal",
}) {
  if (orientation === "horizontal") {
    return (
      <Line
        className="h-[2px]"
        style={{
          left,
          top,
          width,
        }}
      />
    );
  }

  return (
    <Line
      className="w-[2px]"
      style={{
        left,
        top,
        height,
      }}
    />
  );
}