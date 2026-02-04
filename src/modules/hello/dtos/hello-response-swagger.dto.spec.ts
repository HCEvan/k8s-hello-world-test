import { HelloResponseSwaggerDto } from './hello-response-swagger.dto';

describe('HelloResponseSwaggerDto', () => {
    it('should create an instance with default values', () => {
        const dto = new HelloResponseSwaggerDto();
        
        expect(dto).toBeDefined();
        expect(dto.enabled).toBeUndefined();
        expect(dto.prefix).toBeUndefined();
    });

    it('should create an instance with provided values', () => {
        const dto = new HelloResponseSwaggerDto();
        dto.enabled = true;
        dto.prefix = '/docs';

        expect(dto.enabled).toBe(true);
        expect(dto.prefix).toBe('/docs');
    });

    it('should accept boolean false for enabled', () => {
        const dto = new HelloResponseSwaggerDto();
        dto.enabled = false;
        dto.prefix = '/swagger';

        expect(dto.enabled).toBe(false);
        expect(dto.prefix).toBe('/swagger');
    });

    it('should accept different prefix values', () => {
        const testCases = [
            '/docs',
            '/api-docs',
            '/swagger',
            '/api/v1/docs',
            '',
        ];

        testCases.forEach(prefix => {
            const dto = new HelloResponseSwaggerDto();
            dto.enabled = true;
            dto.prefix = prefix;

            expect(dto.prefix).toBe(prefix);
        });
    });
});
