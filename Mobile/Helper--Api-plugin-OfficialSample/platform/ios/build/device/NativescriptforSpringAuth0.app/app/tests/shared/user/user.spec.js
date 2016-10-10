"use strict";
require("reflect-metadata");
var shared_1 = require("../../../shared");
describe("Email validation", function () {
    var groceriesUser = new shared_1.GroceriesUser();
    it("Should reject an empty email address", function () {
        groceriesUser.email = "";
        expect(groceriesUser.isValidEmail()).toBe(false);
    });
    it("Should reject a malformed email addresses", function () {
        groceriesUser.email = "nativescript";
        expect(groceriesUser.isValidEmail()).toBe(false);
        groceriesUser.email = "nativescript@";
        expect(groceriesUser.isValidEmail()).toBe(false);
        groceriesUser.email = "nativescript@isawesome";
        expect(groceriesUser.isValidEmail()).toBe(false);
    });
    it("Should accept valid email addresses", function () {
        groceriesUser.email = "nativescript@isawesome.com";
        expect(groceriesUser.isValidEmail()).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxRQUFPLGtCQUFrQixDQUFDLENBQUE7QUFDMUIsdUJBQThCLGlCQUFpQixDQUFDLENBQUE7QUFNaEQsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLElBQUksYUFBYSxHQUFHLElBQUksc0JBQWEsRUFBRSxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtRQUN6QyxhQUFhLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1FBQzlDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakQsYUFBYSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUM7UUFDdEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVqRCxhQUFhLENBQUMsS0FBSyxHQUFHLHdCQUF3QixDQUFDO1FBQy9DLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsYUFBYSxDQUFDLEtBQUssR0FBRyw0QkFBNEIsQ0FBQztRQUNuRCxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==