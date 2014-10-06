Package.describe({
  summary: 'Simple server method that finds images, page name and description from an url',
  version: '0.1.9',
  git: 'https://github.com/bitomule/simple-metacrawler.git',
  name: "bitomule:simple-metacrawler"
});

Npm.depends({
    'cheerio': '0.17.0',
    'request': '2.44.0'
});

Package.on_use(function (api) {

	if(api.versionsFrom) {
		api.versionsFrom('METEOR@0.9.0');
	}
	api.add_files('server/crawler.js', ['server']);

});