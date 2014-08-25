Meteor.methods({
		'simplecrawler_findMetadata': function findMetada(url) {
			this.unblock();
			var cheerio = Npm.require('cheerio');
			var urlResponse;
			try{
				urlResponse = Meteor.http.get(url,{rejectUnauthorized: false});
				if(urlResponse.statusCode !== 200){
					return {images:new Array()};
				}
			}
			catch(err) {
				return {error:err};
			}

            var pageName = '';
            var pageDescription = '';
			
			var findedImages = new Array();
			$ = cheerio.load(urlResponse.content);
			
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