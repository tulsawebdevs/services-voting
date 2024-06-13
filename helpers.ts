import { SchemaValidationError } from "slonik";
import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function formatQueryErrorResponse(e: SchemaValidationError) {
	return e.issues.map(issue => ` ${issue.path} - ${issue.code} - ${issue.message} ||`)
}

export function validateRequest<T extends AnyZodObject>(schema: T) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			req.validated = result
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const formattedError = _formatZodError(error)
				console.log('ZodError: ', formattedError)
				return badRequest(formattedError, res)
			}
			console.log('Validation Error: ', error)
			return badRequest(JSON.stringify(error), res)
		}
	};
}

export function badRequest(message: string, res: Response) {
	return res.status(422).json({ message });
}

export function filterNullValues(obj: Record<string, any>) {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(([_, v]) => v != null)
	);
}

function _formatZodError(error: ZodError): string {
	return error.errors
		.map((issue) => `${issue.path.join('.')} - ${issue.message}`)
		.join(' || ');
}


export const TEST_USER = {
	userEmail: 'test_user@test.com',
	userFullName: 'Test User',
};

export class NotFoundError extends Error {
	constructor(message: string = "Not Found") {
		super(message);
		this.name = 'NotFoundError';
	}
}