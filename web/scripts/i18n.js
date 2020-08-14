const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

const resovle = file => path.join(__dirname, file);

const read = path => JSON.parse(fs.readFileSync(resovle(path)));

const write = (path, data) =>
  fs.writeFileSync(resovle(path), JSON.stringify(data, null, 2));

const mergeProperty = (a, b, reversse = false) => {
  const ksa = Object.keys(a);
  const ksb = Object.keys(b);

  for (let k of ksa) {
    if (typeof a[k] === "object") {
      if (!ksb.includes(k)) {
        b[k] = {};
      }
      mergeProperty(a[k], b[k]);
    } else {
      if (!ksb.includes(k)) {
        if (reversse) {
          a[k] = "--" + a[k];
        } else {
          b[k] = "!!" + a[k];
        }
      }
    }
  }
};

const sortProperty = a => {
  return Object.keys(a)
    .sort()
    .reduce((acc, k) => {
      acc[k] = a[k];
      return acc;
    }, {});
};

const path1 = args[0] || "../elite-wallet/zh.json";
const path2 = args[1] || "../elite-wallet/en.json";

const file1 = read(path1);
const file2 = read(path2);

mergeProperty(file1, file2);
mergeProperty(file2, file1, true);

write(path1, sortProperty(file1));
write(path2, sortProperty(file2));
