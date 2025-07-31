import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

 async signup(data: { name: string; email: string; password: string; role?: Role }) {
  const existingUser = await this.userService.getUserByEmail(data.email);
  if (existingUser) {
    throw new BadRequestException('Email already in use');
  }
  return this.userService.createUser(data);
}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email); // We'll add this method in a later step if not present
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }
    let user = await this.userService.getUserByEmail(req.user.email);
    if (!user) {
      user = await this.userService.createUser({
        name: req.user.displayName,
        email: req.user.email,
        password: '', // No password for Google users
        role: 'USER',
      });
    }
    return this.login(user);
  }
}