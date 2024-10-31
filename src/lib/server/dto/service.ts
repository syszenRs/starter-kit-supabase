type ServiceErrorDto = {
	errorMessage: string;
};

export type ServiceOutputResultStructDto<ResultType> = {
	statusCode: number;
	result: ResultType;
	error?: ServiceErrorDto;
};

export type ServiceOutputResultDto<ResultType> = Promise<ServiceOutputResultStructDto<ResultType>>;

export type ServiceOutputDto = {
	statusCode: number;
	error?: ServiceErrorDto;
};
