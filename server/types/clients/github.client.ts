export interface IGitHubClient {
  restRequest(method: string, url: string, accessToken: string, body?: any): Promise<IRestResponse>;
  graphQLRequest(query: string, accessToken: string): Promise<IGraphQLResponse>;

  getAccessToken(clientId: string, clientSecret: string, code: string, state: string): Promise<any>;
  getAuthorizationForToken(clientId: string, clientSecret: string, accessToken: string): Promise<IRestResponse>;
}

export interface IRestResponse {
  data?: any;
  error?: any;
  statusCode: number;
}

export interface IGraphQLResponse {
  data?: any;
  errors?: any[];
  statusCode: number;
}
