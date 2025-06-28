import fs from 'fs-extra';
import { glob } from 'csdm/node/filesystem/glob';
import { Command } from './command';
import { generateDemoVideo } from 'csdm/node/video/generate-demo-video';

export class VideoCommand extends Command {
  public static Name = 'video';
  private demoPaths: string[] = [];
  private outputFolderPath: string | undefined;
  private readonly outputFlag = '--output-folder';

  public getDescription() {
    return 'Create videos from demo files.';
  }

  public printHelp() {
    console.log(this.getDescription());
    console.log('');
    console.log(`Usage: csdm ${VideoCommand.Name} demoPaths... ${this.formatFlagForHelp(this.outputFlag)}`);
    console.log('');
    console.log('Demos path can be either .dem files or a directory containing demos.');
    console.log(`The ${this.outputFlag} flag sets the directory where videos will be saved.`);
  }

  public async run() {
    await this.parseArgs();
    if (this.demoPaths.length === 0) {
      console.log('No demos found');
      this.exitWithFailure();
    }

    for (const demoPath of this.demoPaths) {
      console.log(`Creating video from ${demoPath}`);
      await generateDemoVideo({ demoPath, outputFolderPath: this.outputFolderPath });
    }
  }

  protected async parseArgs() {
    super.parseArgs(this.args);
    if (this.args.length === 0) {
      console.log('No demo path provided');
      this.printHelp();
      this.exitWithFailure();
    }

    for (let index = 0; index < this.args.length; index++) {
      const arg = this.args[index];
      if (this.isFlagArgument(arg)) {
        switch (arg) {
          case this.outputFlag:
            if (this.args.length > index + 1) {
              index += 1;
              this.outputFolderPath = this.args[index];
            } else {
              console.log(`Missing ${this.outputFlag} value`);
              this.exitWithFailure();
            }
            break;
          default:
            console.log(`Unknown flag: ${arg}`);
            this.exitWithFailure();
        }
      } else {
        try {
          const stats = await fs.stat(arg);
          if (stats.isDirectory()) {
            const files = await glob('*.dem', { cwd: arg, absolute: true });
            this.demoPaths.push(...files);
          } else if (stats.isFile() && arg.endsWith('.dem')) {
            this.demoPaths.push(arg);
          } else {
            console.log(`Invalid path: ${arg}`);
            this.exitWithFailure();
          }
        } catch {
          console.log(`Invalid path: ${arg}`);
          this.exitWithFailure();
        }
      }
    }
  }
}
