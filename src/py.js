"use strict";

import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";

const PYTHON_FILENAME = "python.exe";
const PIP_FILENAME = "pip.exe";

// spawn
function S(filePath, args) {
  return new Promise(function (resolve, reject) {
    let stdout = "";
    let stderr = "";

    const child = spawn(filePath, args);

    child.stdout.on("data", function (data) {
      stdout += data.toString();
    });

    child.stderr.on("data", function (data) {
      stderr += data.toString();
    });

    child.on("error", function (err) {
      reject(err);
    });

    child.on("exit", function (code, signal) {
      resolve({ stdout, stderr });
    });
  });
}

function chkDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

function rmDir(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { force: true, recursive: true });
  }
}

class Py {
  /**
   *
   * @param {string} installPath default "."
   */
  constructor(installPath) {
    this.__installPath__ = installPath || ".";
    this.__venvPath__ = path.join(installPath, "venv");
    this.__scriptsPath__ = path.join(installPath, "venv", "Scripts");
    this.__pythonPath__ = path.join(
      installPath,
      "venv",
      "Scripts",
      PYTHON_FILENAME,
    );
    this.__pipPath__ = path.join(installPath, "venv", "Scripts", PIP_FILENAME);
    this.__isInitialized__ = this.isInitialized();
  }
}
Py.prototype.chkInit = function () {
  if (!this.__isInitialized__) {
    throw new Error("Py has not been initialized.");
  }
};
Py.prototype.isInitialized = function () {
  return (
    fs.existsSync(this.__installPath__) &&
    fs.existsSync(this.__venvPath__) &&
    fs.existsSync(this.__scriptsPath__) &&
    fs.existsSync(this.__pythonPath__) &&
    fs.existsSync(this.__pipPath__)
  );
};
/**
 * Check if venv is created.
 * @param {boolean} force Create venv after remove exists venv
 * @returns {Promise<void>}
 */
Py.prototype.init = async function (force) {
  if (!this.__isInitialized__) {
    chkDir(this.__installPath__);

    if (force) {
      rmDir(this.__venvPath__);
    }

    chkDir(this.__venvPath__);

    // create venv
    await S("python", ["-m", "venv", this.__venvPath__]);

    // check venv
    this.__isInitialized__ = this.isInitialized();

    if (!this.__isInitialized__) {
      throw new Error("Can not create venv.");
    }
  }
};
/**
 * Remove created venv.
 * @returns {Promise<void>}
 */
Py.prototype.destory = async function () {
  rmDir(this.__venvPath__);
  this.__isInitialized__ = this.isInitialized();
};
/**
 *
 * @returns {Promise<string>}
 */
Py.prototype.freeze = async function () {
  this.chkInit();

  const { stdout, stderr } = await S(this.__pipPath__, ["freeze"]);

  return stdout;
};
/**
 *
 * @returns {Promise<object[]>}
 */
Py.prototype.getModules = async function () {
  return (await this.freeze())
    .replace(/\r\n/g, "\n")
    .replace(/\n$/, "")
    .split(/\n/)
    .map(function (item) {
      return {
        name: item.split("==")[0],
        version: item.split("==")[1],
      };
    });
};
/**
 * Check if module is installed in venv.
 * @param {string} moduleName path or name
 * @param {array} args
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
Py.prototype.install = async function (moduleName, args) {
  this.chkInit();

  const res = await S(
    this.__pipPath__,
    ["install", moduleName].concat(args || []),
  );

  return res;
};
/**
 *
 * @param {string} moduleName
 * @returns {Promise<boolean>}
 */
Py.prototype.isInstalled = async function (moduleName) {
  this.chkInit();

  const { stdout, stderr } = await S(this.__pipPath__, ["freeze"]);
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);

  const lines = stdout.replace(/\r\n/g, "\n").split(/\n/);

  for (const line of lines) {
    if (line.indexOf(moduleName) === 0) {
      return true;
    }
  }
  return false;
};
/**
 *
 * @param {string} scriptPath
 * @param {array} args
 * @returns {Promise<{stdout: string, stderr: string}>}
 */
Py.prototype.exec = async function (scriptPath, args) {
  this.chkInit();

  const res = await S(this.__pythonPath__, [scriptPath].concat(args || []));

  return res;
};

export { Py };
