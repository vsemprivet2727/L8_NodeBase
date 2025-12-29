require('dotenv').config();
const os = require('os');

function isAmdin() {
    return process.env.MODE == 'admin'? true : false; 
}

function showPcInfo() {
 if(isAmdin()) {
 console.log(os.platform());
 console.log('free memory: ' + os.freemem());
 console.log('main directory: ' + os.homedir());
 console.log('network interface: ' + JSON.stringify(os.networkInterfaces(), null, 2));
 }
 else console.log('вы не админ');
}

function isEnoughRAM () {
 return os.freemem()/(1024**2) > 4096? true : false;
}

showPcInfo();
if(isEnoughRAM()) console.log('Больше 4-х гигабайт');
else console.log('меньше 4-х гб');

console.log(process.env.NAME);
console.log(process.env.SURNAME);
console.log(process.env.GROUP_NUMBER);
console.log(process.env.JOURNAL_NUMBER);