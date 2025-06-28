import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { generateVideo } from 'csdm/node/video/generation/generate-video';
import { assertVideoGenerationIsPossible } from 'csdm/node/video/generation/assert-video-generation-is-possible';
import { isFfmpegInstalled } from 'csdm/node/video/ffmpeg/is-ffmpeg-installed';
import { installFfmpeg } from 'csdm/node/video/ffmpeg/install-ffmpeg';
import { isHlaeInstalled } from 'csdm/node/video/hlae/is-hlae-installed';
import { downloadHlae } from 'csdm/node/video/hlae/download-hlae';
import { getDefaultHlaeInstallationFolderPath } from 'csdm/node/video/hlae/hlae-location';
import type { AddVideoPayload } from 'csdm/common/types/video';

export class VideoCommand extends Command {
  public static Name = 'video';

  public getDescription() {
    return 'Generate video from demo using a configuration JSON file';
  }

  public printHelp() {
    console.log('Usage: csdm video <config.json>');
  }

  public async run() {
    await this.parseArgs();
    const jsonPath = this.args[0];
    if (!jsonPath) {
      this.printHelp();
      this.exitWithFailure();
    }

    const config: AddVideoPayload = await fs.readJson(jsonPath);
    await this.ensureDependencies(config);

    await generateVideo({
      ...config,
      videoId: uuidv4(),
      signal: new AbortController().signal,
      onGameStart: () => console.log('Game started'),
      onMoveFilesStart: () => console.log('Moving files'),
      onSequenceStart: (n) => console.log(`Processing sequence ${n}`),
      onConcatenateSequencesStart: () => console.log('Concatenating sequences'),
    });
  }

  private async ensureDependencies(config: AddVideoPayload) {
    try {
      await assertVideoGenerationIsPossible(config);
    } catch (error) {
      if (!(await isFfmpegInstalled())) {
        console.log('FFmpeg not installed, installing...');
        await installFfmpeg();
      }
      if (config.recordingSystem === 'HLAE' && !(await isHlaeInstalled())) {
        console.log('HLAE not installed, downloading...');
        await downloadHlae(getDefaultHlaeInstallationFolderPath());
      }
      await assertVideoGenerationIsPossible(config);
    }
  }
}
