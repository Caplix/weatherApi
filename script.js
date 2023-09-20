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
  
    const labels = hourlyTemp.map((_, index) => `Hour ${index}`);
    const data = {
      labels: labels,
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

  