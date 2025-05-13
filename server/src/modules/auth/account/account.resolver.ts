import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './inputs/create-user.input';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserModel], { name: 'findAllUsers' })
  public async findAll() {
    return this.accountService.findAll()
  }

  @Mutation(() => Boolean, { name: 'createUser' })
  public async create(@Args('data') input: CreateUserInput) {
	// Call accountService.create with input and return result
    return this.accountService.create({
      email: input.email,
      password: input.password,
      username: input.username 
    });
  }

}
