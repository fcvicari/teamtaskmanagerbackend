import { compare, hash } from 'bcrypt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHash {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
