# console.ascii()
Let's extend console by adding some funny ascii art! 💥

![](http://144.wtf/NRNT+)

## Installation

`npm install`

`npm run build` -> Building JS to **/dist** folder.

`npm run test` -> Running tests.

## Usage

`console.ascii('search term', {settings});`

Console searches [openclipart.org](https://openclipart.org/) by default althought the support of **Google Images** and **Flickr** is implemented.

The result can be colorful or plain ascii art.

## Settings

| setting | type | default | description | possible values |
|---|---|---|---|---|
| source | `string` | `clipart` | Choose the source of images where to search - whether openclipart.org, google.com or flickr.com | clipart / google / flickr |
| color | `bool` | `true` | Show colorful ASCII art? |  |
| debug | `bool` | `false` | Show debug information? |  |
| verbose | `bool` | `false` | Show messages when executing Promises? |  |
| width | `int` | 120 | Scaling result image ~ number of characters on line. |  |
| chars | `array` | `['@','#','$','=','*','!',';',':','~','-',',','.',' ']` | Characters to use for "drawing". From darker ➡ brighter. |  |
| sourceSettings | `object` | `{}` | Additional settings for search sources (Google, Flickr) |  |
| callback | `function` | `null` | Callback to call after output. |  |

## Sources

### Google Images
To be able to use Google Images as a search source, you need to setup [Google Custom Search](https://cse.google.com.au/) and configure the `console.ascii`.

List of possible parameters are [here](https://developers.google.com/custom-search/json-api/v1/reference/cse/list), defaults are: 

| key | value |
|-----|-------|
| `searchType` | image |
| `cx` | '' |
| `imgSize` | medium |
| `imgType` | lineart |
| `imgDominantColor` | white |
| `imgColorType` | color |
| `key` | '' |

#### Example

`console.ascii('car', {color: false, source: 'google', sourceSettings: {key: 'YOUR_KEY_GOES_HERE', cx: 'YOUR_CX_ID_GOES_HERE', imgType: 'photo', imgColorType: 'color', safe: 'high'}});`

#### Warning ⚠️

Some images especially from **Google Images** may be block due to [same origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) as Google returns links from origin source 👊. The only workaround is to use custom proxy.

### Flickr

There's only one default parameter `api_key`, but you can add more parameters based on [this list](https://www.flickr.com/services/api/flickr.photos.search.html).

Flickr support CORS 👏🏻 so all images coming from Flickr should be accessible without any issue.

### Openclipart.org

This is default search source. There's no special settings. 

Openclipart.org supports CORS too 👏🏻.

## Examples

`console.ascii('fishing rod', {color: false, debug: true});`

`console.ascii('rabbit', {source: 'flickr', sourceSettings: {api_key: 'YOUR_API_GOES_HERE'}, width: 60, color: true});`

`console.ascii('rabbit', {source: 'flickr', sourceSettings: {api_key: 'YOUR_API_GOES_HERE'}, width: 60, color: true});`

`console.ascii('funny airplane', {verbose: true, width: 50, color: true});`

`console.ascii('car', {color: false, source: 'google', sourceSettings: {key: 'YOUR_KEY_GOES_HERE', cx: 'YOUR_CX_ID_GOES_HERE'}});`


## Why?

Why not!?

## Gallery

![](http://144.wtf/GAT6+)
![](http://144.wtf/NRNT+)
![](http://144.wtf/tTln+)