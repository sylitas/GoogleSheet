require('dotenv').config()
const Discord = require("discord.js");
const numeral = require('numeral');

const client = new Discord.Client();
const queue = new Map();

const {
    getAuthToken,
    getValues,
} = require('./googleSheetsService.js');

//--test values
const test_spreadsheetId = "1ZSjWL_uu7wXRJUpJHxJNWMcSiiuOWkNTv8etQIfNSeE"; //sheet test bot
//unconstain letiable
let prefix = "-s ";
let spreadsheetId = test_spreadsheetId;
let sheetName;
let total = 0;
//--lib
const change = "change";
const test = "test";
const ggs = "ggs";
const help = "help";
const currency = "VNĐ";
//--End lib
//emo values (config each server)
const v1 = '828525723320713226';
const v1_name = '1_';
const v2 = '828525723513126942';
const v2_name = '2_';
const v3 = '828525723308261437';
const v3_name = '3_';
const v4 = '828525723383889920';
const v4_name = '4_';
const v5 = '828525723673296936';
const v5_name = '5_';
const v6 = '828525723329363980';
const v6_name = '6_';
const v7 = '828525723479572501';
const v7_name = '7_';
const v8 = '828525723739357184';
const v8_name = '8_';
const v9 = '828525723211268118';
const v9_name = '9_';
const v10 = '828525723542487050';
const v10_name = '10';


client.on("ready", () => {
    console.log("GoogleSheet BOT is ON");
});

client.on("message", msg => {
    if (msg.author.bot) return;
    if (msg.channel.type != 'text' || msg.author.bot || !msg.content.startsWith(prefix)) {
        return;
    }
    let message = msg.content.split(" "); // "prefix" + message[1] + message[2] + message[3] ...
    if (message.length >= 2) {
        switch (message[1]) {
            //For changing prefix valuable
            case change:
                let str = "-" + msg.content.charAt(msg.content.length - 1) + " ";
                if (str !== sign) {
                    msg.reply(`I had changed ${sign} to ${str}`);
                    sign = str;
                }
                break;
                //For testing bot
            case test:
                if (message[1] === test) {
                    msg.reply("Hello;World");
                }
                break;
                //For Helping
            case help:
                if (message[1] === help) {
                    msg.reply(`https://help.syl.com`);
                }
                break;
                //For reading googlesheet   
            case ggs:
                msg.reply('\n' + '`Doanh Thu` for Doanh Thu.\n' + '`Chi Phí` for showing data');
                msg.channel.awaitMessages(m1 => m1.author.id == msg.author.id, {
                    max: 1,
                    time: 30000
                }).then(c1 => {
                    switch (c1.first().content) {
                        case 'Doanh Thu':
                            msg.reply('\n' + 'Select :' + '\n' + '`1` for tổng doanh thu kế hoạch.' + '\n' + '`2` for tổng doanh thu thực hiện.').then(new_msg => {
                                new_msg.react(v1)
                                    .then(() => new_msg.react(v2))
                                    //.then(() => msg.react(v3))
                                    //...\
                                    .then(() => {
                                        new_msg.awaitReactions((reaction, user) => {
                                            return [
                                                v1_name,
                                                v2_name
                                                //v3_name...
                                            ].includes(reaction.emoji.name) && user.id === msg.author.id;
                                        }, {
                                            max: 1,
                                            time: 30000
                                        }).then(c1 => {
                                            switch (c1.first().emoji.name) {
                                                case v1_name:
                                                    sheetName = "Tổng Kết!E:E"; // Doanh thu kế hoạch
                                                    f_sum(spreadsheetId, sheetName, function (rs) {
                                                        if (rs) {
                                                            msg.reply(`Doanh thu Kế Hoạch : ${rs} ${currency}`);
                                                        } else {
                                                            msg.reply(`Uncountable`);
                                                        }
                                                    });
                                                    break;
                                                case v2_name:
                                                    sheetName = "Tổng Kết!F:F"; // Doanh thu thực hiện
                                                    f_sum(spreadsheetId, sheetName, function (rs) {
                                                        if (rs) {
                                                            msg.reply(`Doanh thu Thực Hiện: ${rs} ${currency}`);
                                                        } else {
                                                            msg.reply(`Uncountable`);
                                                        }
                                                    });
                                                    break;
                                                    //newcase
                                            }
                                            msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                                        });
                                    })
                                    .catch();
                            });
                            break;
                            //newcase
                    }
                })
                break;
            }
    } else {
        msg.reply("Using`" + prefix + "help` for more detail");
    }
});


function f_sum(spreadsheetId, sheetName, callback) {
    async function GetSpreadSheetValues() {
        try {
            const auth = await getAuthToken();
            const response = await getValues({
                spreadsheetId,
                sheetName,
                auth
            })
            let values = response.data.values;
            for (let i = 1; i < values.length; i++) {
                total = total + parseInt(values[i]);
            }
            total = numeral(total).format('0,0'); //change format
            callback(total)
        } catch (error) {
            console.log(error.message, error.stack);
        }
    }
    GetSpreadSheetValues();
};
function f_getData(spreadsheetId, sheetName, callback) {
    async function GetSpreadSheetValues() {
        try {
            const auth = await getAuthToken();
            const response = await getValues({
                spreadsheetId,
                sheetName,
                auth
            })
            let values = response.data.values;
        } catch (error) {
            console.log(error.message, error.stack);
        }
        callback(values);
    }
    GetSpreadSheetValues();
};

client.login(process.env.TOKEN);