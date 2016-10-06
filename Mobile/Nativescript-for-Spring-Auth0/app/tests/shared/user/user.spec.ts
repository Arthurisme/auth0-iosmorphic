import "reflect-metadata";
import { GroceriesUser } from "../../../shared";

declare var describe: any;
declare var expect: any;
declare var it: any;

describe("Email validation", function() {
  let groceriesUser = new GroceriesUser();

  it("Should reject an empty email address", function () {
    groceriesUser.email = "";
    expect(groceriesUser.isValidEmail()).toBe(false);
  });

  it("Should reject a malformed email addresses", function() {
    groceriesUser.email = "nativescript";
    expect(groceriesUser.isValidEmail()).toBe(false);

    groceriesUser.email = "nativescript@";
    expect(groceriesUser.isValidEmail()).toBe(false);

    groceriesUser.email = "nativescript@isawesome";
    expect(groceriesUser.isValidEmail()).toBe(false);
  });

  it("Should accept valid email addresses", function() {
    groceriesUser.email = "nativescript@isawesome.com";
    expect(groceriesUser.isValidEmail()).toBe(true);
  });
});
