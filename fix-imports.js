import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("./src"); // путь к твоему коду

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      callback(fullPath);
    }
  });
}

function fixImports(file) {
  let content = fs.readFileSync(file, "utf-8");

  // ищем "package@1.2.3" или "@scope/package@1.2.3"
  const newContent = content.replace(
    /(["'])(@?[^'"/]+(?:\/[^'"/]+)?)@\d+\.\d+\.\d+(["'])/g,
    (_, p1, pkg, p3) => `${p1}${pkg}${p3}`
  );

  if (content !== newContent) {
    console.log(`✔ Fixed imports in: ${file}`);
    fs.writeFileSync(file, newContent, "utf-8");
  }
}

walkDir(SRC_DIR, fixImports);

console.log("✅ All imports fixed!");
