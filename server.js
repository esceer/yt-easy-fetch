// server configuration

let express = require('express');
let app = express();

app.get('/getinfo/:url', (req, res) => {
    let result = getInfo(req.params.url);
    res.send(result);
});

app.get('/download/:url', (req, res) => {
    stream = download(req.params.url);
    res.setHeader('Content-Disposition', 'attachment; filename=' + generateFileName(req.params.url));
    stream.pipe(res);
});

app.get('/download/video/:url', (req, res) => {
    stream = download(req.params.url, false);
    res.setHeader('Content-Disposition', 'attachment; filename=' + generateFileName(req.params.url, false));
    stream.pipe(res);
});

app.get('/download/audio/:url', (req, res) => {
    stream = download(req.params.url, true);
    res.setHeader('Content-Disposition', 'attachment; filename=' + generateFileName(req.params.url, true));
    stream.pipe(res);
});

app.listen(8000, () => {
    console.log('listening on port 8000');
});

function generateFileName(url, audioonly = false) {
    return 'yt_' + (audioonly === true ? 'audio' : 'video') + '_' + getVideoId(url) + '.mp4';
}


// ytdl module

let ytdl = require('ytdl-core');

function getVideoId(url) {
    return ytdl.getVideoID(url);
}

function getInfo(url) {
    let videoId = getVideoId(url);
    console.log('video id:', videoId);
    ytdl.getInfo(videoId, (err, info) => {
        if (err) {
            console.log('err: ' + err);
            return err;
        } else {
            return info;
        }
    });
}

function download(url, audioonly = false) {
    let videoId = getVideoId(url);
    console.log('video id:', videoId);
    if (audioonly === true) {
        return ytdl(videoId, { filter: 'audioonly' });
    } else {
        return ytdl(videoId);
    }
}
