import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginInput } from 'src/modules/auth/session/inputs/login.input';
import { destroySession, saveSession } from 'src/shared/utils/session.util';
import type { Request } from 'express'

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}
  // Accept req and LoginInput (use PrismaService from constructor)
  public async login(req: Request, input: LoginInput) {
    const { login, password } = input;

    // Find user by login (username or email)
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: { equals: login }}, 
          { email: { equals: login }}
        ],
      },
    });

    // If not found → throw NotFoundException
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    // Validate password (use verify from argon2)
    const passwordValid = await verify(user.password, password);

    // If invalid → throw UnauthorizedException
    if (!passwordValid) {
      throw new UnauthorizedException('Password is not valid');
    }

    // If valid → call saveSession(req, user)
    console.log(req, user);
    saveSession(req, user);
    console.log('saved');
    return user;
  }

  public async logout(req: Request) {
    return destroySession(req, this.configService);
  }
}
