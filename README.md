# Note!!

This project is  a fork of the Meteor simple-metacrawler package, that has been subtlely modified to satisfy my needs in an specific project. It basically changes the name of the server side method used to scrape the metada data, from "simplecrawler_findMetadata" to "fetchMetadata". It also removes the code that is used to scrape the images in the body of the html document requested at the given url, in fact, it just returns the one image that is part of the metadata.

# extract-metadata

Metadata scraper for Meteor. Just feed it with an url and it will return the name, description and images inside that url.

##  Installation

Just run:

``` sh
$ meteor add agarcia038:extract-metadata
```

##  How to

extract-metadata just adds a server side method to your meteor app. This method is called 'fetchMetadata'. To call it client side use:

``` javascript
Meteor.call('fetchMetadata', url, function (error, result) {
	//Error is empty if all goes well
	//Result will containt and object like:
	//{name:'Page name',description:'Here's the metadata description',image:'img url'}
});
```

You can use that response data as you want. It will return og:image for the image.

extract-metadata checks that any image url is valid and result will contain an error field if url request fails.
