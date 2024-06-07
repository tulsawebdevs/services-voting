import { SchemaValidationError } from "slonik";
import {AnyZodObject, ZodError} from "zod";
import {Request, Response, NextFunction} from "express";
import {Draft, DraftBody} from "./types/draft";
import DraftsService from './services/drafts';

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

export function filterNullValues(obj: Record<string, any>) {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(([_, v]) => v != null)
	);
}

export async function handleDraftUpdate(
	recordId: number,
	body: DraftBody,
	res: Response
) {
	try {
		const result = await DraftsService.update(recordId, body);
		if (result.rowCount === 0) {
			return res.status(404).json({ message: 'Draft not found' });
		}

		let draft = await DraftsService.show(recordId);
		draft = filterNullValues(draft) as Draft;
		return res.status(200).json(draft);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'Server Error' });
	}
}

function _formatZodError(error: ZodError): string {
	return error.errors
		.map((issue) => `${issue.path.join('.')} - ${issue.message}`)
		.join(' || ');
}
