/*
    Copyright (c) 2018 pent0

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var Discord = require('discord.js');
var logger = require('winston');
var faced = require('faced');
var jimp = require('jimp');

var auth = require('./auth.json');

var argumentsUtils = require('./utils/arguments');
var downloadUtils = require('./utils/download');
var makeUtils = require('./utils/make.js');

var helpNote = "**Bots command**\n" + 
    "\t- help: Send you help commands\n" +
    "\t- repeat: I will repeat what you said and delete the message you command me\n" +
    "\t- ping: Ping me fuck off\n" +
    "\t- sansify + url: Sans the image";

logger.add(new logger.transports.Console ({
    colorize: true
}));

logger.level = 'debug';

var bot = new Discord.Client();

bot.on('ready', () => {
    logger.info('Connected ');
    bot.user.setActivity('with Sans from Undertale.');
});

bot.on('message', message => {
    if (argumentsUtils.IsCommandingMe(message.content, '!nehneh')) {
        const content = argumentsUtils.GetArgsString(message.content, '!nehneh');
        var lexer = new argumentsUtils.ArgsLexer(content);

        var cmd = lexer.next();

        if (cmd == null) {
            message.channel.send('You dont command me anything, im out lol');
            return;
        }

        switch (cmd.string) {
            case 'ping':
                message.react('498342645781757952');    // Bald Komaeda
                message.channel.send(makeUtils.MakePing(message.author.id) + ' No');
                break;

            case 'repeat': 
                const repeatTarget = content.substring(cmd.end);
                message.channel.send(repeatTarget).then(
                    () => {
                        message.delete(500);
                    });

                break;

            case 'help':
                message.react('498342645781757952');
                message.channel.send(makeUtils.MakePing(message.author.id) + 
                    ' Send you help notes in your DM').then(
                        () => {
                            message.author.send(helpNote);
                        });

                break;

            case 'sansify': 
                message.react('498342645781757952');
                cmd = lexer.next();

                if (cmd == null) {
                    if (message.attachments.size > 0) {
                        cmd = { string: message.attachments.first().url, end: 0 };
                    } else {
                        message.channel.send(makeUtils.MakePing(message.author.id) + 
                            ' Send me empty link, i cant work with that');

                        break;
                    }
                } 

                downloadUtils.Download(cmd.string, "temp.png", () => {
                    var faceDetector = new faced();

                    faceDetector.detect('temp.png', function (faces, image, file) {
                        if (!faces || faces.length == 0) {
                            message.react('498416716863242251');
                            message.channel.send('No face detected to Sansify.');
                            return;
                        } 

                        logger.info("Totals face: " + faces.length);

                        faces.forEach(face => {
                            var leftEye = face.getEyeLeft();

                            if (leftEye == null) {
                                leftEye = face.getEyeRight();
                            }

                            if (leftEye != null) {
                                logger.info('Found: ' +
                                    leftEye.getX() + ' ' + leftEye.getY());

                                jimp.read('temp.png').then(image => {
                                    jimp.read('./data/sanseye.png').then(sanseye => {
                                        sanseye.resize(leftEye.getWidth(), leftEye.getHeight(), () => {
                                            image.composite(sanseye, leftEye.getX(), leftEye.getY(),
                                                jimp.BLEND_SOURCE_OVER, function() {
                                                message.react('498416716863242251');

                                                image.write('temp2.png', () => {
                                                    message.channel.send('<:sansz:498416716863242251>', {
                                                        files: [
                                                            "temp2.png"
                                                        ]
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            } else {
                                message.react('498416716863242251');
                                message.channel.send('Cant find the eyes!!!!!');
                            }
                        });
                    });
                });
            

                break;
            
            default:
                message.channel.send('Dont understand i will continue simultaneously whip' +
                    ' and nea nea with Sans from the Undertale');

                break;
        }
    }
});

bot.login(auth.token);
