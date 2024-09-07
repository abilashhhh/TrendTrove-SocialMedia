import { Server as HttpServer } from "http";
import configurationKeys from "../../config";

const serverConfigurations = (server: HttpServer) => {
  const startServer = () => {
    server.listen(configurationKeys.PORT, () => {
      console.log(`Server listening on Port ${configurationKeys.PORT}`);
    });
  };

  return {
    startServer,
  };
};

export default serverConfigurations;
