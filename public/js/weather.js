// Your OpenWeatherMap API key
const apiKey = 'a95b18926cf1e5f5d2927578a2b55215';

// Coordinates for your restaurant's location
const lat = '37.7749';  // Example latitude for San Francisco
const lon = '-122.4194'; // Example longitude for San Francisco


// URL to fetch weather data
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

// Fetch weather data and display it
fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        const weatherDiv = document.getElementById('weather');
        if (weatherDiv) {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            weatherDiv.innerHTML = `Temperature: ${temperature}°C <br> Weather: ${description}`;
        } else {
            console.error('Weather div not found');
        }
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        const weatherDiv = document.getElementById('weather');
        if (weatherDiv) {
            weatherDiv.innerText = 'Error loading weather data';
        }
    });




fetch(weatherUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const weatherDiv = document.getElementById('weather');
        if (weatherDiv) {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            weatherDiv.innerHTML = `Temperature: ${temperature}°C <br> Weather: ${description}`;
        } else {
            console.error('Weather div not found');
        }
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        const weatherDiv = document.getElementById('weather');
        if (weatherDiv) {
            weatherDiv.innerText = 'Error loading weather data';
        }
    });
