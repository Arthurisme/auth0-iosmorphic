"use strict";
require("reflect-metadata");
var shared_1 = require("../../../shared");
describe("Email validation", function () {
    var user = new shared_1.User();
    it("Should reject an empty email address", function () {
        user.email = "";
        expect(user.isValidEmail()).toBe(false);
    });
    it("Should reject a malformed email addresses", function () {
        user.email = "nativescript";
        expect(user.isValidEmail()).toBe(false);
        user.email = "nativescript@";
        expect(user.isValidEmail()).toBe(false);
        user.email = "nativescript@isawesome";
        expect(user.isValidEmail()).toBe(false);
    });
    it("Should accept valid email addresses", function () {
        user.email = "nativescript@isawesome.com";
        expect(user.isValidEmail()).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxRQUFPLGtCQUFrQixDQUFDLENBQUE7QUFDMUIsdUJBQXFCLGlCQUFpQixDQUFDLENBQUE7QUFNdkMsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLElBQUksSUFBSSxHQUFHLElBQUksYUFBSSxFQUFFLENBQUM7SUFFdEIsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7UUFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUM7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxLQUFLLEdBQUcsd0JBQXdCLENBQUM7UUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLDRCQUE0QixDQUFDO1FBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9