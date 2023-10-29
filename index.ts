const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const file = Bun.file(
      // spa fallback
      path === "/" ? "index.html" : path
    );
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(file);
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
