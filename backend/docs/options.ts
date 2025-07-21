export const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Сервис контроля качества",
            version: "0.0.1",
            description:
                "Данный сервис определяет основные API методы",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Dmitriy Prokhorov",
                email: "dmitriy.prokhorov.04@gmail.com",
            },

        },
        servers: [
            {
                url: "http://localhost:8080",
                description: 'Development server'
            },
        ],
        produces: [
            "application/json"
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
    apis: ["**/*.ts"]
}
