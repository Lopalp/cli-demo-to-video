import { randomUUID } from 'node:crypto';
import { getDemoFromFilePath } from 'csdm/node/demo/get-demo-from-file-path';
import { getSettings } from 'csdm/node/settings/get-settings';
import { getOutputFolderPath } from 'csdm/node/video/get-output-folder-path';
import { generateVideo } from 'csdm/node/video/generation/generate-video';
import { isHlaeInstalled } from 'csdm/node/video/hlae/is-hlae-installed';
import { downloadHlae } from 'csdm/node/video/hlae/download-hlae';
import { getDefaultHlaeInstallationFolderPath } from 'csdm/node/video/hlae/hlae-location';
import { isFfmpegInstalled } from 'csdm/node/video/ffmpeg/is-ffmpeg-installed';
import { installFfmpeg } from 'csdm/node/video/ffmpeg/install-ffmpeg';
import type { Sequence } from 'csdm/common/types/sequence';

export type GenerateDemoVideoOptions = {
  demoPath: string;
  outputFolderPath?: string;
};

export async function generateDemoVideo({ demoPath, outputFolderPath }: GenerateDemoVideoOptions) {
  const demo = await getDemoFromFilePath(demoPath);
  const settings = await getSettings();
  const videoSettings = settings.video;

  const outputPath = outputFolderPath ?? (await getOutputFolderPath(videoSettings, demoPath));

  if (videoSettings.recordingSystem === 'HLAE' && !(await isHlaeInstalled())) {
    const folderPath = getDefaultHlaeInstallationFolderPath();
    await downloadHlae(folderPath);
  }

  if (videoSettings.encoderSoftware === 'FFmpeg' && !(await isFfmpegInstalled())) {
    await installFfmpeg();
  }

  const sequence: Sequence = {
    number: 1,
    startTick: 1,
    endTick: demo.tickCount,
    showXRay: videoSettings.showXRay,
    showOnlyDeathNotices: videoSettings.showOnlyDeathNotices,
    playersOptions: [],
    cameras: [],
    playerVoicesEnabled: videoSettings.playerVoicesEnabled,
    deathNoticesDuration: videoSettings.deathNoticesDuration,
  };

  await generateVideo({
    videoId: randomUUID(),
    checksum: demo.checksum,
    game: demo.game,
    tickrate: demo.tickrate,
    recordingSystem: videoSettings.recordingSystem,
    recordingOutput: videoSettings.recordingOutput,
    encoderSoftware: videoSettings.encoderSoftware,
    framerate: videoSettings.framerate,
    width: videoSettings.width,
    height: videoSettings.height,
    closeGameAfterRecording: videoSettings.closeGameAfterRecording,
    concatenateSequences: false,
    ffmpegSettings: videoSettings.ffmpegSettings,
    outputFolderPath: outputPath,
    demoPath,
    sequences: [sequence],
    signal: new AbortController().signal,
    onGameStart: () => console.log('Game started'),
    onMoveFilesStart: () => console.log('Moving files'),
    onSequenceStart: (num) => console.log(`Encoding sequence ${num}`),
    onConcatenateSequencesStart: () => console.log('Concatenating sequences'),
  });
}
