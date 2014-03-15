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
var videoRecorder;

// var audioContext = new AudioContext;
var audioRecorder;

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

    // var setVideo = function() {
    //     setTimeout(function() {
    //         video.width = 320;
    //         video.height = 240;
    //         canvas.width = video.width;
    //         canvas.height = video.height;
    //     }, 1000);
    // };

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
            if (video.mozSrcObject !== undefined) {
                video.mozSrcObject = stream;
            } else {
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }

            var options = {
                type: 'gif',
                video: {
                    width: 320,
                    height: 240
                },
                canvas: {
                    width: 320,
                    height: 240
                }
            };
            videoRecorder = window.RecordRTC(stream, options);

            var audioInput = audioContext.createMediaStreamSource(stream);
            audioInput.connect(audioContext.destination);
            audioRecorder = new Recorder(audioInput);
            // setVideo();
        }, function(e) {
            alert('Error'+e);
            console.log(e)
        });
    } else {
        console.log('getUserMedia() not supported in this browser.');
    }
};

/*Record function: Draws frames and pushes to array*/
function record() {
    // var context = canvas.getContext('2d');
    // var CANVAS_HEIGHT = canvas.height;
    // var CANVAS_WIDTH = canvas.width;

    // frames = [];

    // function draw(time) {
    //     rafId = requestAnimationFrame(draw);

    //     context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //     var url = canvas.toDataURL('image/webp', 1);
    //     frames.push(url);
    // };

    // rafId = requestAnimationFrame(draw);

    //Audio stuff
    audioRecorder.clear();
    audioRecorder.record();

    recordIt();
    get('#stop').disabled = false;
    videoRecorder.startRecording();

};

/*Stop Recording*/
function stop() {

    //Audio stuff
    audioRecorder.stop();
    setAudio();

    get('#stop').disabled = true;
    recordIt();
    // cancelAnimationFrame(rafId);
    // setVideo();
    videoRecorder.stopRecording(function(url){
        get('#outGIF').src = url;
    })
};

/*Call Whammy for creating video*/
// function setVideo(vidUrl) {
//     var url = vidUrl || null;
//     var video = get('#recordedDiv video') || null;

//     if (!video) {
//         video = document.createElement('video');
//         video.autoplay = true;
//         video.controls = true;
//         video.style.width = canvas.width + 'px';
//         video.style.height = canvas.height + 'px';
//         get('#recordedDiv').appendChild(video);
//     } else {
//         window.URL.revokeObjectURL(video.src);
//     }

//     if (!url) {
//         var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
//         url = window.URL.createObjectURL(webmBlob);
//     }
//     video.src = url;
// }


function setAudio() {
    audioRecorder.exportWAV(function(blob) {
        var audio = get('#recordedDiv audio') || null;
        var url = URL.createObjectURL(blob);
        if(!audio) {
            var audio = document.createElement('audio');
            audio.autoplay = true;
            audio.controls = true;
            audio.src = url;
            get('#recordedDiv').appendChild(audio);
        }
        else {
            audio.src = url;
        }
    });
}

/*Fingers Crossed*/
function init() {
    get('#camera').addEventListener('click', getMedia);
    get('#record').addEventListener('click', record);
    get('#stop').addEventListener('click', stop);
}
init();