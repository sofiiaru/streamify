import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from 'src/modules/auth/account/models/user.model';
import { LoginInput } from 'src/modules/auth/session/inputs/login.input';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express'
import { GqlContext } from 'src/shared/types/gql-context.types';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  // Add Mutation for loginUser
   @Mutation(() => UserModel, { name: 'loginUser' })
    public async loginUser(@Context() { req }: GqlContext, @Args('data') input: LoginInput) {
      return this.sessionService.login(req, input);
    }


  // Add Mutation for logoutUser
  @Mutation(() => Boolean, { name: 'logoutUser' })
    public async logoutUser(@Context() { req }: GqlContext) {
      return this.sessionService.logout(req);
    }

  }
  
