import { Optimizations2Page } from './app.po';

describe('optimizations2 App', function() {
  let page: Optimizations2Page;

  beforeEach(() => {
    page = new Optimizations2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
