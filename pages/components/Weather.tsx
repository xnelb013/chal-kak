import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { seasonState, weatherState } from "@/utils/atoms";

// 날씨 데이터의 인터페이스를 정의
interface WeatherData {
  success: boolean;
  message: string;
  curTemperature: number;
  weatherCode: number;
}

const Weather = () => {
  // 저장할 날씨 데이터와 그를 설정하는 함수를 useState를 이용하여 생성
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Recoil 상태를 설정하는 함수를 생성
  // const setSeason = useSetRecoilState(seasonState);
  // const setWeather = useSetRecoilState(weatherState);
  const [season, setSeason] = useRecoilState(seasonState);
  const [weather, setWeather] = useRecoilState(weatherState);

  // 실시간 위치 허용하여 날씨 출력
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.post<WeatherData>("http://localhost:3000/weather", {
            lat: latitude,
            lon: longitude,
          });
          setWeatherData(response.data);
        } catch (error) {
          console.error("날씨 정보 실패", error);
        }
      },
      async (error) => {
        console.error("위치 정보 실패", error);

        // {
        //   "latitude": 35.1,
        //   "longitude": 129.0,
        //   "generationtime_ms": 1.0439157485961914,
        //   "utc_offset_seconds": 32400,
        //   "timezone": "Asia/Seoul",
        //   "timezone_abbreviation": "KST",
        //   "elevation": 16.0,
        //   "current_weather": {
        //     "temperature": 28.8,
        //     "windspeed": 15.0,
        //     "winddirection": 107,
        //     "weathercode": 0,
        //     "is_day": 1,
        //     "time": "2023-08-26T13:00"
        //   }
        // }

        // 위치 거부 시 기본값 서울 날씨 정보 출력
        try {
          const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=37.566&longitude=126.9784&current_weather=true&timezone=auto`,
          );
          setWeatherData({
            success: true,
            message: "날씨 불러오기",
            curTemperature: response.data.current_weather.temperature,
            weatherCode: response.data.current_weather.weathercode,
          });
        } catch (error) {
          console.error("날씨 정보 실패함", error);
        }
      },
    );
  }, []);

  const currentMonth = new Date().getMonth();
  let seasonKeywords;

  if (currentMonth >= 2 && currentMonth <= 4) {
    seasonKeywords = "봄";
  } else if (currentMonth >= 5 && currentMonth <= 8) {
    seasonKeywords = "여름";
  } else if (currentMonth >= 9 && currentMonth <= 10) {
    seasonKeywords = "가을";
  } else {
    seasonKeywords = "겨울";
  }

  // 산출된 계절 키워드를 Recoil 상태로 설정
  setSeason(seasonKeywords);
  console.log(season);
  // API Weather Code로 날씨 세팅
  let weatherKeywords;

  if (weatherData && [0, 1, 2].includes(weatherData.weatherCode)) {
    weatherKeywords = "맑음";
  } else if (weatherData && [3, 45, 48].includes(weatherData.weatherCode)) {
    weatherKeywords = "흐림";
  } else if (
    weatherData &&
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 80, 81, 82, 95, 96, 99].includes(weatherData.weatherCode)
  ) {
    weatherKeywords = "비";
  } else if (weatherData && [77, 85, 86].includes(weatherData.weatherCode)) {
    weatherKeywords = "눈";
  }

  // 산출한 날씨 키워드를 Recoil 상태로 설정
  setWeather(weatherKeywords || "알 수 없음");
  console.log(weather);

  if (!weatherData) return <div>Loading...</div>; // weather data가 없을 때 처리

  // Weather Code를 기반으로 아이콘 출력
  let weatherIcon;

  if ([0, 1, 2].includes(weatherData.weatherCode)) {
    weatherIcon = "☀️";
  } else if ([3, 45, 48].includes(weatherData.weatherCode)) {
    weatherIcon = "☁️";
  } else if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 80, 81, 82, 95, 96, 99].includes(weatherData.weatherCode)
  ) {
    weatherIcon = "☔️";
  } else if ([77, 85, 86].includes(weatherData.weatherCode)) {
    weatherIcon = "☃️";
  }
  return <div>{`현재 날씨 ${weatherIcon} ${Math.floor(weatherData.curTemperature)}`}℃</div>;
};

export default Weather;