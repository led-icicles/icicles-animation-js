export var IciclesCodes;
(function (IciclesCodes) {
    // CLIENT_ACTIONS
    IciclesCodes[IciclesCodes["nextAnimation"] = 1] = "nextAnimation";
    IciclesCodes[IciclesCodes["prevAnimation"] = 2] = "prevAnimation";
    IciclesCodes[IciclesCodes["pauseAnimation"] = 3] = "pauseAnimation";
    IciclesCodes[IciclesCodes["playAnimation"] = 4] = "playAnimation";
    IciclesCodes[IciclesCodes["playSelectedAnimation"] = 5] = "playSelectedAnimation";
    IciclesCodes[IciclesCodes["setColors"] = 50] = "setColors";
    IciclesCodes[IciclesCodes["setStripColor"] = 51] = "setStripColor";
    IciclesCodes[IciclesCodes["setIcicleColor"] = 52] = "setIcicleColor";
    IciclesCodes[IciclesCodes["setRowColor"] = 53] = "setRowColor";
    IciclesCodes[IciclesCodes["ICSetCustomAnimationFrame"] = 100] = "ICSetCustomAnimationFrame";
    IciclesCodes[IciclesCodes["ICSetCustomAnimationEnd"] = 101] = "ICSetCustomAnimationEnd";
    IciclesCodes[IciclesCodes["ICSetCustomAnimationDelayFrame"] = 102] = "ICSetCustomAnimationDelayFrame";
    // if custom aniamtion will be removed
    // if not custom animation will be removed till restart
    IciclesCodes[IciclesCodes["deleteAnimation"] = 200] = "deleteAnimation";
    IciclesCodes[IciclesCodes["restartESP"] = 255] = "restartESP";
})(IciclesCodes || (IciclesCodes = {}));
