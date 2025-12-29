const bcrypt = require('bcrypt');
require('dotenv').config();
const customStrings = require('./customStrings')
function checkStatus() {
    if (process.env.MODE == 'start') console.log('production mode');
    else if (process.env.MODE == 'deploy') console.log('domain mode');
    else if (process.env.MODE == 'build') console.log('development mode');
    else console.log('unable to get status');
}

async function encryptPassword(password) {
 return await bcrypt.hash(password, 10);
}

async function isCorrectPass(password, hash) {
    return await bcrypt.compare(password, hash);
}

async function encryptMany(passwords) {
    return Promise.all(passwords.map(pass => encryptPassword(pass)));
}

const passwords = [
    '125124',
    '12612611235247',
    '12492109589',
    '023848439',
    '23498567',
    'sdfjlncv',
    'wer9uf90',
    '2389hfhnsk',
    'fj8jfo2f',
    '9238hfinnl',
    '023jfm234',
    '23nf32o3m',
    'fj023fff'
];

const str = [
    'Hello world',
    'Vsem privet',
    'Share with others',
    'audiotape',
    'Microcontroller'
]

checkStatus();

(async () => {
const hashes = await encryptMany(passwords);
console.log(hashes);
})();

const sorted = customStrings.sortStrings(str);
console.log(sorted);




