import { echoHandler } from "./api/echo";

const devServerIntegration = `
<!-- 開発環境 -->
<script type="module" src="http://localhost:5173/@vite/client"></script>
<script type="module" src="http://localhost:5173/src/main.tsx"></script>
`;

const insertBeforeBodyEnd = (html: string, content: string) => {
  return html.replace("</body>", `${content}</body>`);
};

const server = Bun.serve({
  port: 3000,
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

    const resp = await fetch(`http://localhost:5173${path}`);
    if (path === "/") {
      const html = await resp.text();
      return new Response(insertBeforeBodyEnd(html, devServerIntegration), {
        headers: {
          "content-type": "text/html",
        },
      });
    } else {
      return resp;
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
