function logMethodExecutionTime(method, start) {
    console.log(method + ' took ' + (performance.now() - start));
}

function runExperiment(numOfAudio, numOfVideo, times, pc1) {
    if (times <= 0) {
        return;
    }

if (!pc1) {
    pc1 = new RTCPeerConnection( {sdpSemantics: 'plan-b'});
}

let audioLine = ''
for (let ssrc = 1; ssrc <= numOfAudio; ssrc++) {
    audioLine += `
a=ssrc:${ssrc} cname:cname-${ssrc}
a=ssrc:${ssrc} msid:msid-${ssrc} trackid-${ssrc}
a=ssrc:${ssrc} mslabel:mslabel-${ssrc}
a=ssrc:${ssrc} label:label-${ssrc}`
}

let videoLine = ''
for (let ssrc = numOfAudio + 1; ssrc <= (numOfAudio + numOfVideo); ssrc++) {
    videoLine += `
a=ssrc:${ssrc} cname:cname-${ssrc}
a=ssrc:${ssrc} msid:msid-${ssrc} trackid-${ssrc}
a=ssrc:${ssrc} mslabel:mslabel-${ssrc}
a=ssrc:${ssrc} label:label-${ssrc}`
}

var offerSdp = `v=0
o=- 1923518516 2 IN IP4 0.0.0.0
s=-
t=0 0
a=group:BUNDLE audio video
m=audio 1 RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126
c=IN IP4 0.0.0.0
a=rtpmap:111 opus/48000/2
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
a=rtpmap:9 G722/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:106 CN/32000
a=rtpmap:105 CN/16000
a=rtpmap:13 CN/8000
a=rtpmap:110 telephone-event/48000
a=rtpmap:112 telephone-event/32000
a=rtpmap:113 telephone-event/16000
a=rtpmap:126 telephone-event/8000
a=fmtp:111 minptime=10; useinbandfec=1
a=rtcp:1 IN IP4 0.0.0.0
a=rtcp-fb:111 transport-cc
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=setup:actpass
a=mid:audio
a=sendrecv
a=ice-ufrag:63c8
a=ice-pwd:i6tPwzLoPkoiw201qxi4QzQi
a=fingerprint:sha-256 9E:64:0E:9C:7A:F2:07:04:E6:F2:0F:26:C4:BF:72:1E:AD:66:33:47:D8:71:7D:7C:2B:3D:2E:4B:9F:37:87:7C
a=candidate:3476808479 1 udp 2122260223 169.254.216.54 56769 typ host generation 0${audioLine}
a=rtcp-mux
m=video 1 RTP/SAVPF 96 97 98 99 100 101 114 115 116
c=IN IP4 0.0.0.0
a=rtpmap:96 VP8/90000
a=rtpmap:97 rtx/90000
a=rtpmap:98 VP9/90000
a=rtpmap:99 rtx/90000
a=rtpmap:100 VP9/90000
a=rtpmap:101 rtx/90000
a=rtpmap:114 red/90000
a=rtpmap:115 rtx/90000
a=rtpmap:116 ulpfec/90000
a=fmtp:97 apt=96
a=fmtp:98 profile-id=0
a=fmtp:99 apt=98
a=fmtp:100 profile-id=2
a=fmtp:101 apt=100
a=fmtp:115 apt=114
a=rtcp:1 IN IP4 0.0.0.0
a=rtcp-fb:96 goog-remb
a=rtcp-fb:96 transport-cc
a=rtcp-fb:96 ccm fir
a=rtcp-fb:96 nack
a=rtcp-fb:96 nack pli
a=rtcp-fb:98 goog-remb
a=rtcp-fb:98 transport-cc
a=rtcp-fb:98 ccm fir
a=rtcp-fb:98 nack
a=rtcp-fb:98 nack pli
a=rtcp-fb:100 goog-remb
a=rtcp-fb:100 transport-cc
a=rtcp-fb:100 ccm fir
a=rtcp-fb:100 nack
a=rtcp-fb:100 nack pli
a=extmap:14 urn:ietf:params:rtp-hdrext:toffset
a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:13 urn:3gpp:video-orientation
a=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type
a=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing
a=extmap:8 http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07
a=extmap:9 http://www.webrtc.org/experiments/rtp-hdrext/color-space
a=setup:actpass
a=mid:video
a=sendrecv
a=ice-ufrag:63c8
a=ice-pwd:i6tPwzLoPkoiw201qxi4QzQi
a=fingerprint:sha-256 9E:64:0E:9C:7A:F2:07:04:E6:F2:0F:26:C4:BF:72:1E:AD:66:33:47:D8:71:7D:7C:2B:3D:2E:4B:9F:37:87:7C
a=rtcp-mux${videoLine}
a=x-google-flag:conference
`;

const offer = new RTCSessionDescription();
offer.type = 'offer';
offer.sdp = offerSdp;

var start = performance.now();
pc1.setRemoteDescription(offer).then(_ => {
    logMethodExecutionTime('setRemoteDescription', start);
    start = performance.now();
    pc1.createAnswer().then(answer => {
        logMethodExecutionTime('createAnswer', start);
        start = performance.now();
        pc1.setLocalDescription(answer).then(_ => {
            logMethodExecutionTime('setLocalDescription', start);
            runExperiment(numOfAudio + 1, numOfVideo + 1, --times, pc1)
        }).catch(err => {
            console.log(err)
        });
    }).catch(err => {
        console.log(err)
    });
}).catch(err => {
    console.log(err)
    console.log(offer.sdp)
});
}
