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
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            },
        },
        route: {
            url: '/docs',
            docs: '/swagger.json',
        },
        basedir: dirname,
        apis: ['src/dtos/*.ts', 'src/routes/*.ts'],
    };
}

module.exports = options;
