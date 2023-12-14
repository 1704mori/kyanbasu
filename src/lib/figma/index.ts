import type { FigmaFile, FigmaUser, RequestTokenResponse } from "./types";
import { auth } from "$lib/stores/auth";
import { get } from "svelte/store";

const FIGMA_API_URL = 'https://api.figma.com';

class FigmaAPI {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  async requestToken(code: string): Promise<RequestTokenResponse> {
    const url = new URL(`https://www.figma.com/api/oauth/token?/oauth/token`);

    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('client_secret', this.clientSecret);
    url.searchParams.append('redirect_uri', this.redirectUri);
    url.searchParams.append('code', code);
    url.searchParams.append('grant_type', 'authorization_code');

    try {
      const data = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const response = await data.json();
      return response;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw error;
    }
  }

  static async getMe(accessToken: string): Promise<FigmaUser> {
    const url = new URL(`${FIGMA_API_URL}/v1/me`);

    try {
      const data = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      });
      const response = await data.json();
      return response;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }

  static async getFile(fileId: string): Promise<[FigmaFile, Error | null]> {
    const url = new URL(`${FIGMA_API_URL}/v1/files/${fileId}`);
    const token = get(auth)?.accessToken;

    try {
      const data = await fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const response = await data.json();

      if (response.status && response.status !== 200) throw new Error(response.err);

      return [response, null];
    } catch (error: any) {
      console.error('Failed to get file:', error.response);
      return [null as any, new Error('Failed to get file')];
    }
  }
}

export default FigmaAPI;
