import playList from '../playList.js';

const audio = new Audio();

let num;
let playNum = 0;
let isPlay = false;

window.onload = () => {
    // Time, Date and Greeting
    showTime();

    // Background Slider
    addSlider();

    // Weather Forecast
    addWeather();

    // Quotes of the Day
    addQuotes();

    // Audio Player
    addAudio();
}

const showTime = () => {
    const time = document.querySelector('.time');
    const date = new Date();

    time.textContent = date.toLocaleTimeString();
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}

const showDate = () => {
    const currentDate = document.querySelector('.date');
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' };

    currentDate.textContent = date.toLocaleDateString('en-US', options);
}


const showGreeting = () => {
    const hello = document.querySelector('.greeting');
    const timeOfDay = getTimeOfDay();

    hello.textContent = `Good ${timeOfDay}, `;
}

const getTimeOfDay = () => {
    const date = new Date();
    const hours = date.getHours();
    return hours < 18 ? hours < 12 ? hours < 6 ? 'night' : 'morning' : 'afternoon' : 'evening';
}

const setLocalStorage = () => {
    const name = document.querySelector('.name');
    const city = document.querySelector('.city');

    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage);

const getLocalStorage = () => {
    let name = document.querySelector('.name');
    let city = document.querySelector('.city');

    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
        getWeather();
    }
}
window.addEventListener('load', getLocalStorage);

const getRandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const setBg = () => {
    const timeOfDay = getTimeOfDay();
    const bgNum = num > 10 ? num : num.toString().padStart(2, '0');
    const body = document.querySelector('body');
    const img = new Image();

    img.src = `https://raw.githubusercontent.com/lunarEclipse423/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {      
      body.style.backgroundImage = `url('${img.src}')`;
    };
}

const getSlideNext = () => {
    num = num === 20 ? 1 : num += 1;
    setBg();
}

const getSlidePrev = () => {
    num = num === 1 ? 20 : num -= 1;
    setBg();
}

const addSlider = () => {
    const slideNext = document.querySelector('.slide-next');
    const slidePrev = document.querySelector('.slide-prev');

    num = getRandomNum(1, 21);
    setBg();
    slideNext.addEventListener('click', getSlideNext);
    slidePrev.addEventListener('click', getSlidePrev);
};

const getWeather = async () => {
    const city = document.querySelector('.city');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=8e4775bf4186183822b834b4218694e4&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 

    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const windSpeed = document.querySelector('.wind-speed');
    const humidity = document.querySelector('.humidity');

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    windSpeed.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
}

const addWeather = () => {
    const city = document.querySelector('.city');
    city.addEventListener('change', getWeather);
}

const getQuotes = async () => {  
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json(); 
    const randomNum = getRandomNum(0, data.length);
    const quote = document.querySelector('.quote');
    const author = document.querySelector('.author');

    quote.textContent = data[randomNum].quoteText;
    author.textContent = data[randomNum].quoteAuthor;
}

const addQuotes = () => {
    const refresh = document.querySelector('.change-quote');
    
    getQuotes();
    refresh.addEventListener('click', getQuotes);
}

const playAudio = () => {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;

    if (!isPlay) {
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }  
}

const toggleAudioBtn = () => {
    const play = document.querySelector('.play');
    if (!isPlay) {
        play.classList.remove('pause');
    } else {
        play.classList.add('pause');
    }
}

const playNext = () => {
    playAudio();
    playNum = playNum === playList.length - 1 ? 0 : playNum += 1;
    playAudio();
}

const playPrev = () => {
    playAudio();
    playNum = playNum === 0 ? playList.length - 1 : playNum -= 1;
    playAudio();
}

const createPlayList = () => {
    const playListContainer = document.querySelector('.play-list');
    playList.forEach(el => {
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.textContent = el.title;
        playListContainer.append(li);
    });
}

const addAudio = () => {
    const play = document.querySelector('.play');
    const playNextBtn = document.querySelector('.play-next');
    const playPrevBtn = document.querySelector('.play-prev');

    createPlayList();
    play.addEventListener('click', playAudio);
    play.addEventListener('click', toggleAudioBtn);
    playNextBtn.addEventListener('click', playNext);
    playPrevBtn.addEventListener('click', playPrev);
}