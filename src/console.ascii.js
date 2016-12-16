{
	class ascii {

		constructor({source = 'clipart', color = true, width = 120, chars = ['@','#','$','=','*','!',';',':','~','-',',','.',' '], verbose = false, debug = false, sourceSettings = {}, callback = null} = {}) {

			/** @type {Array} Default sources for ASCII images. */
			const sources = ['clipart', 'google', 'flickr'];

			/** @type {string} Wanted source of ASCII images. */
			this.source = (() => {
				if (sources.indexOf(source) === -1 && sources[0] in this) {
					console.warn(`console.ascii: Uknown source "${source}"`);
					return sources[0];
				} else return source;
			})();

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
			this.CONST_VERBOSE_MIXING  = 'Finding random image...';
		}


		/**
		 * Internal function for debug purposes.
		 * @param  {...string} List of messages to go to output.
		 * @return void
		 * @internal
		 */
		log(...str) {
			if (this.debug) console.log(str);
		}


		/**
		 * Internal function for debug purposes.
		 * @param  {...object} List of objects to display in table.
		 * @return void
		 * @internal
		 */
		table(...str) {
			if (this.debug) console.table(str);
		}


		/**
		 * Get the image frou source and do the ASCII magic baby!
		 * @param  {string} search Search query.
		 * @return {void}
		 */
		get(search) {
			this[this.source](search);
		}


		/**
		 * Show verbose messages if needed.
		 * @param  {string} message
		 * @return {void}
		 */
		talkToMe(message) {
			if (this.verbose) console.log(message);
		}


		/**
		 * Get the image URL and convert it to ASCII
		 * @param  {string} url URL of image to convert.
		 * @return {void}
		 */
		run(url) {
			this.log(url);

			const img = document.createElement('img');
			img.crossOrigin = 'anonymous';
			img.src = url;
			img.onload = () => {
				img.height = img.height * (this.width / img.width);
				img.width = this.width;

				this.table([{'src': img.src, 'width': img.width, 'height': img.height}]);

				const ctx = document.createElement('canvas').getContext('2d');
				ctx.drawImage(img, 0, 0, img.width, img.height);

				const charLen = this.chars.length - 1;
				const getChar = (val) => { return this.chars[Math.round(val * charLen)]; }
				const isAlpha = (rgbA, val) => { return rgbA == 0 && val == 0; }
				const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
				let row = [''];

				for (let i = 0; i < img.width * img.height; i++) {
					const [iR, iG, iB, iA] = [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3];
					let [R, G, B] = [imgData[iR], imgData[iG], imgData[iB]];
					let val = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
					if (isAlpha(imgData[iA], val)) {
						val = 1;
						[R, G, B] = [255, 255, 255];
					}
					row[0] += `%c${getChar(val)}`;
					row.push(`color: #fff; background-color: rgb(${R}, ${G}, ${B}); font-family: monospace, fixed; font-weight: bold;`);
					if (i % img.width === 0 && i !== 0) {
						if (this.color) {
							console.log.apply(console, row);
						} else {
							console.log(row[0].replace(new RegExp(/%c/, 'g'), ''));
						}
						row = [''];
					}
				}
				if (typeof this.callback === 'function') {
					this.callback();
				}
			}
		}


		/**
		 * Search the Google images for image.
		 * @param  {string} search Search query.
		 * @return {void}
		 */
		google(search) {
			const defaults = {
				searchType: 'image',
				cx: '',
				imgSize: 'medium',
				imgType: 'lineart',
				imgDominantColor: 'white',
				imgColorType: 'color',
				key: ''
			};
			const query = this.prepareQuery(defaults);
			const url = `https://www.googleapis.com/customsearch/v1?${query}&q=${search}+jpg`;
			this.log(query);

			fetch(url)
				.then(response => {
					this.talkToMe(this.CONST_VERBOSE_FINDING);
					return response.json()
				})
				.then(response => {
					this.run(encodeURI(response.items[0].link));
				})
				.catch(err => {
					console.warn(err);
				});
		}


		/**
		 * Search the openclipart.org for image.
		 * @param  {string} search Search query.
		 * @return {void}
		 */
		clipart(search) {
			const defaults = {};
			const query = this.prepareQuery(defaults);
			const url = `https://openclipart.org/search/json/?query=${search}&amount=1&page=1&${query}`;

			fetch(url)
				.then(response => {
					this.talkToMe(this.CONST_VERBOSE_FINDING);
					return response.json();
				})
				.then(response => {
					const page = this.getRandomInt(1, response.info.pages);
					return fetch(`https://openclipart.org/search/json/?query=${search}&amount=1&page=${page}&${query}`);
				})
				.then(response => {
					this.talkToMe(this.CONST_VERBOSE_MIXING);
					return response.json();
				})
				.then(response => {
					this.run(response.payload[0].svg.png_thumb);
				})
				.catch(err => {
					console.warn(err);
				});
		}


		flickr(search) {
			const defaults = {
				api_key: ''
			};
			const query = this.prepareQuery(defaults);
			const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=1&text=${search}&format=json&${query}`;
			this.log(query);

			const parseJsonp = (jsonp) => {
				const match = jsonp.match(/^jsonFlickrApi\((.*)\)$/);
				return JSON.parse(match[1]);
			}

			fetch(url)
				.then(response => {
					this.talkToMe(this.CONST_VERBOSE_FINDING);
					return response.text();
				})
				.then(response => {
					this.talkToMe(this.CONST_VERBOSE_MIXING);
					const result = parseJsonp(response)
					//const page = this.getRandomInt(1, result.photos.pages); -> Not working currently. Some sort of cache and max page limit.
					const page = this.getRandomInt(1, 1000);
					return fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=1&page=${page}&text=${search}&format=json&${query}`).then(response => response.text());
				})
				.then(response => {
					const result = parseJsonp(response)
					const photo = result.photos.photo[0];
					this.run(`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`);
				})
				.catch(err => {
					console.warn(err);
				});
		}


		/**
		 * Get source defaults, merge them with custom settings and return URL query string.
		 * @param  {object} defaults	Object of defaults.
		 * @return {string}          	URL query string.
		 */
		prepareQuery(defaults) {
			let query = [];
			for (let def in defaults) {
				query.push([def, this.sourceSettings[def] || defaults[def]]);
				if (this.sourceSettings[def]) delete this.sourceSettings[def];
			}
			for (let def in this.sourceSettings) {
				query.push([def, this.sourceSettings[def] || defaults[def]]);
			}

			switch (query.length) {
				case 0: return [];
				case 1: return `${query[0][0]}=${query[0][1]}`;
				default: return query.reduce((a, b) => {return [a].join('=') + '&' + b.join('=')}).replace(',', '=');
			}
		}


		getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		}

	}

	if (window.console) {
		console.ascii = function(find, settings = {}) {
			const asciiObj = new ascii(settings);
			asciiObj.get(find);
		}
	}

}
