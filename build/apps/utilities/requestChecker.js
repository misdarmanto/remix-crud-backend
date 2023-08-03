"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestChecker = void 0;
const requestChecker = ({ requireList, requestData }) => {
    const emptyField = [];
    requireList.map((value) => {
        if (!requestData[value]) {
            emptyField.push(value);
        }
    });
    return emptyField.toString();
};
exports.requestChecker = requestChecker;
