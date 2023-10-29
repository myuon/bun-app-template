Bun.spawn(["rm", "-r", "dist"], {
  cwd: "./web",
});

Bun.spawn(["bun", "run", "build"], {
  cwd: "./web",
});
