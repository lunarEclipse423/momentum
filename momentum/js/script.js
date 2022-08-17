import playList from '../playList.js';

const audio = new Audio();

let num;
let playNum = 0;
let isPlay = false;
let isPlayListShown = false;
let lang = 'en';

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

    // Translation
    addTranslation();
}

const showTime = () => {
    const time = document.querySelector('.time');
    const date = new Date();

    time.textContent = date.toLocaleTimeString('ru-RU');
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}

const showDate = () => {
    const currentDate = document.querySelector('.date');
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' };
    const dateLang = lang === 'en' ? 'en-US' : 'ru-RU';

    currentDate.textContent = date.toLocaleDateString(dateLang, options);
}

const showGreeting = () => {
    const hello = document.querySelector('.greeting');
    const timeOfDay = getTimeOfDay();
    const greetingTranslation = {
        en: `Good ${timeOfDay}, `,
        ru: `${translateGreetingToRus(timeOfDay)} ${timeOfDay}, `
    };

    hello.textContent = lang === 'en' ? greetingTranslation.en : greetingTranslation.ru;
}

const getTimeOfDay = () => {
    const date = new Date();
    const hours = date.getHours();
    let timeOfDay = '';

    if (lang === 'en') {
        timeOfDay = hours < 18 ? hours < 12 ? hours < 6 ? 'night' : 'morning' : 'afternoon' : 'evening';
    } else {
        timeOfDay = hours < 18 ? hours < 12 ? hours < 6 ? 'ночи' : 'утро' : 'день' : 'вечер';
    }
    return timeOfDay;
}

const translateGreetingToRus = (time) => {
    if (lang === 'ru') {
        switch (time) {
            case 'утро':
                return 'Доброе';
            case 'ночи':
                return 'Доброй';
            default:
                return 'Добрый';
        }
    }
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
    } else {
        city.value = 'Minsk';
    }
    getWeather();
}
window.addEventListener('load', getLocalStorage);

const getRandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const setBg = () => {
    let timeOfDay = '';
    if(lang !== 'en') {
        lang = 'en';
        timeOfDay = getTimeOfDay();
        lang = 'ru';
    } else {
        timeOfDay = getTimeOfDay();
    }
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
    if (city.value === '' ||  !/^[a-zA-Zа-яА-ЯёЁ]+$/.test(city.value)) {
        generateWeatherError(lang);
        return;
    } else {
        const error = document.querySelector('.weather-error');
        error.classList.remove('error');
        error.textContent = '';
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=8e4775bf4186183822b834b4218694e4&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 

    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const windSpeed = document.querySelector('.wind-speed');
    const humidity = document.querySelector('.humidity');

    const windSpeedText = lang === 'en' ? 'Wind speed' : 'Скорость ветра';
    const windSpeedUnits = lang === 'en' ? 'm/s' : 'м/с';
    const humidityText = lang === 'en' ? 'Humidity' : 'Влажность';

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    windSpeed.textContent = `${windSpeedText}: ${Math.floor(data.wind.speed)} ${windSpeedUnits}`;
    humidity.textContent = `${humidityText}: ${data.main.humidity}%`;
}

const generateWeatherError = (lang = 'en') => {
    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const windSpeed = document.querySelector('.wind-speed');
    const humidity = document.querySelector('.humidity');

    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    windSpeed.textContent = '';
    humidity.textContent = '';

    const error = document.querySelector('.weather-error');
    error.classList.add('error');
    error.textContent = lang === 'en' ? 'Error: invalid city value. Try again' : 'Ошибка: невалидное значение для города. Попробуйте еще раз';
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

    quote.textContent = lang === 'en' ? data[randomNum].quoteTextEn : data[randomNum].quoteTextRu;
    author.textContent = lang === 'en' ? data[randomNum].quoteAuthorEn : data[randomNum].quoteAuthorRu;
}

const addQuotes = () => {
    const refresh = document.querySelector('.change-quote');
    
    getQuotes();
    refresh.addEventListener('click', getQuotes);
}

const loadAudio = () => {
    const name = document.querySelector('.song-name');
    const artist = document.querySelector('.artist');

    name.innerText = playList[playNum].title;
    // artist.innerText = playList[playNum].artist;
    audio.src = playList[playNum].src;
    audio.load();
}

const playAudio = () => {
    if (!isPlay) {
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }  
}

const loadClickedAudio = (e) => {
    let oldPlayNum = playNum;
    const playBtns = document.querySelectorAll('.small-play');

    for (let i = 0; i < playList.length; i++) {
        if(playBtns[i] == e.target) {
            playNum = i;
            break;
        }
    }
    
    if(oldPlayNum === playNum) {
        playAudio();
    } else {
        isPlay = false;
        loadAudio();
        playAudio();
    }
}

const toggleAudioBtn = () => {
    const play = document.querySelectorAll('.play');
    if (!isPlay) {
        play[0].classList.remove('pause');
        play[playNum + 1].classList.remove('pause');
    } else {
        play.forEach(el => el.classList.remove('pause'));
        play[0].classList.add('pause');
        play[playNum + 1].classList.add('pause');
    }
}

const playNext = () => {
    const play = document.querySelectorAll('.play');

    play[playNum + 1].classList.remove('pause');
    playNum = playNum === playList.length - 1 ? 0 : playNum += 1;
    isPlay = false;
    loadAudio();
    playAudio();
}

const playPrev = () => {
    const play = document.querySelectorAll('.play');

    play[playNum + 1].classList.remove('pause');
    playNum = playNum === 0 ? playList.length - 1 : playNum -= 1;
    isPlay = false;
    loadAudio();
    playAudio();
}

const createPlayList = () => {
    const playListContainer = document.querySelector('.play-list');
    playList.forEach(el => {
        const li = document.createElement('li');
        const playBtn = document.createElement('button');
        const wrapper = document.createElement('div');

        li.classList.add('play-item');
        li.textContent = el.title;
        playBtn.classList.add('play');
        playBtn.classList.add('small-play');
        playBtn.classList.add('player-icon');
        wrapper.classList.add('play-items-wrapper');

        playBtn.addEventListener('click', loadClickedAudio);
        playBtn.addEventListener('click', toggleAudioBtn);

        wrapper.append(playBtn);
        wrapper.append(li);
        playListContainer.append(wrapper);
    });
}

const isPlaying = () => {
    const playItems = document.querySelectorAll('.play-item');
    const playBtns = document.querySelectorAll('.play');
    
    playItems.forEach(el => {
        el.classList.remove('play-item_active');
    });
    playItems[playNum].classList.add('play-item_active');
    playBtns[playNum + 1].classList.add('pause');
}

const addAudio = () => {
    const play = document.querySelector('.play');
    const playNextBtn = document.querySelector('.play-next');
    const playPrevBtn = document.querySelector('.play-prev');
    const progressArea = document.querySelector('.progress-area');
    const volume = document.querySelector('.volume-slider');
    const volumeIcon = document.querySelector('.volume-up');
    const playListBtn = document.querySelector('.more-music-icon');

    createPlayList();
    loadAudio();

    audio.addEventListener('ended', playNext);
    audio.addEventListener('playing', isPlaying);
    audio.addEventListener('timeupdate', updateProgressBar);
    
    play.addEventListener('click', playAudio);
    playNextBtn.addEventListener('click', playNext);
    playPrevBtn.addEventListener('click', playPrev);

    play.addEventListener('click', toggleAudioBtn);
    playNextBtn.addEventListener('click', toggleAudioBtn);
    playPrevBtn.addEventListener('click', toggleAudioBtn);

    progressArea.addEventListener('click', changeProgressBarPosition);
    volume.addEventListener('change', setVolume);
    volumeIcon.addEventListener('click', switchVolume);
    playListBtn.addEventListener('click', showOrHidePlayList);
}

const updateProgressBar = (e) => {
    const progressBar = document.querySelector('.progress-bar');
    const currentTime = document.querySelector('.current');
    const musicDuration = document.querySelector('.duration');
    const currentTimeDuration = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTimeDuration / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    audio.addEventListener('loadeddata', () => { 
        let audioDuration = audio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    let currentMin = Math.floor(currentTimeDuration / 60);
    let currentSec = Math.floor(currentTimeDuration % 60);
    if(currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    currentTime.innerText = `${currentMin}:${currentSec}`;
}

const changeProgressBarPosition = (e) => {
    const progressArea = document.querySelector('.progress-area');
    const progressWidthVal = progressArea.clientWidth;
    const clickedOffSetX = e.offsetX;
    const songDuration = audio.duration;

    audio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
}

const setVolume = () => {
    const volumeSlider = document.querySelector('.volume-slider');
    
    volumeSlider.style.backgroundSize = (volumeSlider.value - volumeSlider.min) * 100 / 
        (volumeSlider.max - volumeSlider.min) + '% 100%';
    audio.volume = volumeSlider.value / 100;
}

const switchVolume = () => {
    const volumeIcon = document.querySelector('.volume-up');

    audio.muted = !audio.muted;
    if (audio.muted) {
        volumeIcon.classList.add('volume-off');
    } else {
        volumeIcon.classList.remove('volume-off');
    }
}

const showOrHidePlayList = () => {
    const widget = document.querySelector('.widget');
    const widgetContainer = document.querySelector('.widget-container');
    const playlist = document.querySelector('.play-list');

    isPlayListShown = !isPlayListShown;
    if(isPlayListShown) {
        widgetContainer.classList.add('widget-play-list_active');
        widget.classList.add('widget_active');
        playlist.classList.add('play-list_active');
    } else if (!isPlayListShown) {
        widgetContainer.classList.remove('widget-play-list_active');
        widget.classList.remove('widget_active');
        playlist.classList.remove('play-list_active');
    }
}

const translateNamePlaceholder = () => {
    const input = document.querySelector('.name');
    input.placeholder = lang === 'en' ? '[Enter your name]' : '[Введите свое имя]';
}

const translateDefaultCityName = () => {
    const cityInput = document.querySelector('.city');
    cityInput.value = lang === 'en' ? 'Minsk' : 'Минск';
}

const translateQuote = async () => {  
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json(); 
    const quote = document.querySelector('.quote');
    const author = document.querySelector('.author');
    const element = data.find(el => el.quoteTextEn === quote.textContent || el.quoteTextRu === quote.textContent);

    quote.textContent = lang === 'en' ? element.quoteTextEn : element.quoteTextRu;
    author.textContent = lang === 'en' ? element.quoteAuthorEn : element.quoteAuthorRu;
}

const translateToOtherLanguage = () => {
    lang = lang === 'en' ? 'ru' : 'en';
    showTime();
    getWeather();
    translateNamePlaceholder();
    translateDefaultCityName();
    translateQuote();
}

const addTranslation = () => {
    const langSwitcher = document.querySelector('.switch__input');
    langSwitcher.addEventListener('click', translateToOtherLanguage);
}