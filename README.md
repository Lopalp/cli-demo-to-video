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

This refactored version focuses on a command line tool that only generates videos.

Run the `video` command with a path to a JSON configuration:

```sh
npm run dev:cli -- video example-video.json
```

An example configuration file is available at `example-video.json`.
