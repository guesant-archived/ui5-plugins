#!/usr/bin/env node
const { join, relative } = require("path");
const {
  existsSync,
  copyFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} = require("fs");
const { execSync } = require("child_process");
const { cwd, argv, chdir } = require("process");

const template = join(__dirname, "./create-new-plugin-files");

const isDir = (path) => {
  try {
    return statSync(path).isDirectory();
  } catch (_) {
    return false;
  }
};

const mkdir = (path) => !existsSync(path) && mkdirSync(path);

const recursiveCp = (from, to) => {
  if (isDir(from)) {
    mkdir(to);
    readdirSync(from)
      .map((i) => [join(from, i), join(to, i)])
      .forEach(([f, t]) => {
        recursiveCp(f, t);
      });
  } else {
    copyFileSync(from, to);
  }
};

async function main() {
  const [path] = argv.slice(2);
  if (!path) {
    return console.log(`invalid path`);
  }
  const dest = join(cwd(), path);
  if (existsSync(path)) {
    return console.log(`the path ${dest} already exists`);
  }
  recursiveCp(template, dest);

  const [pkg] = ["yarn", "npm"].filter((i) => {
    try {
      execSync(i + " --version", { shell: null, stdio: [-1, -1, -1] });
      return true;
    } catch (_) {
      return false;
    }
  });

  const cwd_ = cwd();
  if (pkg) {
    chdir(dest);
    try {
      execSync(`${pkg} init`, { stdio: [1, 1, 1] });
    } catch (_) {}
  }
  execSync("pnpm install", { stdio: [1, 1, 1] });

  chdir(cwd_);
  console.log(`\n$ cd ${relative(cwd(), dest)}`);
}

main();
