import { Module } from '@nestjs/common';
import { ApolloDriver } from "@nestjs/apollo";
import { PrismaModule } from "./prisma/prisma.module";
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getGraphQLConfig } from "./config/graphql.config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getGraphQLConfig,
    }),
    PrismaModule
  ],
})

export class CoreModule {}