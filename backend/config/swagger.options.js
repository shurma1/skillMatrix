const options = (dirname) => {
    return {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: 'Skill matrix service',
                description: 'This service defines the main API methods',
                version: '1.0.0',
                contact: {
                    name: "Dmitriy Prokhorov",
                    email: "dmitriy.prokhorov.04@gmail.com",
                }
            },
            host: 'localhost:8080',
            basePath: '/',
            produces: [
                "application/json",
            ],
            schemes: ['http'],
            // Swagger 2.0 style (kept for compatibility with tooling that still reads it)
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            },
            // OpenAPI 3.0 security scheme used by swagger-ui to show the Authorize button
            components: {
                securitySchemes: {
                    JWT: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Input your JWT as: Bearer <token>'
                    }
                }
            },
        },
        route: {
            url: '/docs',
            docs: '/swagger.json',
        },
        basedir: dirname,
    apis: ['src/dtos/*.ts', 'src/routes/*.ts'], // includes x-permissions via JSDoc @openapi
    };
}

module.exports = options;
