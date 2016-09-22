import { NgModuleFinal2Page } from './app.po';

describe('ng-module-final2 App', function() {
  let page: NgModuleFinal2Page;

  beforeEach(() => {
    page = new NgModuleFinal2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
