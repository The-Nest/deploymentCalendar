import { MemberRole } from '../../enums/member/role';

export interface IMember {
  firstName: string;
  lastName: string;
  gitHubUserId: number;
  role: MemberRole;
}
