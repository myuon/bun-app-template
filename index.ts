import { echoHandler } from "./api/echo";

const isDev = process.env.NODE_ENV === "development";

const devServerIntegration = `
<!-- 開発環境 -->
<script type="module">
  import RefreshRuntime from 'http://localhost:5173/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="http://localhost:5173/@vite/client"></script>
<script type="module" src="http://localhost:5173/src/main.tsx"></script>
`;
const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

const insertBeforeBodyEnd = (html: string, content: string) => {
  return html.replace("</body>", `${content}</body>`);
};

const server = Bun.serve({
  port: isDev ? 3000 : 3999,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (path.startsWith("/api")) {
      const [handlerName, ...params] = path.split("/api/")[1].split("/");
      if (handlerName === "echo") {
        return echoHandler(req, params[0]);
      } else {
        return new Response("Not found", { status: 404 });
      }
    }

    if (isDev) {
      if (path === "/") {
        return new Response(insertBeforeBodyEnd(html, devServerIntegration), {
          headers: {
            "content-type": "text/html",
          },
        });
      }

      return new Response(null, {
        status: 301,
        headers: {
          location: `http://localhost:5173${path}`,
        },
      });
    } else {
      const file = Bun.file(`./web/dist${path === "/" ? "/index.html" : path}`);
      if (!file.exists()) {
        return new Response("Not found", { status: 404 });
      }

      return new Response(file);
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
