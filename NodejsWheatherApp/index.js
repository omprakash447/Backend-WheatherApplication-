const express = require("express");
const server = express();
const path = require("path");
const hbs = require("hbs");
const requests = require("requests");

// Set paths for public directory, views, and partials
const dirname = path.join(__dirname, "../NodejsWheatherApp/public");
const pathviews = path.join(__dirname, "../NodejsWheatherApp/views/views");
const pathpartials = path.join(__dirname, "../NodejsWheatherApp/views/partials");

// Register partials for reusing parts of the view
hbs.registerPartials(pathpartials);

// Set view engine and directories
server.set("views", pathviews);
server.set("view engine", "hbs");

// Home route renders the main index page
server.get("/", (req, res) => {
    res.render("index.hbs");
});

// Forecast route renders the forecast page
server.get("/forcast", (req, res) => {
    res.render("forcast.hbs");
});

// Weather API route to fetch data based on the city
server.get("/about", (req, res) => {
    const cityName = req.query.name; // Get city name from query string
    const apiKey = "349477084d53cb0f63513f22dfa5dedc"; // OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

    // Make API request to OpenWeather
    requests(url)
        .on("data", (chunk) => {
            const convertobj = JSON.parse(chunk); // Parse the API response

            // Check if the response contains valid data
            if (convertobj.cod === 200) {
                const weatherData = {
                    name: convertobj.name,
                    temp: convertobj.main.temp,
                    humidity: convertobj.main.humidity,
                    wind: convertobj.wind.speed,
                };
                res.send(weatherData); // Send parsed weather data
            } else {
                // Send an error message if city not found
                res.status(404).send({ error: "City not found." });
            }
        })
        .on("error", (err) => {
            console.error("Error fetching weather data:", err);
            res.status(500).send({ error: "Failed to retrieve weather data." });
        });
});
// about page

server.get("/aboutwheather", (req, res) => {
    res.render("aboutwheather");
});
// Start the server on port 2000
server.listen(2000, () => {
    console.log("Connected to server on port 2000...");
});