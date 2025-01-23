import dotenv from "dotenv";

import dev from "../../appsettings.developmnet.json";
import prod from "../../appsettings.json";

dotenv.config();

type ConfigType = {
  ChartsDataPath: string;
};

const Config: ConfigType = process.env.NODE_ENV == "development" ? dev : prod;

export class AppConfig {
  static ChartsDataPath = Config.ChartsDataPath;

  static IsDevelopment() {
    return process.env.NODE_ENV == "development";
  }
}
