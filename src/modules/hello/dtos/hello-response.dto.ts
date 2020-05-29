import { ApiProperty } from '@nestjs/swagger';

import { HelloResponseSwaggerDto } from './hello-response-swagger.dto';

export class HelloResponseDto {
    @ApiProperty()
    public appVersion: string;

    @ApiProperty()
    public hostname: string;

    @ApiProperty()
    public swagger: HelloResponseSwaggerDto;
}
