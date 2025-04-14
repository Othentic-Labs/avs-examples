interface ExecuteRequestDto {
    taskDefinitionId?: number;
    fakePrice?: number;
    targetChainId?: number;
}

interface ExecuteResponseDto {
    message: string;
    proofOfTask?: string;
    data?: number;
    taskDefinitionId?: string;
}
