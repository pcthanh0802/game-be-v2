import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: number): Promise<User> {
    const user = await this.usersService.findOne({ where: { id: userId } });
    return user ?? null;
  }

  async generateJWT(userId: number): Promise<{ access_token: string }> {
    const user = await this.validateUser(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this._generateJWT(user);
  }

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const res = this._generateJWT(user);
      return { ...res, id: user.id };
    } else {
      throw new UnauthorizedException();
    }
  }

  private _generateJWT(user: User): { access_token: string } {
    const payload = {
      username: user.username,
      id: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
