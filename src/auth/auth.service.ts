import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...result } = user;
    return result;
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(email: string): Promise<any> {
    // TODO: Implement forgot password logic
    return { message: 'Forgot password endpoint' };
  }
} 