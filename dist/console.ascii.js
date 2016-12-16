'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

{
	(function () {
		var ascii = function () {
			function ascii() {
				var _this = this;

				var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
				    _ref$source = _ref.source,
				    source = _ref$source === undefined ? 'clipart' : _ref$source,
				    _ref$color = _ref.color,
				    color = _ref$color === undefined ? true : _ref$color,
				    _ref$width = _ref.width,
				    width = _ref$width === undefined ? 120 : _ref$width,
				    _ref$chars = _ref.chars,
				    chars = _ref$chars === undefined ? ['@', '#', '$', '=', '*', '!', ';', ':', '~', '-', ',', '.', ' '] : _ref$chars,
				    _ref$verbose = _ref.verbose,
				    verbose = _ref$verbose === undefined ? false : _ref$verbose,
				    _ref$debug = _ref.debug,
				    debug = _ref$debug === undefined ? false : _ref$debug,
				    _ref$sourceSettings = _ref.sourceSettings,
				    sourceSettings = _ref$sourceSettings === undefined ? {} : _ref$sourceSettings,
				    _ref$callback = _ref.callback,
				    callback = _ref$callback === undefined ? null : _ref$callback;

				_classCallCheck(this, ascii);

				/** @type {Array} Default sources for ASCII images. */
				var sources = ['clipart', 'google', 'flickr'];

				/** @type {string} Wanted source of ASCII images. */
				this.source = function () {
					if (sources.indexOf(source) === -1 && sources[0] in _this) {
						console.warn('console.ascii: Uknown source "' + source + '"');
						return sources[0];
					} else return source;
				}();

				/** @type {boolean} Get output in colors or in a strict ascii art */
				this.color = color;

				/** @type {boolean} Turn on/off the debug messages. */
				this.debug = debug;

				/** @type {boolean} Show searching progress messages and other stuff.. */
				this.verbose = verbose;

				/** @type {int} Width of the final result. We need to scale images down to fit them in console. */
				this.width = width;

				/** @type {array} Array of asci characters that draw the image. The array goes from darker characters to brighter ones. */
				this.chars = chars;

				/** @type {object} Various settings for sources, especially for Google Images. */
				this.sourceSettings = sourceSettings;

				/** Callback function */
				this.callback = callback;

				/**
     * CONSTANTS
     */
				this.CONST_VERBOSE_FINDING = 'Connecting...';
				this.CONST_VERBOSE_MIXING = 'Finding random image...';
			}

			/**
    * Internal function for debug purposes.
    * @param  {...string} List of messages to go to output.
    * @return void
    * @internal
    */


			_createClass(ascii, [{
				key: 'log',
				value: function log() {
					for (var _len = arguments.length, str = Array(_len), _key = 0; _key < _len; _key++) {
						str[_key] = arguments[_key];
					}

					if (this.debug) console.log(str);
				}

				/**
     * Internal function for debug purposes.
     * @param  {...object} List of objects to display in table.
     * @return void
     * @internal
     */

			}, {
				key: 'table',
				value: function table() {
					for (var _len2 = arguments.length, str = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						str[_key2] = arguments[_key2];
					}

					if (this.debug) console.table(str);
				}

				/**
     * Get the image frou source and do the ASCII magic baby!
     * @param  {string} search Search query.
     * @return {void}
     */

			}, {
				key: 'get',
				value: function get(search) {
					this[this.source](search);
				}

				/**
     * Show verbose messages if needed.
     * @param  {string} message
     * @return {void}
     */

			}, {
				key: 'talkToMe',
				value: function talkToMe(message) {
					if (this.verbose) console.log(message);
				}

				/**
     * Get the image URL and convert it to ASCII
     * @param  {string} url URL of image to convert.
     * @return {void}
     */

			}, {
				key: 'run',
				value: function run(url) {
					var _this2 = this;

					this.log(url);

					var img = document.createElement('img');
					img.crossOrigin = 'anonymous';
					img.src = url;
					img.onload = function () {
						img.height = img.height * (_this2.width / img.width);
						img.width = _this2.width;

						_this2.table([{ 'src': img.src, 'width': img.width, 'height': img.height }]);

						var ctx = document.createElement('canvas').getContext('2d');
						ctx.drawImage(img, 0, 0, img.width, img.height);

						var charLen = _this2.chars.length - 1;
						var getChar = function getChar(val) {
							return _this2.chars[Math.round(val * charLen)];
						};
						var isAlpha = function isAlpha(rgbA, val) {
							return rgbA == 0 && val == 0;
						};
						var imgData = ctx.getImageData(0, 0, img.width, img.height).data;
						var row = [''];

						for (var i = 0; i < img.width * img.height; i++) {
							var iR = i * 4,
							    iG = i * 4 + 1,
							    iB = i * 4 + 2,
							    iA = i * 4 + 3;
							var _ref2 = [imgData[iR], imgData[iG], imgData[iB]],
							    R = _ref2[0],
							    G = _ref2[1],
							    B = _ref2[2];

							var val = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
							if (isAlpha(imgData[iA], val)) {
								val = 1;
								R = 255;
								G = 255;
								B = 255;
							}
							row[0] += '%c' + getChar(val);
							row.push('color: #fff; background-color: rgb(' + R + ', ' + G + ', ' + B + '); font-family: monospace, fixed; font-weight: bold;');
							if (i % img.width === 0 && i !== 0) {
								if (_this2.color) {
									console.log.apply(console, row);
								} else {
									console.log(row[0].replace(new RegExp(/%c/, 'g'), ''));
								}
								row = [''];
							}
						}
						if (typeof _this2.callback === 'function') {
							_this2.callback();
						}
					};
				}

				/**
     * Search the Google images for image.
     * @param  {string} search Search query.
     * @return {void}
     */

			}, {
				key: 'google',
				value: function google(search) {
					var _this3 = this;

					var defaults = {
						searchType: 'image',
						cx: '',
						imgSize: 'medium',
						imgType: 'lineart',
						imgDominantColor: 'white',
						imgColorType: 'color',
						key: ''
					};
					var query = this.prepareQuery(defaults);
					var url = 'https://www.googleapis.com/customsearch/v1?' + query + '&q=' + search + '+jpg';
					this.log(query);

					fetch(url).then(function (response) {
						_this3.talkToMe(_this3.CONST_VERBOSE_FINDING);
						return response.json();
					}).then(function (response) {
						_this3.run(encodeURI(response.items[0].link));
					}).catch(function (err) {
						console.warn(err);
					});
				}

				/**
     * Search the openclipart.org for image.
     * @param  {string} search Search query.
     * @return {void}
     */

			}, {
				key: 'clipart',
				value: function clipart(search) {
					var _this4 = this;

					var defaults = {};
					var query = this.prepareQuery(defaults);
					var url = 'https://openclipart.org/search/json/?query=' + search + '&amount=1&page=1&' + query;

					fetch(url).then(function (response) {
						_this4.talkToMe(_this4.CONST_VERBOSE_FINDING);
						return response.json();
					}).then(function (response) {
						var page = _this4.getRandomInt(1, response.info.pages);
						return fetch('https://openclipart.org/search/json/?query=' + search + '&amount=1&page=' + page + '&' + query);
					}).then(function (response) {
						_this4.talkToMe(_this4.CONST_VERBOSE_MIXING);
						return response.json();
					}).then(function (response) {
						_this4.run(response.payload[0].svg.png_thumb);
					}).catch(function (err) {
						console.warn(err);
					});
				}
			}, {
				key: 'flickr',
				value: function flickr(search) {
					var _this5 = this;

					var defaults = {
						api_key: ''
					};
					var query = this.prepareQuery(defaults);
					var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=1&text=' + search + '&format=json&' + query;
					this.log(query);

					var parseJsonp = function parseJsonp(jsonp) {
						var match = jsonp.match(/^jsonFlickrApi\((.*)\)$/);
						return JSON.parse(match[1]);
					};

					fetch(url).then(function (response) {
						_this5.talkToMe(_this5.CONST_VERBOSE_FINDING);
						return response.text();
					}).then(function (response) {
						_this5.talkToMe(_this5.CONST_VERBOSE_MIXING);
						var result = parseJsonp(response);
						//const page = this.getRandomInt(1, result.photos.pages); -> Not working currently. Some sort of cache and max page limit.
						var page = _this5.getRandomInt(1, 1000);
						return fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=1&page=' + page + '&text=' + search + '&format=json&' + query).then(function (response) {
							return response.text();
						});
					}).then(function (response) {
						var result = parseJsonp(response);
						var photo = result.photos.photo[0];
						_this5.run('https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_t.jpg');
					}).catch(function (err) {
						console.warn(err);
					});
				}

				/**
     * Get source defaults, merge them with custom settings and return URL query string.
     * @param  {object} defaults	Object of defaults.
     * @return {string}          	URL query string.
     */

			}, {
				key: 'prepareQuery',
				value: function prepareQuery(defaults) {
					var query = [];
					for (var def in defaults) {
						query.push([def, this.sourceSettings[def] || defaults[def]]);
						if (this.sourceSettings[def]) delete this.sourceSettings[def];
					}
					for (var _def in this.sourceSettings) {
						query.push([_def, this.sourceSettings[_def] || defaults[_def]]);
					}

					switch (query.length) {
						case 0:
							return [];
						case 1:
							return query[0][0] + '=' + query[0][1];
						default:
							return query.reduce(function (a, b) {
								return [a].join('=') + '&' + b.join('=');
							}).replace(',', '=');
					}
				}
			}, {
				key: 'getRandomInt',
				value: function getRandomInt(min, max) {
					min = Math.ceil(min);
					max = Math.floor(max);
					return Math.floor(Math.random() * (max - min)) + min;
				}
			}]);

			return ascii;
		}();

		if (window.console) {
			console.ascii = function (find) {
				var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

				var asciiObj = new ascii(settings);
				asciiObj.get(find);
			};
		}
	})();
}