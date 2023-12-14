
import FigmaAPI from "$lib/figma";
import type { RequestEvent } from "./$types";

const figma = new FigmaAPI(
  import.meta.env.FIGMA_CLIENT_ID,
  import.meta.env.FIGMA_CLIENT_SECRET,
  import.meta.env.FIGMA_REDIRECT_URI
);

export async function GET(req: RequestEvent) {
  const code = req.url.searchParams.get('code');
  const state = req.url.searchParams.get('state');

  if (!code) {
    return new Response(JSON.stringify({ "result": "error" }), {
      headers: {
        'content-type': 'application/json',
      },
      status: 400,
    });
  }

  if (!state) {
    return new Response(JSON.stringify({ "result": "error" }), {
      headers: {
        'content-type': 'application/json',
      },
      status: 400,
    });
  }

  const { access_token, expires_in } = await figma.requestToken(code);

  return new Response(JSON.stringify({ "result": "ok" }), {
    headers: {
      'content-type': 'application/json',
      'set-cookie': `figma_access_token=${access_token}; expires=${new Date(Date.now() + expires_in * 1000).toUTCString()}; path=/; httponly;`,
    },
  });
};