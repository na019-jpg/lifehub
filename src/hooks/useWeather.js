import { useState, useEffect } from 'react';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 정보를 지원하지 않는 브라우저입니다.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation&timezone=auto`;
          const res = await fetch(weatherUrl);
          if (!res.ok) throw new Error("날씨 정보를 가져오는데 실패했습니다.");
          
          const data = await res.json();
          
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            apparentTemp: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            precipitation: data.current.precipitation
          });
        } catch (err) {
          setError('날씨 데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn("Location permission denied or failed.");
        setLocationDenied(true);
        setLoading(false);
      }
    );
  }, []);

  return { weather, loading, error, locationDenied };
}
