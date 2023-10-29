export const echoHandler = async (req: Request, param: string) => {
  return new Response(JSON.stringify({ echo: param }), {
    headers: {
      "content-type": "application/json",
    },
  });
};
