import { CLIENT_ERROR_CODE } from '$constant/http-code';
import type { SuperformFormType } from '$serverDto/generic';
import type { ServiceOutputResultStructDto, ServiceOutputStructDto } from '$serverDto/service';
import type { SuperValidated } from 'sveltekit-superforms';

export function getDefaultServiceResultOutput<FormType extends SuperformFormType, ResponseDtoType>(
	form: SuperValidated<FormType>
): ServiceOutputResultStructDto<ResponseDtoType> {
	return {
		statusCode: CLIENT_ERROR_CODE.BAD_REQUEST,
		result: {
			form,
			response: undefined
		} as ResponseDtoType,
		error: undefined
	};
}

export function getDefaultServiceOutput(): ServiceOutputStructDto {
	return {
		statusCode: CLIENT_ERROR_CODE.BAD_REQUEST,
		error: undefined
	};
}
