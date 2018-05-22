import { IDeployment } from '../../../shared/types/deployment/deployment';
import { MockTeamMembers } from '../members/team-members';
import { PullRequestStatus } from '../../enums/deployment/pull-request-status';

export const MockDeployments: IDeployment[] = [
  {
    repo: {
      name: 'spizaetus',
      url: 'https://github.com/perch/spizaetus'
    },
    team: {
      name: 'Eagle',
      id: 1
    },
    branches: [
      {
        name: 'ornatus',
        pullRequest: {
          id: 123,
          status: PullRequestStatus.AwaitingApproval
        },
        assignee: MockTeamMembers[4],
        deleted: false
      },
      {
        name: 'tyrannus',
        pullRequest: {
          id: 125,
          status: PullRequestStatus.Merged
        },
        assignee: MockTeamMembers[5],
        deleted: false
      },
      {
        name: 'isidori',
        pullRequest: undefined,
        assignee: MockTeamMembers[5],
        deleted: false
      }
    ],
    integrationBranch: {
      name: 'int-10-29-18',
      pullRequest: {
        id: 123,
        status: PullRequestStatus.AwaitingApproval
      },
      assignee: MockTeamMembers[4],
      deleted: false
    },
    owner: MockTeamMembers[0],
    dateTime: new Date(2018, 10, 29, 13, 30, 0, 0),
    teamLocation: 'in-office',
    qa: [
      MockTeamMembers[10]
    ]
  },
];
