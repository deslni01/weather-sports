async function getWeatherByCity(city) {
	const response = await fetch(
		`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=463eb7e5d0258362c22d75c2d2b53e4f&units=imperial`
	);

	const data = await response.json();
	// console.log(data);
	// console.log(data.name);
	return data;
}

async function processCurrent(data) {
	const { weather, name, main, wind, coord, clouds, sys } = data;

	return {
		weather,
		name,
		main,
		wind,
		coord,
		clouds,
		sys,
	};
}

// Forecast information:
async function getWeatherByCoords(lat, lon) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}8&exclude=hourly,minutely&appid=463eb7e5d0258362c22d75c2d2b53e4f&units=imperial`
	);

	const data = await response.json();
	return data;
}

async function processForecast(data) {
	const { daily } = data;

	return {
		daily,
	};
}

// this works both as async and without - does it need it?
// note: this pulls as current local time, so for example 7am London will show as 12am MN on the page - should change to location time?
function formatDateToString(date) {
	const newDate = new Date(date * 1000);
	var dd = (newDate.getDate() < 10 ? '0' : '') + newDate.getDate();
	var MM =
		(newDate.getMonth() + 1 < 10 ? '0' : '') + (newDate.getMonth() + 1);
	var hh =
		// newDate.getHours() < 12 ? newDate.getHours() : newDate.getHours() - 12;
		newDate.getHours();
	hh = hh % 12;
	hh = hh ? hh : 12;

	var mm = (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes();

	return {
		dd,
		MM,
		hh,
		mm,
	};
}

async function currentWeatherDOM(city) {
	const data = await getWeatherByCity(`${city}`);
	const currentData = await processCurrent(data);

	const currentCity = document.querySelector('#city-name');
	const today = document.querySelector('.today');
	const desc = today.querySelector('#today-desc');
	const current = today.querySelector('#today-current');
	const feel = today.querySelector('#today-feel');
	const high = today.querySelector('#today-high');
	const wind = today.querySelector('#today-wind');
	const sunrise = today.querySelector('#today-sunrise');
	const sunset = today.querySelector('#today-sunset');

	currentCity.innerText = `${city}`;
	desc.innerText = `${currentData.weather[0].main}`;
	current.innerText = `Current: ${currentData.main.temp}°`;
	feel.innerText = `Feels Like: ${currentData.main.feels_like}°`;
	high.innerText = `High/Low: ${currentData.main.temp_max}° / ${currentData.main.temp_min}°`;
	wind.innerText = `Wind: ${currentData.wind.speed} MPH`;
	const sunriseTime = formatDateToString(currentData.sys.sunrise);
	sunrise.innerText = `Sunrise: ${sunriseTime.hh}:${sunriseTime.mm} AM`;
	const sunsetTime = formatDateToString(currentData.sys.sunset);
	sunset.innerText = `Sunset: ${sunsetTime.hh}:${sunsetTime.mm} PM`;
}

async function forecastWeatherDOM(forecastData) {
	// const data = await getWeatherByCity('Minneapolis');
	// const currentData = await processCurrent(data);
	// const lat = currentData.coord.lat;
	// const lon = currentData.coord.lon;
	// const forecast = await getWeatherByCoords(lat, lon);
	// const forecastData = await processForecast(forecast);

	for (let i = 1; i < 5; i++) {
		const datePanel = document.querySelector(`.day-${i}`);
		const date = datePanel.querySelector(`#date-${i}`);
		const desc = datePanel.querySelector(`#desc-${i}`);
		const current = datePanel.querySelector(`#current-${i}`);
		const feel = datePanel.querySelector(`#feel-${i}`);
		const high = datePanel.querySelector(`#high-${i}`);
		const wind = datePanel.querySelector(`#wind-${i}`);
		const sunrise = datePanel.querySelector(`#sunrise-${i}`);
		const sunset = datePanel.querySelector(`#sunset-${i}`);

		const dateInfo = formatDateToString(forecastData.daily[i].dt);
		date.innerText = `${dateInfo.MM}/${dateInfo.dd}:`;
		desc.innerText = `${forecastData.daily[i].weather[0].main}`;
		current.innerText = `Temp: ${forecastData.daily[i].temp.day}°`;
		feel.innerText = `Feels Like: ${forecastData.daily[i].feels_like.day}°`;
		high.innerText = `High/Low: ${forecastData.daily[i].temp.max}° / ${forecastData.daily[i].temp.min}°`;
		wind.innerText = `Wind: ${forecastData.daily[i].wind_speed} MPH`;
		const sunriseTime = formatDateToString(forecastData.daily[i].sunrise);
		sunrise.innerText = `Sunrise: ${sunriseTime.hh}:${sunriseTime.mm} AM`;
		const sunsetTime = formatDateToString(forecastData.daily[i].sunset);
		sunset.innerText = `Sunset: ${sunsetTime.hh}:${sunsetTime.mm} PM`;
	}
}

async function app() {
	const data = await getWeatherByCity('London');
	const currentData = await processCurrent(data);
	const lat = currentData.coord.lat;
	const lon = currentData.coord.lon;

	// // console.log(lat);
	// // console.log(lon);

	const forecast = await getWeatherByCoords(lat, lon);
	// // console.log(forecast);
	const forecastData = await processForecast(forecast);

	const currentWeather = await currentWeatherDOM(currentData.name);
	// const forecastWeather = await forecastWeatherDOM(currentWeather);
	const forecastWeather = await forecastWeatherDOM(forecastData);
}

app();

// should make an outline of what needs to be done - each step, then go from there. not breaking this up right now, just trying isn't working

// 'one call api' must be called via latitude and longitude - so I think I need to fetch by city name, then return lat/lon, then do a call with ${lat} and ${lon} to get the correct forecast

// daily forecast API call to get lat/longitude to for 'one call api'

// return lat/lon, other current info

// API call for 'one call api' - lat/lon as parameters
// https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,minutely,current&appid=463eb7e5d0258362c22d75c2d2b53e4f&units=imperial

// this excludes hourly, minutely, and current

// start by getting things pulled, then console.log each day

// then can do dom manipulation

// search bar

/*
The timestamp/date comes in unix code: 1648063791
let unix_timestamp = 1648063791
let date = new Date(unix_timestamp * 1000)
will return "Wed Mar 23 2022 blahblahblah"

To get the day working:
date.getDate() // returns 23 - will this work with single digits?

date.getMonth() // returns 2 - need to get it to say 'Mar'
date.getMonth() + 1 to easily make it accurate, lmao

Can to make a function to format:
function formatDateToString(date) {
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
}
*/

// also maybe throw in wild/twins stuff

/*
Weather things:
- current api
    - name of city
    - lat/lon of city
    - 'main' - description
    - icon
    - main: temp
    - main: feels like
    - main: temp-min
    - main: temp-max
    - wind: speed
    - clouds: all %
    - sys: sunrise
    - sys: sunset

- forecast api
    - iterate over daily[i]
    - dt - date
    - sunrise
    - sunset
    - temp: day
    - temp: min
    - temp: max
    - feels_like: day
    - wind_speed
    - weather[i]: main/description
    - weather[i]: icon
    - weather: clouds
*/

// https://statsapi.web.nhl.com/api/v1/standings?expand=standings.record

// under overallRecords[3] is last 10 games
