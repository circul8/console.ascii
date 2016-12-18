module.exports = function(config) {
  config.set({
    files: [
      "index.js"
    ],
    frameworks: [
      "browserify", "jasmine"
    ],
    reporters: [
      "mocha",
      "coverage"
    ],
    browsers: [
      "PhantomJS"
    ],
    preprocessors: {
      "../src/lib.js": ["browserify", "coverage"],
      "index.js": ["browserify"]
    },
    browserify: {
      debug: true,
      transform: [
        ['babelify']
      ]
    }
  });
};