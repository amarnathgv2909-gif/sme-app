import { PHOTO_GRADIENTS } from "../constants/colors.js";

export const gradFor = (seed) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % PHOTO_GRADIENTS.length;
  return PHOTO_GRADIENTS[h];
};
