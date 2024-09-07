declare module 'clarifai' {
    // Declare the parts of the Clarifai module that you are using.
    export class App {
      constructor(options: { apiKey: string });
      models: {
        predict(modelId: string, imageUrl: string): Promise<any>;
      };
    }
    export const GENERAL_MODEL: string;
  }
  