import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const isUserExist = await this.usersService.findByEmail(email);
    if (isUserExist) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
    });
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password or email isn"t valid');
    }

    const payload = { id: user._id };

    const access_token = await this.jwtService.signAsync(payload);
    const updatedUser = await this.usersService.updateWithToken(
      user._id,
      access_token,
    );

    const { _id, token } = updatedUser;
    return { _id, token };
  }
}
