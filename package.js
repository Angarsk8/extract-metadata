Package.describe({
    summary: 'Fork of the simple-metacrawler meteor package',
    version: '0.0.1',
    git: 'https://github.com/Angarsk8/extract-metadata.git',
    name: "agarcia038:extract-metadata"
});

Npm.depends({
    'cheerio': '0.19.0',
    'request': '2.54.0',
    'iconv': '2.1.6'
});

Package.on_use(function(api) {
    api.versionsFrom("1.0.1");
    api.use(["meteorhacks:async@1.0.0"]);
    api.add_files('server/crawler.js', ['server']);
});
