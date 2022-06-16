var con = require('./DB/conDb');


// LOGGING 

function getCurrentDateString() {
    return (new Date()).toISOString() + ' ::';
};
__originalLog = console.log;
console.log = function() {
    var args = [].slice.call(arguments);
    __originalLog.apply(console.log, [getCurrentDateString()].concat(args));
};


const fs = require('fs');
const util = require('util');
const path = require('path');
const { Readable } = require('stream');

// VARIA 


function necessary_dirs() {
    if (!fs.existsSync('./data/')) {
        fs.mkdirSync('./data/');
    }
}
necessary_dirs()

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function convert_audio(input) {
    try {
        // stereo to mono channel
        const data = new Int16Array(input)
        const ndata = data.filter((el, idx) => idx % 2);
        return Buffer.from(ndata);
    } catch (e) {
        console.log(e)
        console.log('convert_audio: ' + e)
        throw e;
    }
}


//CONFIG 


const SETTINGS_FILE = 'settings.json';


// let DISCORD_TOK = 'OTM2NzEzNDM2NDU5NTkzNzc4.YfRMXg.M1IWZumAxfEugqwQFg2j1PoXa4w';
// let WITAI_TOK = null; 
// let SPEECH_METHOD = 'vosk'; // witai, google, vosk

function loadConfig() {
    if (fs.existsSync(SETTINGS_FILE)) {
        const CFG_DATA = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        DISCORD_TOK = CFG_DATA.DISCORD_TOK;
        WITAI_TOK = CFG_DATA.WITAI_TOK;
        SPEECH_METHOD = CFG_DATA.SPEECH_METHOD;
    }
    DISCORD_TOK = process.env.DISCORD_TOK || DISCORD_TOK;
    WITAI_TOK = process.env.WITAI_TOK || WITAI_TOK;
    SPEECH_METHOD = process.env.SPEECH_METHOD || SPEECH_METHOD;

    if (!['witai', 'google', 'vosk'].includes(SPEECH_METHOD))
        throw 'invalid or missing SPEECH_METHOD'
    if (!DISCORD_TOK)
        throw 'invalid or missing DISCORD_TOK'
    if (SPEECH_METHOD === 'witai' && !WITAI_TOK)
        throw 'invalid or missing WITAI_TOK'
    if (SPEECH_METHOD === 'google' && !fs.existsSync('./gspeech_key.json'))
        throw 'missing gspeech_key.json'

}
loadConfig()


const Discord = require('discord.js')
const DISCORD_MSG_LIMIT = 2000;
const discordClient = new Discord.Client()

discordClient.login(DISCORD_TOK)

const guildMap = new Map();

require('./events')(discordClient, guildMap, connect, Discord)


function Dictionary() {
    this.dataUser = []

    this.add = function(key, value) {
        if (key && value) {
            this.dataUser.push({
                key: key,
                value: value
            })
            return this.dataUser
        }
    }

    this.findAt = function(key) {
        for (var i = 0; i < this.dataUser.length; i++) {
            if (this.dataUser[i].key === key) {
                return this.dataUser[i].value
            }

        }
        return "Not found "
    }

    this.size = function() {
        return this.dataUser.length
    }

}

var dict = new Dictionary()

function Select_dict(dict, callback) {
    //  Проверка сушествует ли Фамилия и Имя студента
    con.query('SELECT `users`.`id` , CONCAT(`students`.`lastname`," ",`students`.`firstname`) AS "FN" FROM `users`,`students` WHERE `users`.`id_s`=`students`.`id_s`', [], async(err, res, fields) => {

        //Проверка на выполнение запроса
        if (err) {
            console.log(err.message);

            return callback(0)
        }

        if (res.length != 0) {
            for (let i = 0; i < res.length; i++) {

                dict.add(res[i].id, res[i].FN)
            }
            return callback(dict)
        }
    })
}



const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

class Silence extends Readable {
    _read() {
        this.push(SILENCE_FRAME);
        this.destroy();
    }
}

