# simple-metacrawler

Metadata and images crawler for Meteor. Just feed it with an url and it will return the name, description and images inside that url.

##  Installation

Just run:

``` sh
$ meteor add simple-metacrawler
```

##  How to

Simple metecrawler just adds a server side method to your meteor app. This method is called 'simplecrawler_findMetadata'. To call it client side use:

``` javascript
Meteor.call('simplecrawler_findMetadata', url, function (error, result) {
	//Error is empty if all goes well
	//Result will containt and object like:
	//{name:'Page name',description:'Here's the metadata description',images:['img url 1','img url 2']}
});
```

You can use that response data as you want. Right now it will return og:image and the first 3 images finded on the page.

Simple metacrawler checks that any image url is valid and result will contain an error field if url request fails.
