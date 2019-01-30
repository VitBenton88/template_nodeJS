$(document).ready(() => {

    alert('Welcome to Node.js!');

    $('.node-logo').mousedown(() => {
        $('body').toggleClass('nodeGreen');
    });

    $('.node-logo').mouseup(() => {
        $('body').toggleClass('nodeGreen');
    });

});
