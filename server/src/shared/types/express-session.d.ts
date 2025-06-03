import 'express-session'

declare module 'express-session' {
	interface SessionData {
		userId?: string
		createdAt?: Date | string
	}
}

// declare module 'express' {
//   interface Request {
//     session: SessionData
//   }
// }