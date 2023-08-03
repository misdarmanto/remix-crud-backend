"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsePhoneNumber = exports.GenerateRandomString = exports.GenerateRandomNumber = void 0;
const GenerateRandomNumber = (length) => {
    let result = '';
    let characters = '012345678901234567890123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.GenerateRandomNumber = GenerateRandomNumber;
const GenerateRandomString = (length, characters) => {
    let result = '';
    characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.GenerateRandomString = GenerateRandomString;
const ParsePhoneNumber = (phone) => {
    phone = phone.trim();
    phone = phone.replace(/-/g, '');
    phone = phone.replace(/ /g, '');
    phone = phone.replace(/\+/g, '');
    if (phone.substr(0, 1) == '0') {
        phone = '62' + phone.substr(1, phone.length - 1);
    }
    else if (phone.substr(0, 2) != '62') {
        phone = '62' + phone;
    }
    return phone;
};
exports.ParsePhoneNumber = ParsePhoneNumber;
