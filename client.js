let ytdl = require('ytdl-core');

document.getElementById('url-form').addEventListener('submit', download);

let switchBtn = document.getElementById('switch-button');
switchBtn.addEventListener('click', switchMode);

function download(e) {
    try {
        // Getting the url of the video
        let url = document.getElementById('vid-url').value;
        console.log('youtube vid url: ', url);

        // Fetching details
        let videoId = ytdl.getVideoID(url);
        console.log('video id:', videoId);

        // Trigger downloading the video via the browser
        triggerBrowserDownload(videoId, isAudioOnly() ? 'audio' : 'video');

    } catch(ex) {
        console.log('err: ' + ex);
        alert('Something went wrong: ' + ex);
    }

    e.preventDefault();
}

function triggerBrowserDownload(videoId, mode) {
    if (isChrome()) {
        // Preparing the file
        let url = 'http://localhost:8000/download/' + mode + '/' + videoId;
        console.log('url for browser download: ' + url);

        //Creating new link node.
        let link = document.createElement('a');
        link.href = url;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            let fileName = 'video.mp4';
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            let event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            link.dispatchEvent(event);
            window.URL.revokeObjectURL(url);
        } else {
            link.click();
        }
    } else {
        // Force file download (whether supported by server).
        let query = '?download';
        window.open(url + query, '_self');
    }
}

function isChrome() {
    return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}

function isAudioOnly() {
    return 'Audio' === switchBtn.getAttribute('value');
}

function switchMode() {
    switchBtn.setAttribute('value', isAudioOnly() ? 'Video' : 'Audio');
}
