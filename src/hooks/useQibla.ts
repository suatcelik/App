import { useState, useEffect, useRef } from "react";
import { Magnetometer } from "expo-sensors";

interface UseQiblaResult {
  heading: number;
  available: boolean;
}

export function useQibla(): UseQiblaResult {
  const [heading, setHeading] = useState(0);
  const [available, setAvailable] = useState(false);
  const subscription = useRef<ReturnType<typeof Magnetometer.addListener> | null>(null);

  useEffect(() => {
    Magnetometer.isAvailableAsync().then((isAvailable) => {
      setAvailable(isAvailable);
      if (!isAvailable) return;

      Magnetometer.setUpdateInterval(100);
      subscription.current = Magnetometer.addListener(({ x, y }) => {
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        setHeading(angle);
      });
    });

    return () => {
      subscription.current?.remove();
    };
  }, []);

  return { heading, available };
}
