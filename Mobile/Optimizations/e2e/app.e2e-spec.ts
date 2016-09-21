import { CompleteGuideFinalWebpackPage } from './app.po';

describe('complete-guide-final-webpack App', function() {
  let page: CompleteGuideFinalWebpackPage;

  beforeEach(() => {
    page = new CompleteGuideFinalWebpackPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
