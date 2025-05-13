import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { hash } from 'argon2';

@Injectable()
export class AccountService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll() {
      return this.prismaService.user.findMany();
    }

    public async create(input: CreateUserInput) {
      // Destructure username, email, password from input
      const { username, email, password } = input

      // Check if username or email already exists in the database
      // If yes, throw ConflictException
      const isUsernameExists = await this.prismaService.user.findUnique({
        where: {
          username
        }
      })

      if(isUsernameExists) {
        throw new ConflictException ('This username is already taken')
      }

      const isEmailExists = await this.prismaService.user.findUnique({
        where: {
          email
        }
      })

      if(isEmailExists) {
        throw new ConflictException ('The account with this email already exists')
      }
    
      // Create new user with:
      // - hashed password, email, default displayName from username
      const user = await this.prismaService.user.create({
        data: {
          username,
          email,
          password: await hash(password),
          displayName: username,
        }

      })
      
      return true
    }
}


