let latestLocation = ""; // Store the most recent location

async function getData(location, unit) {
  let res = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=KJNU5XGYMGYNMLDP4V4M2BJD8&contentType=json`
  );
  let data = await res.json();

  return {
    city: data.address,
    temp: data.days[0].temp,
    condition: data.days[0].conditions,
    icon: data.days[0].icon,
  };
}

let submitBtn = document.getElementById("submit");
let city = document.querySelector(".city");
let temp = document.querySelector(".temp");
let condition = document.querySelector(".condition");
let icon = document.querySelector(".icon");
let unitToggle = document.querySelector("#unit-toggle");
let loading = document.querySelector(".loading");

loading.style.display = "none";

async function updateWeather(location) {
  if (!location) return;

  let unit = unitToggle.checked ? "us" : "metric";
  loading.style.display = "block"; // Show while loading

  try {
    let data = await getData(location, unit);
    city.textContent = data.city;
    temp.textContent = `${data.temp}° ${unit === "us" ? "F" : "C"}`;
    condition.textContent = data.condition;
    icon.innerHTML = `<img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${data.icon}.png" alt="${data.icon}" width="64" height="64">`;

    const cond = data.condition.toLowerCase();
    if (cond.includes("clear")) {
      document.body.style.background = "#fef9c3";
    } else if (cond.includes("cloud")) {
      document.body.style.background = "#d3d3d3";
    } else if (cond.includes("rain") || cond.includes("shower")) {
      document.body.style.background = "#a0aec0";
    } else if (cond.includes("snow")) {
      document.body.style.background = "#ffffff";
    } else if (cond.includes("fog") || cond.includes("mist")) {
      document.body.style.background = "#cbd5e0";
    } else if (cond.includes("thunder")) {
      document.body.style.background = "#718096";
    } else {
      document.body.style.background = "#f0f0f0";
    }
  } catch (error) {
    city.textContent = "City not found!";
    temp.textContent = "";
    condition.textContent = "";
    icon.innerHTML = "";
    document.body.style.background = "#f0f0f0";
  } finally {
    loading.style.display = "none";
  }
}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  latestLocation = document.getElementById("location").value;
  await updateWeather(latestLocation);
});

unitToggle.addEventListener("change", async () => {
  await updateWeather(latestLocation);
});
