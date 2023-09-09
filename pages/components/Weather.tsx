import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { seasonState, weatherState } from "@/utils/atoms";

// const local = "http://ec2-13-127-154-248.ap-south-1.compute.amazonaws.com:8080";
const vercel = "https://www.chla-kak-back.store";

// 날씨 데이터의 인터페이스를 정의
interface WeatherData {
  success: boolean;
  message: string;
  data: {
    date: string;
    weather: string;
    icon: string;
    temperature: number;
  };
}

const Weather = () => {
  // 저장할 날씨 데이터와 그를 설정하는 함수를 useState를 이용하여 생성
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Recoil 상태를 설정하는 함수를 생성
  const [, setSeason] = useRecoilState(seasonState);
  const [weather, setWeather] = useRecoilState(weatherState);

  // 실시간 위치 허용하여 날씨 출력
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get<WeatherData>(`${vercel}/weather?lat=${latitude}&lon=${longitude}`);
          setWeatherData(response.data);
        } catch (error) {
          console.error("날씨 정보 실패", error);
        }
      },
      async (error) => {
        console.error("위치 정보 실패", error);

        // 위치 거부 시 기본값 서울 날씨 정보 출력
        try {
          const response = await axios.get<WeatherData>(`${vercel}/weather?lat=37.5665&lon=126.9784`);
          setWeatherData(response.data);
        } catch (error) {
          console.error("날씨 정보 실패함", error);
        }
      },
    );
  }, []);

  useEffect(() => {
    if (weatherData) {
      let seasonKeywords;

      const currentMonth = new Date().getMonth();
      if (currentMonth >= 2 && currentMonth <= 4) {
        seasonKeywords = "봄";
      } else if (currentMonth >= 5 && currentMonth <= 8) {
        seasonKeywords = "여름";
      } else if (currentMonth >= 9 && currentMonth <= 10) {
        seasonKeywords = "가을";
      } else {
        seasonKeywords = "겨울";
      }

      setSeason(seasonKeywords);
    }
  }, [weatherData]);

  useEffect(() => {
    if (weatherData) {
      let weatherIcon;

      switch (weatherData?.data.icon) {
        case "01d":
        case "01n":
          weatherIcon = "☀️";
          break;
        case "02d":
        case "02n":
          weatherIcon = "⛅";
          break;
        case "03d":
        case "03n":
          weatherIcon = "☁️";
          break;
        case "04d":
        case "04n":
          weatherIcon = "🌥️";
          break;
        case "09d":
        case "09n":
          weatherIcon = "🌧️";
          break;
        case "10d":
        case "10n":
          weatherIcon = "🌧️";
          break;
        case "11d":
        case "11n":
          weatherIcon = "🌩️";
          break;
        case "13d":
        case "13n":
          weatherIcon = "☃️";
          break;
        default:
          weatherIcon = "";
      }
      setWeather(weatherIcon || "알 수 없음");
      console.log(weather);
    }
  }, [weatherData]);

  if (!weatherData) return <div>Loading...</div>; // 날씨 데이터가 없을 때 처리

  return <div>{`현재 날씨 ${weather} ${Math.floor(weatherData?.data.temperature - 273.15)}`}℃</div>;
};

export default Weather;
