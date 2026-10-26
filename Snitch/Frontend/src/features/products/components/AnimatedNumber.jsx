import { useEffect, useRef } from "react";
import { animate } from "animejs";

/**
 * AnimatedNumber component powered by animejs
 * Smoothly interpolates numeric values with luxury spring / expo damping (animos style)
 */
export default function AnimatedNumber({ value = 0, prefix = "", suffix = "", duration = 1100 }) {
  const spanRef = useRef(null);
  const valRef = useRef(0);

  useEffect(() => {
    const targetVal = Number(value) || 0;
    const animObj = { current: valRef.current };

    const anim = animate(animObj, {
      current: targetVal,
      duration: duration,
      ease: "outExpo",
      onUpdate: () => {
        if (spanRef.current) {
          const formatted = Math.round(animObj.current).toLocaleString();
          spanRef.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      },
    });

    valRef.current = targetVal;

    return () => {
      if (anim && typeof anim.pause === "function") {
        anim.pause();
      }
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={spanRef}>
      {prefix}
      {Number(value || 0).toLocaleString()}
      {suffix}
    </span>
  );
}
