export class RecipeBookPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('recipe-book-app h1')).getText();
  }
}
