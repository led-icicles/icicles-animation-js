import { Animation } from "../src";

const main = async () => {
  await Animation.fromFile("performance/darkening.anim");
  await Animation.fromFile("performance/darkening.anim");
  await Animation.fromFile("performance/darkening.anim");
  await Animation.fromFile("performance/darkening.anim");
  await Animation.fromFile("performance/darkening.anim");
  await Animation.fromFile("performance/darkening.anim");
  await Animation.fromFile("performance/darkening.anim");

  await Animation.fromFile("performance/eksplozja-kulek-optimized-rgb565.anim");
  await Animation.fromFile("performance/eksplozja-kulek-optimized-rgb565.anim");
  await Animation.fromFile("performance/eksplozja-kulek-optimized-rgb565.anim");
  await Animation.fromFile("performance/eksplozja-kulek-optimized-rgb565.anim");
  await Animation.fromFile("performance/eksplozja-kulek-optimized-rgb565.anim");
  await Animation.fromFile("performance/eksplozja-kulek-optimized-rgb565.anim");
  await Animation.fromFile("performance/eksplozja-kulek-optimized-rgb565.anim");
};

main();
