import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from 'src/modules/auth/account/models/user.model';
import { LoginInput } from 'src/modules/auth/session/inputs/login.input';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express'

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  // Add Mutation for loginUser
   @Mutation(() => UserModel, { name: 'loginUser' })
    public async loginUser(@Context('req') req: Request, @Args('data') input: LoginInput) {
      return this.sessionService.login(req, input);
    }


  // Add Mutation for logoutUser
  @Mutation(() => UserModel, { name: 'logoutUser' })
    public async logoutUser(@Context('req') req: Request, configService: ConfigService) {
      return this.sessionService.logout(req, configService);
    }

  }
  
