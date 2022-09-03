"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRaw = exports.addMedal = void 0;
function addMedal(rank) {
    let medal = '';
    switch (rank) {
        case 1:
            medal = '🥇';
            break;
        case 2:
            medal = '🥈';
            break;
        case 3:
            medal = '🥉';
            break;
        default:
            medal = '';
            break;
    }
    return medal;
}
exports.addMedal = addMedal;
function computeRaw(ordered_users) {
    if (!ordered_users.length)
        return [];
    const rawUsers = [];
    ordered_users.map(user => {
        const foundUser = rawUsers.find(rawUser => rawUser.id === user.id);
        if (!foundUser)
            return rawUsers.push(user);
        foundUser.wins += user.wins;
        foundUser.losses += user.losses;
        foundUser.mvps += user.mvps;
        foundUser.realMVP += user.realMVP;
    });
    return rawUsers;
}
exports.computeRaw = computeRaw;
//# sourceMappingURL=rawUsers.js.map