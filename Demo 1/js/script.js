/*Yash Sinha mail.yash.sinha@gmail.com*/

var video = document.querySelector('video');

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
    
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

function errorCallback(error) {
    console.log('An error occurred: ' + error.code);
}

if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true, audio: true}, function(stream){
        if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
        } else {
            video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        }
        video.play();
    }, errorCallback);
} else {
    console.log('getUserMedia() not supported in this browser.');
}