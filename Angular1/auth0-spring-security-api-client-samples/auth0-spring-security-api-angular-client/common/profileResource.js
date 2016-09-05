angular.module("services").factory("profileResource", ["$resource", "appSettings", profileResource]);

function profileResource($resource, appSettings) {
  return $resource(appSettings.serverPath + "/api/v1/profiles/:id", null,
    {
      'update':{method:'PUT'}
    });
}
