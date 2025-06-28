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
