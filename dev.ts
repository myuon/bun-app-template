import process from "process";
import { watch } from "fs";

process.env.NODE_ENV = "development";

const startViteServer = () => {
  return Bun.spawn(["bun", "dev"], {
    cwd: "./web",
  });
};

const startBunServer = () => {
  return Bun.spawn(["bun", "index.ts"], {
    stdout: "inherit",
  });
};

const viteServer = startViteServer();
let bunServer = startBunServer();

console.log(`devServers started`);

const watcher = watch(
  import.meta.dir,
  { recursive: true },
  (event, filename) => {
    if (typeof filename === "string") {
      // restart backend server
      if (filename === "index.ts" || filename.startsWith("api/")) {
        console.log(`file ${filename} changed`);

        bunServer.kill();
        bunServer = startBunServer();
      }
    }
  }
);

process.on("SIGINT", () => {
  console.log("SIGINT received");
  watcher.close();
  viteServer.kill();
  bunServer.kill();

  process.exit(0);
});
