window.onload = () => {
    // Time, Date and Greeting
    showTime();
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
    return hours < 18 ? hours < 12 ? hours < 6 ? 'night' : 'morning' : 'day' : 'evening';
}

const setLocalStorage = () => {
    const name = document.querySelector('.name');
    localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage);

const getLocalStorage = () => {
    let name = document.querySelector('.name');
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage);