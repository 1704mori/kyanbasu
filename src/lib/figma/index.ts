import type { FigmaFile, FigmaUser, RequestTokenResponse } from "./types";

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

  static async getFile(accessToken: string, fileId: string): Promise<FigmaFile> {
    const url = new URL(`${FIGMA_API_URL}/v1/files/${fileId}`);

    try {
      const data = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      });
      const response = await data.json();
      return response;
    } catch (error) {
      console.error('Failed to get file:', error);
      throw error;
    }
  }
}

export default FigmaAPI;
