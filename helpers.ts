import { SchemaValidationError } from "slonik";
import {AnyZodObject, z, ZodError} from "zod";
import {Request, Response, NextFunction} from "express";

declare global {
	namespace Express {
		interface Request {
			validated?: any;
		}
	}
}

export function formatQueryErrorResponse(e: SchemaValidationError){
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
				return badRequest(formattedError, res)
			}
			return badRequest(JSON.stringify(error), res)
		}
	};
}

export function badRequest(message: string, res: Response){
	return res.status(422).json({ message });
}

function _formatZodError(error: ZodError): string {
	return error.errors
		.map((issue) => `${issue.path.join('.')} - ${issue.message}`)
		.join(' || ');
}