async function connect(msg, mapKey, id_r) {
    try {
        let voice_Channel = await discordClient.channels.fetch(msg.member.voice.channelID);
        if (!voice_Channel) return msg.reply("Error: The voice channel does not exist!");
        let text_Channel = await discordClient.channels.fetch(msg.channel.id);
        if (!text_Channel) return msg.reply("Error: The text channel does not exist!");
        let voice_Connection = await voice_Channel.join();
        voice_Connection.play(new Silence(), { type: 'opus' });
        guildMap.set(mapKey, {
            'text_Channel': text_Channel,
            'voice_Channel': voice_Channel,
            'voice_Connection': voice_Connection,
            'selected_lang': 'ru',
            'debug': false,
        });
        speak_impl(voice_Connection, mapKey, id_r)
        voice_Connection.on('disconnect', async(e) => {
            if (e) console.log(e);
            guildMap.delete(mapKey);
        })
        msg.reply('connected!')
    } catch (e) {
        console.log('connect: ' + e)
        msg.reply('Error: unable to join your voice channel.');
        throw e;
    }
}

const vosk = require('vosk');
let recs = {}
if (SPEECH_METHOD === 'vosk') {
    vosk.setLogLevel(-1);
    // MODELS: https://alphacephei.com/vosk/models
    recs = {
            'ru': new vosk.Recognizer({ model: new vosk.Model('vosk_models/ru'), sampleRate: 48000 }),
            // 'fr': new vosk.Recognizer({model: new vosk.Model('vosk_models/fr'), sampleRate: 48000}),
            // 'es': new vosk.Recognizer({model: new vosk.Model('vosk_models/es'), sampleRate: 48000}),
        }
        // download new models if you need
        // dev reference: https://github.com/alphacep/vosk-api/blob/master/nodejs/index.js
}


function speak_impl(voice_Connection, mapKey, id_r) {
    voice_Connection.on('speaking', async(user, speaking) => {
        if (speaking.bitfield == 0 || user.bot) {
            return
        }
        console.log(`I'm listening to ${user.username}`)
            // this creates a 16-bit signed PCM, stereo 48KHz stream
        const audioStream = voice_Connection.receiver.createStream(user, { mode: 'pcm' })
        audioStream.on('error', (e) => {
            console.log('audioStream: ' + e)
        });
        let buffer = [];
        audioStream.on('data', (data) => {
            buffer.push(data)
        })
        audioStream.on('end', async() => {
            buffer = Buffer.concat(buffer)
            const duration = buffer.length / 48000 / 4;
            console.log("duration: " + duration)



            try {
                let new_buffer = await convert_audio(buffer)
                let out = await transcribe(new_buffer, mapKey);
                if (out != null) {

                    process_commands_query(out, mapKey, user);

                    Select_dict(dict, function(dict) {

                        if (out == "")
                            con.query('CALL `add_rec_dur`(?, ?)', [duration, id_r], async(err, fields) => {

                                if (err)
                                    return console.log(err.message);
                            })
                        else
                            con.query('CALL `add_rec`(?, ?, ?, ?)', [dict.findAt(user.id), id_r, duration, out], async(err, fields) => {

                                if (err)
                                    return console.log(err.message);
                            })
                    })



                    con.query('CALL `add_speach`(?, ?)', [user.id, out], async(err, fields) => {
                        if (err)
                            return console.log(err.message);

                    })

                }
            } catch (e) {
                console.log('tmpraw rename: ' + e)
            }


        })
    })
}

function process_commands_query(txt, mapKey, user) {
    if (txt && txt.length) {
        let val = guildMap.get(mapKey);
        val.text_Channel.send(user.username + ': ' + txt)


    }
}

// SPEECH 

async function transcribe(buffer, mapKey) {
    if (SPEECH_METHOD === 'witai') {
        return transcribe_witai(buffer)
    } else if (SPEECH_METHOD === 'google') {
        return transcribe_gspeech(buffer)
    } else if (SPEECH_METHOD === 'vosk') {
        let val = guildMap.get(mapKey);
        recs[val.selected_lang].acceptWaveform(buffer);
        let ret = recs[val.selected_lang].result().text;
        console.log('vosk:', ret)
        return ret;
    }
}



async function transcribe_gspeech(buffer) {
    try {
        console.log('transcribe_gspeech')
        const bytes = buffer.toString('base64');
        const audio = {
            content: bytes,
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 48000,
            languageCode: 'en-US', // https://cloud.google.com/speech-to-text/docs/languages
        };
        const request = {
            audio: audio,
            config: config,
        };

        const [response] = await gspeechclient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`gspeech: ${transcription}`);
        return transcription;

    } catch (e) { console.log('transcribe_gspeech 368:' + e) }
}