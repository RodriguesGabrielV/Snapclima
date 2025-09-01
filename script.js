// --- Seleção dos Elementos do DOM ---
const citySearchInput = document.getElementById("city-search-input");
const citySearchButton = document.getElementById("city-search-button");

const currentDate = document.getElementById("current-date");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");
const currentTemperature = document.getElementById("current-temperature");
const windSpeed = document.getElementById("wind-speed");
const feelsLikeTemperature = document.getElementById("feels-like-temperature");
const currentHumidity = document.getElementById("current-humidity");
const sunriseTime = document.getElementById("sunrise-time");
const sunsetTime = document.getElementById("sunset-time");

// ATENÇÃO: É uma má prática de segurança expor a chave da API diretamente no código.
// Para projetos pessoais está ok, mas evite subir para repositórios públicos como o GitHub.
const apiKey = "4533128f2a3437a8772327b22574405c";


// --- Event Listeners ---
citySearchButton.addEventListener("click", () => {
    let city = citySearchInput.value;
    getCityWeather(city);
});

// Adiciona a funcionalidade de busca ao pressionar "Enter"
citySearchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        let city = citySearchInput.value;
        getCityWeather(city);
    }
});


// --- Funções ---

// Obter clima pela geolocalização do navegador
navigator.geolocation.getCurrentPosition(
    (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getCurrentLocationWeather(lat, lon);
    },
    (err) => {
        if (err.code === 1) {
            alert("Geolocalização negada pelo usuário. Busque manualmente por uma cidade através da barra de pesquisa.");
        } else {
            console.error(err);
        }
    }
);

function getCurrentLocationWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => displayWeather(data))
        .catch((error) => console.error("Erro ao buscar clima por localização:", error));
}

function getCityWeather(cityName) {
    // CORREÇÃO 2: Caminho do ícone relativo para consistência
    weatherIcon.src = `./assets/loading-icon.svg`;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${apiKey}`)
        .then((response) => {
            // CORREÇÃO 1: Tratamento de erros da API
            if (!response.ok) {
                throw new Error(`Cidade não encontrada (${response.status}). Verifique o nome e tente novamente.`);
            }
            return response.json();
        })
        .then((data) => displayWeather(data))
        .catch((error) => {
            // CORREÇÃO 1: Exibe o alerta de erro para o usuário
            alert(error.message);
            console.error("Erro ao buscar clima da cidade:", error);
        });
}

function displayWeather(data) {
    // Desestruturação dos dados da API
    let {
        dt,
        name,
        weather: [{ icon, description }],
        main: { temp, feels_like, humidity },
        wind: { speed },
        sys: { sunrise, sunset },
    } = data;

    // Atualiza o DOM com as informações
    currentDate.textContent = formatDate(dt);
    cityName.textContent = name;
    weatherIcon.src = `./assets/${icon}.svg`;
    weatherDescription.textContent = description;
    currentTemperature.textContent = `${Math.round(temp)}ºC`;
    windSpeed.textContent = `${Math.round(speed * 3.6)} km/h`; // Convertendo m/s para km/h
    feelsLikeTemperature.textContent = `${Math.round(feels_like)}ºC`;
    currentHumidity.textContent = `${humidity}%`;
    sunriseTime.textContent = formatTime(sunrise);
    sunsetTime.textContent = formatTime(sunset);
}

function formatDate(epochTime) {
    let date = new Date(epochTime * 1000);
    let formattedDate = date.toLocaleDateString('pt-BR', { month: "long", day: 'numeric' });
    return `Hoje, ${formattedDate}`;
}

function formatTime(epochTime) {
    let date = new Date(epochTime * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    // CORREÇÃO 3: Adiciona zero à esquerda se os minutos forem menores que 10
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${hours}:${formattedMinutes}`;
}
