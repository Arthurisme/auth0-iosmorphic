var Request = require('Request');
var GetRequest = Request.GetRequest;
var GetByIdRequest = Request.GetByIdRequest;
var CreateRequest = Request.CreateRequest;
var UploadRequest = Request.UploadRequest;
var UpdateRequest = Request.UpdateRequest;
var DeleteRequest = Request.DeleteRequest;
var GetRelatedRequest = Request.GetRelatedRequest;
var GetRelatedByIdRequest = Request.GetRelatedByIdRequest;
var DeleteRelatedRequest = Request.DeleteRelatedRequest;
var CreateRelatedRequest = Request.CreateRelatedRequest;
var DeleteRelatedByIdRequest = Request.DeleteRelatedByIdRequest;
var BatchRequest = require('BatchRequest');

class RequestFactory {
    get(...params) {
        return new GetRequest(...params);
    }

    getSingle(...params) {
        return new GetByIdRequest(...params);
    }

    create(...params) {
        return new CreateRequest(...params);
    }

    update(...params) {
        return new UpdateRequest(...params);
    }

    destroy(...params) {
        return new DeleteRequest(...params);
    }

    getProperty(...params) {
        return new GetRelatedRequest(...params);
    }

    getRelated(...params) {
        return new GetRelatedRequest(...params);
    }

    getRelatedById(...params) {
        return new GetRelatedByIdRequest(...params);
    }

    destroyRelated(...params) {
        return new DeleteRelatedRequest(...params);
    }

    destroyRelatedById(...params) {
        return new DeleteRelatedByIdRequest(...params);
    }

    createRelated(...params) {
        return new CreateRelatedRequest(...params)
    }

    batch(...params) {
        //TODO: will need _factory fixed
        params.push(this);
        return new BatchRequest(...params);
    }

    upload(...params) {
        return new UploadRequest(...params);
    }
}

module.exports = RequestFactory;