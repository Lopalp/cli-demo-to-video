# CS Demo Manager

Companion application for your Counter-Strike demos.

![Preview](https://github.com/akiver/cs-demo-manager/blob/main/preview.png)

## Links

[Download](https://cs-demo-manager.com/download)  
[User manual](https://cs-demo-manager.com/docs)  
[Developer manual](https://cs-demo-manager.com/docs/development/architecture)  
[Contributing](https://cs-demo-manager.com/docs/contributing)

## License

[MIT](https://github.com/akiver/cs-demo-manager/blob/main/LICENSE)

## CLI usage

The CLI provides a `video` command to convert demo files into videos.

```bash
csdm video path/to/demo.dem --output-folder path/to/output
```

You can also pass a directory containing multiple `.dem` files. The command
verifies HLAE and FFmpeg are installed before starting the encoding process.

### Video pipeline

When invoked, the command orchestrates the following steps:

1. Resolve the output folder based on your settings or the `--output-folder` flag.
2. Ensure [HLAE](https://advancedfx.org/downloads) and [FFmpeg](https://ffmpeg.org/) are available, downloading them if necessary.
3. Generate an `actions.json` file used by the recording system.
4. Inject `server.dll` and launch the game for a clean start.
5. After the demo finishes, combine the screenshots and audio captured by HLAE into the final video.

The implementation can be found in [`generate-demo-video.ts`](src/node/video/generate-demo-video.ts) and the [`video` command](src/cli/commands/video-command.ts).
