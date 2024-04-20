import { SchemaValidationError } from "slonik";

export function formatQueryErrorResponse(e: SchemaValidationError){
	return e.issues.map(issue => ` ${issue.path} - ${issue.code} - ${issue.message} ||`)
}
