export function run (timeLeft: number) {
  const h = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);

  return `${h}h ${m}m ${s}s`;
}
