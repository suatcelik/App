import { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Qibla,
} from "adhan";
import { PrayerTimesData, LocationData } from "../types";

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimesData | null;
  location: LocationData | null;
  qiblaDirection: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePrayerTimes(): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchTimes() {
      setLoading(true);
      setError(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Konum izni verilmedi. Lütfen ayarlardan izin verin.");
          setLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) return;

        const { latitude, longitude } = pos.coords;

        let city: string | undefined;
        try {
          const [geo] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          city = geo?.city || geo?.region || undefined;
        } catch {
          // ignore geocode errors
        }

        setLocation({ latitude, longitude, city });

        const coords = new Coordinates(latitude, longitude);
        const params = CalculationMethod.Turkey();
        const date = new Date();
        const times = new PrayerTimes(coords, date, params);

        const qibla = Qibla(coords);
        setQiblaDirection(qibla);

        setPrayerTimes({
          fajr: times.fajr,
          sunrise: times.sunrise,
          dhuhr: times.dhuhr,
          asr: times.asr,
          maghrib: times.maghrib,
          isha: times.isha,
          date,
        });
      } catch (err) {
        if (!cancelled) {
          setError("Namaz vakitleri alınamadı.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTimes();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return {
    prayerTimes,
    location,
    qiblaDirection,
    loading,
    error,
    refresh: () => setRefreshKey((k) => k + 1),
  };
}
