export interface IDeploymentPayload {
  name: string;
  teamId: number;
  repo: {
    owner: string;
    name: string;
  };
  dateTime: Date;
  owner: string;
}
