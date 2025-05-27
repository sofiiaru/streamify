// Define saveSession(req, user) to save userId and createdAt to req.session
import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

import type { User } from 'prisma/generated'

export function saveSession(
	req: Request,
	user: User,
) {
	return new Promise((resolve, reject) => {
		req.session.createdAt = new Date()
		req.session.userId = user.id

		req.session.save(err => {
			if (err) {
				return reject(
					new InternalServerErrorException(
						'Session was not saved'
					)
				)
			}

			resolve({ user })
		})
	})
}


// Define destroySession(req, configService) to destroy session and clear cookie
export function destroySession(req: Request, configService: ConfigService) {
	return new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				return reject(
					new InternalServerErrorException(
						'Session was not ended'
					)
				)
			}
			req.res?.clearCookie(
				configService.getOrThrow<string>('SESSION_NAME')
			)

			resolve(true)
		})
	})
}