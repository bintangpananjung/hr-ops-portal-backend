import { Expose } from 'class-transformer';

export class AuthenticatedUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  accessToken: string;

  constructor(partial: Partial<AuthenticatedUserDto>) {
    Object.assign(this, partial);
  }
}
