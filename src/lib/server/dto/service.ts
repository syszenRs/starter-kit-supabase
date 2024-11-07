type ServiceErrorDto = {
	errorMessage: string;
};

export type ServiceOutputResultStructDto<ResultType> = {
	statusCode: number;
	data: ResultType;
	error?: ServiceErrorDto;
};

export type ServiceOutputStructDto = {
	statusCode: number;
	error?: ServiceErrorDto;
};

export type ServiceOutputResultDto<ResultType> = Promise<ServiceOutputResultStructDto<ResultType>>;

export type ServiceOutputDto = Promise<ServiceOutputStructDto>;
