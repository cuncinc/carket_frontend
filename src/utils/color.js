const colors = [
  "chip-1",
  "chip-2",
  "chip-3",
  "chip-4",
  "chip-5",
  "chip-6",
  "chip-7",
  "chip-8",
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

export default {
  randomColor,
};
