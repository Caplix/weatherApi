const locations = [
    {
    label: "bergen",
    latitude: 60.39299,
    longitude: 5.32415
    },
    {
        label: "oslo",
        latitude: 59.91273,
        longitude: 10.74609
    },
    {
        label: "trondheim",
        latitude: 63.43049,
        longitude: 10.39506
    }
];

async function fetchApi(latitude, longitude) {
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&hours=24`;

  try {
    let res = await fetch(URL);

    if (res.ok) {
      let data = await res.json();

      if (data) {
        const currentWeather = data.current_weather;
        const temperature = currentWeather.temperature;
        const windDirection = currentWeather.winddirection;
        const windSpeed = currentWeather.windspeed;
        const hourlyWeather = data.hourly;
        const hourlyTemp = hourlyWeather.temperature_2m.slice(0, 25); // Limit to the next 24 hours
        console.log(data);
        
        displayContent(temperature, windDirection, windSpeed, hourlyTemp);
      } else {
        console.error("API response is empty or not valid JSON.");
      }
    } else {
      console.error("API request failed with status: " + res.status);
    }
  } catch (error) {
    console.error("An error occurred: ", error);
  }
}

locations.forEach(location => {
    const button = document.getElementById(location.label);
  
    if (button) {
      button.addEventListener("click", () => {
        fetchApi(location.latitude, location.longitude);
      });
    }
  });

  document.querySelector("#calculateWeather").addEventListener("click", () => {
    let x = document.getElementById("customLatitude").value;
    let y = document.getElementById("customLongitude").value;
    fetchApi(x, y);
  });

  async function displayContent(temperature, windDirection, windSpeed, hourlyTemp) {
    const contentDiv = document.querySelector("#weatherInfo");
    contentDiv.innerHTML = `
      <p>Temperature right now: ${temperature}°C</p>
      <p>Wind direction right now: ${windDirection}%</p>
      <p>Wind Speed right now: ${windSpeed} m/s</p>
    `;
  
    const hourlyDiv = document.querySelector("#hourlyTemp");
    hourlyDiv.innerHTML = `
      <canvas id="hourlyTempChart"></canvas>
    `;
  
    const ctx = document.getElementById("hourlyTempChart").getContext("2d");
  
    const timeLabels = [
      "00:00", "01:00", "02:00", "03:00",
      "04:00", "05:00", "06:00", "07:00",
      "08:00", "09:00", "10:00", "11:00",
      "12:00", "13:00", "14:00", "15:00",
      "16:00", "17:00", "18:00", "19:00",
      "20:00", "21:00", "22:00", "23:00"
    ];
    const data = {
      labels: timeLabels,
      datasets: [
        {
          label: "Hourly Temperature (°C)",
          data: hourlyTemp,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    };
  
    const config = {
      type: "line",
      data: data,
    };
  
    new Chart(ctx, config);
  }

  