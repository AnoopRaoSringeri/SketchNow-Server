import fs from "fs";

const serverOptions = {
  key: fs.existsSync("../../cert/key.pem")
    ? fs.readFileSync("../../cert/key.pem")
    : "",
  cert: fs.existsSync("../../cert/cert.pem")
    ? fs.readFileSync("../../cert/cert.pem")
    : "",
};

export default serverOptions;
