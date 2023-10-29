const viteServer = Bun.spawn(["bun", "dev"], {
  cwd: "./web",
});

console.log(`vite dev server has been started`);

const bunServer = Bun.spawn(["bun", "index.ts"], {
  stdout: "inherit",
});

console.log(`bun server has been started`);

console.log(await new Response(bunServer.stdout).text());
