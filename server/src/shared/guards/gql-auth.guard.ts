import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		// ❗️Check if session userId exists
		console.log(request.session);
		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('User is not authorized')
		}

		// ❗️Ensure user exists in DB
		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId,
			},
		})

		// Optionally: Handle deleted users or edge cases
		if (!user) {
			throw new UnauthorizedException('User is not found')
		}

		// 🔐 Attach user to request
		request.user = user

		return true
	}
}
