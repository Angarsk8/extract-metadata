Meteor.methods({
		'simplecrawler_findMetadata': function findMetada(url) {
			this.unblock();
			var cheerio = Npm.require('cheerio');
			var iconv = Npm.require('iconv');
			var request = Npm.require('request');

			var endsWithExtensionRegex = /\..{2,4}$/i;
			if(endsWithExtensionRegex.text(url)){
				var excluderRegex = /\.(es|com|net|edu|gov|uk|net|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|mil|jpg|png|jpeg|gif|php|asp)+$/i;
				if(!excluderRegex.test(url)){
					return {error:"Can't crawl files"};
				}
			}
			try{
				var urlResponse = Async.runSync(function(done) {
					request(url, {rejectUnauthorized: false,timeout: 2000,encoding:null,headers: {'User-Agent': 'Safari 6.0'}}, function(error, resp, body) {
						if (error) {
							done(error,null);
						}
						else
							{
								var tempBody = body.toString('utf-8');
								$ = cheerio.load(tempBody);

								var charsetField = $("meta[http-equiv=Content-Type]");
								if(charsetField.length > 0 && charsetField[0].attribs && charsetField[0].attribs.content){
									if(charsetField[0].attribs.content.indexOf("iso-8859-15") >= 0){
										//iso-8859-15 encoding
										var ic = new iconv.Iconv('iso-8859-15', 'utf-8');
										var buf = ic.convert(body);
										var buffer = buf.toString('utf-8');
										done(null,buffer);
									}
								}

								done(null,tempBody);

							}
						});
				});
			}catch(err){
				return {error:err};
			}

			if(urlResponse.error){
				return {error:urlResponse.error};
			}

            var pageName = '';
            var pageDescription = '';

			var findedImages = new Array();
			$ = cheerio.load(urlResponse.result);

			var meta = $('meta');
			var keys = Object.keys(meta);

			keys.forEach(function(key){
                if (  meta[key].attribs && meta[key].attribs.property && meta[key].attribs.property === 'og:site_name')
                {
                    pageName = meta[key].attribs.content;
                }
                if (  meta[key].attribs && meta[key].attribs.property && meta[key].attribs.property === 'og:title' && pageName === '')
                {
                    pageName = meta[key].attribs.content;
                }


                if (  meta[key].attribs && meta[key].attribs.property && meta[key].attribs.property === 'og:description')
                {
                    pageDescription = meta[key].attribs.content;
                }

				if (  meta[key].attribs && meta[key].attribs.property && meta[key].attribs.property === 'og:image') {
					var src = meta[key].attribs.content;
					var fullUrl = '';
					if(src.indexOf('http') != -1){
						fullUrl = src;
					}
					else{
						fullUrl = url + src;
					}
					findedImages.push(fullUrl);
				}

			});

			if(pageName === ''){
				pageName = $('title').text();
			}

			if(pageDescription === ''){
				var metaDescription = $("meta[name=description]");
				if(metaDescription.length > 0 && metaDescription[0].attribs && metaDescription[0].attribs.content){
					pageDescription = metaDescription[0].attribs.content;
				}
			}



			$('img').each(function(i, elem) {
				var src = $(elem).attr('src');
				var fullUrl = '';
				if(src.indexOf('http') != -1){
					fullUrl = $(elem).attr('src');
				}
				else{
					fullUrl = url + $(elem).attr('src');
				}
				try{
					var imageGet = Meteor.http.get(fullUrl);
					if(imageGet.statusCode === 200 && parseInt(imageGet.headers['content-length']) > 1000){
						findedImages.push(fullUrl);
                        if(findedImages.length > 3)
                        {
                            return false;
                        }
					}
				}
				catch(err) {
				}
			});


			return {name:pageName,description:pageDescription,images:findedImages,url:url};
		}
	});
