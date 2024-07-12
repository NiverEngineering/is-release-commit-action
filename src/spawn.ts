import {spawn} from 'child_process';

export type SpawnCommandOutput = {
  stdout: Array<string>;
  stderr: Array<string>;
};

export const spawnCommand: (command: string, ...args: Array<string>) => Promise<SpawnCommandOutput> = async (
  command,
  ...args
) => {
  const output: SpawnCommandOutput = {stdout: [], stderr: []};
  const spawned = spawn(command, args, {cwd: '/Users/nici/workspace/projects/bubblebuddy/arowana-divelog'});

  spawned.stdout.on('data', (data) => {
    output.stdout.push(data.toString());
  });

  spawned.stderr.on('data', (data) => {
    output.stderr.push(data.toString());
  });

  return new Promise((resolve, reject) => spawned.on('close', (exitCode) => (exitCode === 0 ? resolve(output) : reject(output))));
};
