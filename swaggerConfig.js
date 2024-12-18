const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Short URL Service API",
      version: "1.0.0",
      description: "API documentation for the Short URL Service",
    },
    servers: [
      {
        url: process.env.BASE,
      },
    ],
  },
  apis: ["./route/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = swaggerDocs;
