
import { FIGMA_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_FIGMA_CLIENT_ID, PUBLIC_FIGMA_REDIRECT_URI } from "$env/static/public";
import FigmaAPI from "$lib/figma";
import type { RequestEvent } from "./$types";

const figma = new FigmaAPI(
  PUBLIC_FIGMA_CLIENT_ID,
  FIGMA_CLIENT_SECRET,
  PUBLIC_FIGMA_REDIRECT_URI
);

export async function GET(req: RequestEvent) {
  const code = req.url.searchParams.get('code');
  const state = req.url.searchParams.get('state');

  if (!code) {
    return new Response(JSON.stringify({ "result": "error" }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 400,
    });
  }

  if (!state) {
    return new Response(JSON.stringify({ "result": "error" }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 400,
    });
  }

  const { access_token, expires_in } = await figma.requestToken(code);
  console.log({ access_token, expires_in });

  return new Response(undefined, {
    headers: {
      'Content-Type': 'application/json',
      'set-cookie': `figma_access_token=${access_token}; expires=${new Date(Date.now() + expires_in * 1000).toUTCString()}; path=/;`,
      'Location': '/',
    },
    status: 302,
  });
};