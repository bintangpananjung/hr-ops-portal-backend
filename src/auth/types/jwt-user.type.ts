import { RoleName } from 'src/common/enums/role.enum';

export interface JwtUser {
  sub: string;
  email: string;
  roles: RoleName[];
}
