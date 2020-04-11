const tempCard = document.getElementById('tempCard');
const descCard = document.getElementById('descCard');
const windCard = document.getElementById('windCard');
const humidityCard = document.getElementById('humidityCard');

const cityInput = document.getElementById('cityInput');
const errorMessage = document.getElementById('errorMessage');

function update(weather) {
    tempCard.textContent = `${weather.temperature} ℃`;
    descCard.textContent = weather.description;
    windCard.textContent = `${weather.wind} m/s`;
    humidityCard.textContent = `${weather.humidity} %`;
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('error-message_hide');
}

function sendPostRequest(url, body) {
    headers = {
        'Content-Type': 'application/json'
    }    

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    }).then(response => {
        if (response.ok) {
            return response.json();
        }

        return response.json().then(error => {
            throw new Error(error.error);
        });
    });
}

document.getElementById('submit').addEventListener('click', function (event) {
    errorMessage.classList.add('error-message_hide');
    const value = cityInput.value.trim()

    if(!value) {
        cityInput.value = '';
        return;
    }

    event.preventDefault();

    let data = {
        'city': value
    };

    sendPostRequest('/', data)
        .then(response => update(response.weather))
        .catch(err => displayError(err.message));
});