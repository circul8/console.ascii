const ascii = require('../src/lib.js');

describe('getRandomInt', function () {

  it('should be >= 1 && <= 100', function () {
    const asciiObj = new ascii({});
    const rand = asciiObj.getRandomInt(1, 100);
    expect(rand).toBeGreaterThan(0.9)
    expect(rand).toBeLessThan(100.1);
  });

});

describe('prepareQuery', function () {

  it('should be "searchType=image&cx="', function () {
    const asciiObj = new ascii({});
    const defaults = {
      searchType: 'image',
      cx: ''
    };
    const query = asciiObj.prepareQuery(defaults);
    expect(query).toEqual('searchType=image&cx=');
  });

  it('should be "api_key="', function () {
    const asciiObj = new ascii({});
    const defaults = {
      api_key: ''
    };
    const query = asciiObj.prepareQuery(defaults);
    expect(query).toEqual('api_key=');
  });

  it('should be empty', function () {
    const asciiObj = new ascii({});
    const query = asciiObj.prepareQuery({});
    expect(query).toEqual('');
  });

});

describe('checking this.source', function () {

  it('should be clipart', function () {
    const asciiObj = new ascii({});
    const source = asciiObj.source;
    expect(source).toEqual('clipart');
  });

  it('should be google', function () {
    const asciiObj = new ascii({source: 'google'});
    const source = asciiObj.source;
    expect(source).toEqual('google');
  });

  it('should be flickr', function () {
    const asciiObj = new ascii({source: 'flickr'});
    const source = asciiObj.source;
    expect(source).toEqual('flickr');
  });

  it('should be clipart for unknown source', function () {
    const asciiObj = new ascii({source: 'bing'});
    const source = asciiObj.source;
    expect(source).toEqual('clipart');
  });

});