import { MemberRole } from '../../enums/member/role';
import { IMember } from '../../types/member/member';

export const MockMembers: IMember[] = [
  // Leads
  {
    firstName: 'Edward',
    lastName: 'Davis',
    gitHubUserId: 100,
    role: MemberRole.Lead
  },
  {
    firstName: 'Kimberly',
    lastName: 'Flores',
    gitHubUserId: 101,
    role: MemberRole.Lead
  },
  {
    firstName: 'Alan',
    lastName: 'Turner',
    gitHubUserId: 102,
    role: MemberRole.Lead
  },
  // Developers
  {
    firstName: 'Harry',
    lastName: 'Ward',
    gitHubUserId: 103,
    role: MemberRole.Developer
  },
  {
    firstName: 'Sharon',
    lastName: 'Rogers',
    gitHubUserId: 104,
    role: MemberRole.Developer
  },
  {
    firstName: 'Daniel',
    lastName: 'Diaz',
    gitHubUserId: 105,
    role: MemberRole.Developer
  },
  {
    firstName: 'Tina',
    lastName: 'Perry',
    gitHubUserId: 106,
    role: MemberRole.Developer
  },
  {
    firstName: 'Jerry',
    lastName: 'Hill',
    gitHubUserId: 107,
    role: MemberRole.Developer
  },
  {
    firstName: 'Susan',
    lastName: 'Turner',
    gitHubUserId: 108,
    role: MemberRole.Developer
  },
  // QAs
  {
    firstName: 'Julie',
    lastName: 'Coleman',
    gitHubUserId: 109,
    role: MemberRole.QA
  },
  {
    firstName: 'Steven',
    lastName: 'Kelley',
    gitHubUserId: 110,
    role: MemberRole.QA
  },
  {
    firstName: 'Diana',
    lastName: 'Stewart',
    gitHubUserId: 111,
    role: MemberRole.QA
  }
];
