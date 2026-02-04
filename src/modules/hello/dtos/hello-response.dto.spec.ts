import { HelloResponseDto } from './hello-response.dto';
import { HelloResponseSwaggerDto } from './hello-response-swagger.dto';

describe('HelloResponseDto', () => {
    it('should create an instance with default values', () => {
        const dto = new HelloResponseDto();
        
        expect(dto).toBeDefined();
        expect(dto.appVersion).toBeUndefined();
        expect(dto.hostname).toBeUndefined();
        expect(dto.swagger).toBeUndefined();
    });

    it('should create an instance with provided values', () => {
        const swaggerDto = new HelloResponseSwaggerDto();
        swaggerDto.enabled = true;
        swaggerDto.prefix = '/docs';

        const dto = new HelloResponseDto();
        dto.appVersion = '2.0.0';
        dto.hostname = 'test-hostname';
        dto.swagger = swaggerDto;

        expect(dto.appVersion).toBe('2.0.0');
        expect(dto.hostname).toBe('test-hostname');
        expect(dto.swagger.enabled).toBe(true);
        expect(dto.swagger.prefix).toBe('/docs');
    });

    it('should accept different swagger configurations', () => {
        const swaggerDto = new HelloResponseSwaggerDto();
        swaggerDto.enabled = false;
        swaggerDto.prefix = '/api-docs';

        const dto = new HelloResponseDto();
        dto.appVersion = '1.0.0';
        dto.hostname = 'another-host';
        dto.swagger = swaggerDto;

        expect(dto.swagger.enabled).toBe(false);
        expect(dto.swagger.prefix).toBe('/api-docs');
    });
});
