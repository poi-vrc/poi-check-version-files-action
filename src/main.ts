import * as core from '@actions/core';
import fs from 'fs';
import path from 'path';

async function run(): Promise<void> {
  try {
    const versionTextFilePath: string = core.getInput('version-text-file-path');
    const packageJsonFilePath: string = core.getInput('package-json-file-path');

    if (versionTextFilePath === "" || packageJsonFilePath === "") {
      core.setFailed("Version text file path or package JSON file path is empty.");
      return;
    }

    let wsPath = <string>process.env.GITHUB_WORKSPACE;
    core.info("Workspace path: " + wsPath);

    let versionTextStr = <string><unknown>fs.readFileSync(path.join(wsPath, versionTextFilePath));
    let packageJsonStr = <string><unknown>fs.readFileSync(path.join(wsPath, packageJsonFilePath));

    core.info("Version text path: " + versionTextStr);
    core.info("Package JSON path: " + packageJsonStr);

    let packageJson = JSON.parse(packageJsonStr);

    core.info("Version text string: " + versionTextStr);
    core.info("Package JSON string: " + packageJson['version']);

    if (versionTextStr !== packageJson['version']) {
      core.setFailed('Version text does not match with package JSON version string.');
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
