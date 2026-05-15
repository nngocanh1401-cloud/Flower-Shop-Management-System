import { FshopABPTemplatePage } from './app.po';

describe('FshopABP App', function () {
    let page: FshopABPTemplatePage;

    beforeEach(() => {
        page = new FshopABPTemplatePage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
