const express = require("express");
const port = 8000;
const app = express();
const stream = require("stream");
const ffmpeg = require('fluent-ffmpeg');
const textToSpeech = require('@google-cloud/text-to-speech');
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'serviceaccount.json';

app.use(express.static("./"));

app.get('/download-audio', async (req, res) => { 

    let textToSynthesize = req.query.textToSynthesize;
    console.log("textToSynthesize:", textToSynthesize);

    const client = new textToSpeech.TextToSpeechClient();
    const request = {
        input: {text: textToSynthesize || 'Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.   - João 3 16'},
        // Select the language and SSML voice gender (optional)
        audioConfig: {
            audioEncoding: "LINEAR16",//"WAV",//"OGG-OPUS",// 
            effectsProfileId: [
              "Small home speaker"
            ],
            pitch: -5.5,
            speakingRate: -0.38
          },
          
        voice: { languageCode: "pt-PT", 
        name: "pt-PT-Wavenet-B", 
        ssmlGender: "WAVANET"},
       // audioConfig: { audioEncoding: 'MP3' },
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3'},
    };

    const [response] = await client.synthesizeSpeech(request);
     // Gera um nome de arquivo único com UUID para MP3
     
    console.log(`Audio Sintetizado, content-length: ${response.audioContent.length} bytes`)
    const readStream = new stream.PassThrough();

    readStream.end(response.audioContent);
    res.set("Content-disposition", 'attachment; filename=' + 'audio.mp3');
    res.set("Content-Type", "audio/mpeg");

    readStream.pipe(res);
});

app.listen(port);
console.log(`Serving at http://localhost:${port}`);