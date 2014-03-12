/*Yash Sinha mail.yash.sinha@gmail.com*/

/*Adapating for different vendors*/
window.URL =
    window.URL ||
    window.webkitURL ||
    window.mozURL ||
    window.msURL;

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame;

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

/*Global stuff*/
var video = get('video');
video.width = 320;
video.height = 240;
var canvas = document.createElement('canvas');
var rafId = null;
var frames = [];

/*Save typing :) */
function get(selector) {
    return document.querySelector(selector) || null;
}

/*Wrapper for recording*/
function recordIt() {
    var record = get('#record');
    record.textContent = record.disabled ? 'Record' : 'Recording...';
    record.classList.toggle('recording');
    record.disabled = !record.disabled;
}

/*Get Media (Video and Audio) from user*/
function getMedia(event) {
    event.target.disabled = true;
    get('#record').disabled = false;

    video.controls = false;

    var setVideo = function() {
        setTimeout(function() {
            video.width = 320;
            video.height = 240;
            canvas.width = video.width;
            canvas.height = video.height;
        }, 1000);
    };

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
            if (video.mozSrcObject !== undefined) {
                video.mozSrcObject = stream;
            } else {
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }
            setVideo();
        }, function(e) {
            alert('Error');
        });
    } else {
        console.log('getUserMedia() not supported in this browser.');
    }
};

/*Record function: Draws frames and pushes to array*/
function record() {
    var context = canvas.getContext('2d');
    var CANVAS_HEIGHT = canvas.height;
    var CANVAS_WIDTH = canvas.width;

    frames = [];

    recordIt();
    get('#stop').disabled = false;

    function draw(time) {
        rafId = requestAnimationFrame(draw);

        context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        var url = canvas.toDataURL('image/webp', 1);
        frames.push(url);
    };

    rafId = requestAnimationFrame(draw);
};

/*Stop Recording*/
function stop() {
    cancelAnimationFrame(rafId);
    get('#stop').disabled = true;
    recordIt();
    setVideo();
};

/*Call Whammy for creating video*/
function setVideo(vidUrl) {
    var url = vidUrl || null;
    var video = get('#recordedDiv video') || null;

    if (!video) {
        video = document.createElement('video');
        video.autoplay = true;
        video.controls = true;
        video.style.width = canvas.width + 'px';
        video.style.height = canvas.height + 'px';
        get('#recordedDiv').appendChild(video);
    } else {
        window.URL.revokeObjectURL(video.src);
    }

    if (!url) {
        var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
        url = window.URL.createObjectURL(webmBlob);
    }
    video.src = url;
}

/*Fingers Crossed*/
function init() {
    get('#camera').addEventListener('click', getMedia);
    get('#record').addEventListener('click', record);
    get('#stop').addEventListener('click', stop);
}
init();