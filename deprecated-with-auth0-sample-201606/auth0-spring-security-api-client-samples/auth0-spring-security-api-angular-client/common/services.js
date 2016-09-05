angular.module("services", ["ngResource"])
  .constant("appSettings",
    {
      serverPath: API_SERVER_URL
    });
