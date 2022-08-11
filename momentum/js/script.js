window.onload = () => {
    // Time
    showTime();
    
    // Greeting
    // sayHello();
}

const showTime = () => {
    const time = document.querySelector('.time');
    const date = new Date();

    time.textContent = date.toLocaleTimeString();
    showDate();
    setTimeout(showTime, 1000);
}

const showDate = () => {
    const currentDate = document.querySelector('.date');
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' };

    currentDate.textContent = date.toLocaleDateString('en-US', options);
}

/*
const sayHello = () => {
    const hello = document.querySelector('.greeting');

}
*/