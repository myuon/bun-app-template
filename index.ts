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

const insertBeforeBodyEnd = (html: string, content: string) => {
  return html.replace("</body>", `${content}</body>`);
};

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const isIndex = path === "/";
    if (isIndex) {
      const file = Bun.file("web/index.html");
      const html = await file.text();

      return new Response(insertBeforeBodyEnd(html, devServerIntegration), {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    } else {
      const file = Bun.file(path);
      if (!(await file.exists())) {
        return new Response("Not found", { status: 404 });
      }

      return new Response(file);
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
