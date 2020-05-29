import { ApiProperty } from '@nestjs/swagger';

export class HelloResponseSwaggerDto {
    @ApiProperty()
    public enabled: boolean;

    @ApiProperty()
    public prefix: string;
}
