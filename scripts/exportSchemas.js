const fs = require("fs");
const path = require("path");

// path to your models folder
const modelsDir = path.join(__dirname, "../src/models");

fs.readdir(modelsDir, (err, files) => {
  if (err) {
    console.error("Error reading models folder:", err);
    return;
  }

  const jsFiles = files.filter(f => f.endsWith(".js"));
  console.log("Found models:", jsFiles.join(", "));

  jsFiles.forEach(file => {
    const filePath = path.join(modelsDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    // remove newlines and extra spaces
    const compressed = content
      .replace(/\s+/g, " ") // replace multiple spaces/newlines with single space
      .trim();

    console.log(`=== ${file} ===`);
    console.log(compressed);
  });
});
