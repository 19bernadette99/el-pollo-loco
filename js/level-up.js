const levels = [
  level1,
  level2,
  //   level3,
  //   level4,
  //   level5,
  //   level6,
  //   level7,
  //   level8,
  //   level9,
  //   level10,
  //   level11,
  //   level12,
  //   level13,
  //   level14,
  //   level15,
];

let currentLevelIndex = 0;

function checkAndSwitchLevel(world) {
  const level = world.level;
  if (level.checkLevelCompletion()) {
    showLevelUpOverlay(() => {
      currentLevelIndex++;
      if (currentLevelIndex < levels.length) {
        world.setLevel(levels[currentLevelIndex]);
      } else {
        console.log("🎉 Game finished! No more levels.");
        showGameFinishedOverlay();
      }
    });
  }
}
