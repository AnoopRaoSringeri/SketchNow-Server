import dotenv from "dotenv";

import dev from "../../appsettings.developmnet.json";
import docker from "../../appsettings.docker.json";
import prod from "../../appsettings.json";

dotenv.config();

type ConfigType = {
  ChartsDataPath: string;
};

let Config: ConfigType;

if (process.env.NODE_ENV == "development") {
  Config = dev;
} else if (process.env.NODE_ENV == "docker") {
  Config = docker;
} else {
  Config = prod;
}

export class AppConfig {
  static ChartsDataPath = Config.ChartsDataPath;

  static Environment() {
    return process.env.NODE_ENV;
  }

  static IsDevelopment() {
    return process.env.NODE_ENV == "development";
  }

  static IsDocker() {
    return process.env.NODE_ENV == "docker";
  }
}
