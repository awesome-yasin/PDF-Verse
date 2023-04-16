/**
 * Returns a Promise that resolves after at least one tick of the
 * Macro Task Queue occurs.
 */
export var waitForTick = function () {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(); }, 0);
    });
};
//# sourceMappingURL=async.js.map