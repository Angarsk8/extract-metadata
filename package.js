Package.describe({
  summary: 'Simple server method that finds images, page name and description from an url',
  version: '0.2.6',
  git: 'https://github.com/bitomule/simple-metacrawler.git',
  name: "bitomule:simple-metacrawler"
});

Npm.depends({
    'cheerio': '0.19.0',
    'request': '2.54.0',
    'iconv': '2.1.6'
});

Package.on_use(function (api) {

	if(api.versionsFrom) {
		api.versionsFrom('METEOR@0.9.0');
	}
	api.add_files('server/crawler.js', ['server']);

});
