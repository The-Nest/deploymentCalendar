import * as fs from 'fs';
import * as https from 'https';
import * as jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';

export function getJwtToken(keyPath: string, issuerId: number): string {
  const pemCert = fs.readFileSync(keyPath);
  const issueSeconds = Math.floor(Date.now() / 1000);
  const expirySeconds = issueSeconds + 60;
  const payload = {
    iat: issueSeconds,
    exp: expirySeconds,
    iss: issuerId
  };
  return jwt.sign(payload, pemCert, { algorithm: 'RS256' });
}

export async function getInstallationAccessToken(installationId: number, token: string, userAgent: string): Promise<string> {
  const options: https.RequestOptions = {
    hostname: 'api.github.com',
    path: `/installations/${installationId}/access_tokens`,
    method: 'POST',
    headers: {
      'User-Agent': userAgent,
      'Accept': 'application/vnd.github.machine-man-preview+json',
      'Authorization': `Bearer ${token}`
    }
  };
  return new Promise<string>((resolve) => {
    const tokenRequest = https.request(options, (res: IncomingMessage) => {
      res.setEncoding('utf8');
      let fullBody = '';
      res.on('data', chunk => fullBody += chunk);
      res.on('end', () => resolve(JSON.parse(fullBody).token));
    });
    tokenRequest.end();
  });
}

function _getInstallationIdForOwner(owner: string, token: string, userAgent: string): Promise<number> {
  const options: https.RequestOptions = {
    hostname: 'api.github.com',
    path: `/app/installations`,
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
      'Accept': 'application/vnd.github.machine-man-preview+json',
      'Authorization': `Bearer ${token}`
    }
  };
  return new Promise<number>((resolve) => {
    const tokenRequest = https.request(options, (res: IncomingMessage) => {
      res.setEncoding('utf8');
      let fullBody = '';
      res.on('data', chunk => fullBody += chunk);
      res.on('end', () => {
        const jsonBody = JSON.parse(fullBody);
        const match = jsonBody.find(installation => installation.account.login === owner);
        resolve(match.id);
      });
    });
    tokenRequest.end();
  });
}
