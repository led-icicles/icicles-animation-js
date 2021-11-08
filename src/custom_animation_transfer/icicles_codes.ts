export enum IciclesCodes {
  // CLIENT_ACTIONS
  nextAnimation = 1,
  prevAnimation = 2,
  pauseAnimation = 3,
  playAnimation = 4,
  playSelectedAnimation = 5,
  setColors = 50,
  setStripColor = 51,
  setIcicleColor = 52,
  setRowColor = 53,

  ICSetCustomAnimationFrame = 100,
  ICSetCustomAnimationEnd = 101,
  ICSetCustomAnimationDelayFrame = 102,

  // if custom aniamtion will be removed
  // if not custom animation will be removed till restart
  deleteAnimation = 200,

  restartESP = 255,
}
