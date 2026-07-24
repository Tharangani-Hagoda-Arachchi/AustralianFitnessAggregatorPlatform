import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
    definition: {
      openapi: '3.0.0', 
      info: {
        title: 'Australian Fitness Aggregator Platform',
        version: '1.0.0',
        description: 'API documentation with Swagger which used Australian Fitness Aggregator Platform',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT }`, // API server URL
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    apis: ['./routes/*.js'], // Path to the route files
  };

  const swaggerDocs = swaggerJSDoc(swaggerOptions);

  export {swaggerUi,swaggerDocs};