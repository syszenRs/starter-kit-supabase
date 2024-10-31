type ServiceErrorDto = {
	errorMessage: string;
};

export type ServiceResponseDto<ResultType> = {
	statusCode: number;
	result: ResultType;
	error?: ServiceErrorDto;
};

export type ServiceSimpleResponseDto = {
	statusCode: number;
	error?: ServiceErrorDto;
};
