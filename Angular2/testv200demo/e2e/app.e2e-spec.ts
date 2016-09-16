import { Testv200demoPage } from './app.po';

describe('testv200demo App', function() {
  let page: Testv200demoPage;

  beforeEach(() => {
    page = new Testv200demoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
