import { TeamMemberRole } from '../../enums/team/member/role';

export interface ITeamMember {
  firstName: string;
  lastName: string;
  gitHubUserId: number;
  role: TeamMemberRole;
}
