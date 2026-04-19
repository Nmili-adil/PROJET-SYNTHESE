import { useEffect, useState } from "react";
import Logo2 from "../../../public/asset/logo2.jpeg";

const TextFillLoading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = 100;
    const duration = 2500;
    const interval = duration / steps;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); return 100; }
        return p + 1;
      });
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0a0718 0%, #100d24 60%, #0d0a1e 100%)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(85,37,130,0.25) 0%, transparent 70%)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with rotating ring */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full overflow-hidden"
            style={{ boxShadow: "0 0 0 3px #FDB927, 0 0 32px rgba(253,185,39,0.25)" }}
          >
            <img src={Logo2} alt="Lakers" className="w-full h-full object-cover" />
          </div>
          {/* Spinning ring */}
          <div
            className="absolute -inset-3 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#FDB927",
              borderRightColor: "rgba(253,185,39,0.25)",
              animation: "spin 1.4s linear infinite",
            }}
          />
          <div
            className="absolute -inset-5 rounded-full border border-transparent"
            style={{
              borderTopColor: "rgba(85,37,130,0.5)",
              borderLeftColor: "rgba(85,37,130,0.25)",
              animation: "spin 2.2s linear infinite reverse",
            }}
          />
        </div>

        {/* Brand text */}
        <div className="text-center space-y-1">
          <h1
            className="text-white font-bold text-2xl"
            style={{ letterSpacing: "0.28em" }}
          >
            KINETIC COURT
          </h1>
          <p
            className="font-semibold"
            style={{ color: "#FDB927", fontSize: "10px", letterSpacing: "0.35em" }}
          >
            ADMIN PANEL
          </p>
        </div>

        {/* Progress */}
        <div className="w-60 space-y-2.5">
          <div
            className="w-full h-[3px] rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-75 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #552582, #9B59B6, #FDB927)",
                boxShadow: "0 0 8px rgba(253,185,39,0.4)",
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {progress < 40 ? "Authenticating..." : progress < 80 ? "Loading resources..." : "Almost ready..."}
            </span>
            <span className="text-xs font-mono font-semibold" style={{ color: "#FDB927" }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextFillLoading;
