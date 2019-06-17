//jasmine.getFixtures().fixturesPath = 'spec/javascripts/fixtures' ;

describe("Basic testing", function() {

  // var fixture = loadFixtures('example.html');

  beforeEach(function () {
      loadFixtures('example.html');
    });

  it("Basic Test", function () {
  expect(true).toBe(true);
  });

});
