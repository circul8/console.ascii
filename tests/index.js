const ascii = require('../src/lib.js');
const asciiObj = new ascii({});

describe('getRandomInt', function () {

  it('should be >= 1 && <= 100', function () {
    const rand = asciiObj.getRandomInt(1, 100);
    expect(rand).toBeGreaterThan(0.9)
    expect(rand).toBeLessThan(100.1);
  });

});

describe('prepareQuery', function () {

  it('should be "searchType=image&cx="', function () {
    const defaults = {
      searchType: 'image',
      cx: ''
    };
    const query = asciiObj.prepareQuery(defaults);
    expect(query).toEqual('searchType=image&cx=');
  });

  it('should be "api_key="', function () {
    const defaults = {
      api_key: ''
    };
    const query = asciiObj.prepareQuery(defaults);
    expect(query).toEqual('api_key=');
  });

  it('should be empty', function () {
    const query = asciiObj.prepareQuery({});
    expect(query).toEqual('');
  });

});