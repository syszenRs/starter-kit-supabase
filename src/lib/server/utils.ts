import { CLIENT_ERROR_CODE } from '$constant/http-code';
import type { ServiceOutputResultStructDto, ServiceOutputStructDto } from '$serverDto/service';

export function getDefaultServiceResultOutput<ResponseDtoType>(resultDefault: ResponseDtoType): ServiceOutputResultStructDto<ResponseDtoType> {
	return {
		statusCode: CLIENT_ERROR_CODE.BAD_REQUEST,
		result: resultDefault,
		error: undefined
	};
}

export function getDefaultServiceOutput(): ServiceOutputStructDto {
	return {
		statusCode: CLIENT_ERROR_CODE.BAD_REQUEST,
		error: undefined
	};
}
