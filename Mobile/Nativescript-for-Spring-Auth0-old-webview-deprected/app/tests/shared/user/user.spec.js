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
//# sourceMappingURL=user.spec.js.map