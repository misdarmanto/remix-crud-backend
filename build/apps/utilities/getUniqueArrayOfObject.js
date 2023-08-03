"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnique = void 0;
function getUnique(arr) {
    let mapObj = new Map();
    arr.forEach((v) => {
        let prevValue = mapObj.get(v.name);
        if (!prevValue) {
            mapObj.set(v.name, v);
        }
    });
    return [...mapObj.values()];
}
exports.getUnique = getUnique;
