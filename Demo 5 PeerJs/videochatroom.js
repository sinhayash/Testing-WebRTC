navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// Start user
var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 0});
peer.on('open', function(){
    $('#mypeerid').append("Your peer id: " + peer.id);
});
peer.on('call', function(call){
    console.log("Call received");
    call.answer(window.localStream);
    processCall(call);
});
peer.on('error', function(err){
    console.log(err.message);
});
$(function(){
    $('#call').bind('click', callPeer);
    getLocalVideo();
});
function getLocalVideo() {
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        console.log("Local video streaming");
        $('#videos').append("<video id='" + peer.id + "' autoplay></video>");
        $('#' + peer.id).prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
    }, function(){ alert('Cannot connect to webcam. Allow access.') });
}
function callPeer() {
    console.log("Calling peer");
    var call = peer.call($('#remotepeerid').val(), window.localStream);
    processCall(call);
}
function processCall(call) {
        call.on('stream', function(remoteStream){
        console.log("Adding video from " + call.peer);
        $('#videos').append("<video id='" + call.peer + "' autoplay>");
        $('#' + call.peer).prop('src', URL.createObjectURL(remoteStream));
    });
    window.existingCall = call;
}