import { ITeamMember } from '../../../shared/types/team/team-member';
import { TeamMemberRole } from '../../../shared/enums/team/member/role';

export const MockTeamMembers: ITeamMember[] = [
  // Leads
  {
    firstName: 'Edward',
    lastName: 'Davis',
    gitHubUserId: 100,
    role: TeamMemberRole.Lead
  },
  {
    firstName: 'Kimberly',
    lastName: 'Flores',
    gitHubUserId: 101,
    role: TeamMemberRole.Lead
  },
  {
    firstName: 'Alan',
    lastName: 'Turner',
    gitHubUserId: 102,
    role: TeamMemberRole.Lead
  },
  // Developers
  {
    firstName: 'Harry',
    lastName: 'Ward',
    gitHubUserId: 103,
    role: TeamMemberRole.Developer
  },
  {
    firstName: 'Sharon',
    lastName: 'Rogers',
    gitHubUserId: 104,
    role: TeamMemberRole.Developer
  },
  {
    firstName: 'Daniel',
    lastName: 'Diaz',
    gitHubUserId: 105,
    role: TeamMemberRole.Developer
  },
  {
    firstName: 'Tina',
    lastName: 'Perry',
    gitHubUserId: 106,
    role: TeamMemberRole.Developer
  },
  {
    firstName: 'Jerry',
    lastName: 'Hill',
    gitHubUserId: 107,
    role: TeamMemberRole.Developer
  },
  {
    firstName: 'Susan',
    lastName: 'Turner',
    gitHubUserId: 108,
    role: TeamMemberRole.Developer
  },
  // QAs
  {
    firstName: 'Julie',
    lastName: 'Coleman',
    gitHubUserId: 109,
    role: TeamMemberRole.QA
  },
  {
    firstName: 'Steven',
    lastName: 'Kelley',
    gitHubUserId: 110,
    role: TeamMemberRole.QA
  },
  {
    firstName: 'Diana',
    lastName: 'Stewart',
    gitHubUserId: 111,
    role: TeamMemberRole.QA
  }
];
