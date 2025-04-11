interface ExecuteRequestDto {
    taskDefinitionId?: number;
    fakePrice?: number;
}

interface ExecuteResponseDto {
    message: string;
    proofOfTask?: string;
    data?: number;
    taskDefinitionId?: string;
}
