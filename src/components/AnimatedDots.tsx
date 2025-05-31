import { useEffect, useState } from "react";

export const AnimatedDots = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < 3 ? prev + 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span>{".".repeat(dots)}</span>;
};
