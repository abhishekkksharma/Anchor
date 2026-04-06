const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('src/config/config.env'));
const apiKey = envConfig.NEWS_API_KEY;

if (!apiKey) {
    console.error("No API Key found in config.env");
    process.exit(1);
}

const url = `https://newsapi.org/v2/everything?q=tech&apiKey=${apiKey}`;

fetch(url)
    .then(res => {
        console.log("Status:", res.status);
        return res.json();
    })
    .then(data => {
        if (data.status === 'error') {
            console.error("API Error:", data.message);
        } else {
            console.log("API Success. Articles fetched:", data.articles.length);
        }
    })
    .catch(err => console.error("Fetch error:", err));
