import fs from "fs";
import handlebars from "handlebars";
import path from "path";

const getView = (view: string, obj?: { [key: string]: string | number }) => {
  const p = path.join(
    "C:\\My-Projects\\Apps\\SketchNow\\SketchNow-Server\\src\\views",
    `${view}.html`,
  );
  const htmlstream = fs.createReadStream(p);

  const template = handlebars.compile(htmlstream);
  return template(obj);
};

export default getView;
