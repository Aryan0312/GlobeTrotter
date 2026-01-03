import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GlobeTrotter API',
      version: '1.0.0',
      description: 'A travel website for personalised travel solutions',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            first_name: {
              type: 'string',
              description: 'First name'
            },
            last_name: {
              type: 'string',
              description: 'Last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            phone: {
              type: 'string',
              description: 'Phone number'
            },
            city: {
              type: 'string',
              description: 'City'
            },
            country: {
              type: 'string',
              description: 'Country'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controller/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;