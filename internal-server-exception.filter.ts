import { InternalServerErrorException, Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response,Request } from "express";
import { Translation } from "src/shared/utility/translation.utility";

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
	catch(exception: InternalServerErrorException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const request = ctx.getRequest<Request>();
		let lang = request.headers.language || request?.body?.language || request?.query?.language || request?.params?.language;

		const errors = this.filterResponse(exception.getResponse()["message"],lang);

		response
			.status(500)
			// you can manipulate the response here
			.json({
				statusCode: 500,
				message: errors[0].display_error,
				developer_errors: errors,
			});
	}

	filterResponse(message,lang="en") {
		console.log(message);
		let msg = [];
		msg.push(message);

		if (msg.length) {
			let result = [];
			for (let i = 0; i < msg.length; i++) {
				let errors = msg[i].split("&&&");
				if (errors.length > 2) {
					result.push({
						key: errors[1],
						error_type: "system",
						actual_error: Translation.Translater("en", "error", errors[0]),
						display_error: Translation.Translater(lang || "en", "error", errors[2]),
					});
				} else {
					result.push({
						key: errors[1],
						error_type: "ui",
						actual_error: Translation.Translater("en", "error", errors[0]),
						display_error: Translation.Translater(lang || "en", "error", errors[0]),
					});
				}
			}

			return result;
		}
	}
}
