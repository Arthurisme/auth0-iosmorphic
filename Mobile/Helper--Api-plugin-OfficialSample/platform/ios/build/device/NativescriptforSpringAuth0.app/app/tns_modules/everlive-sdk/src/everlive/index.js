import Everlive from 'Everlive';
import platform from 'everlive.platform';
import _ from 'underscore';
import rsvp from 'rsvp';
import reqwest from 'reqwest.everlive';
import Query from 'query/Query';
import AggregateQuery from 'query/AggregateQuery';
import QueryBuilder from 'query/QueryBuilder';
import GeoPoint from 'GeoPoint';
import constants from 'constants';
import Request from 'Request';
import {EverliveErrors} from 'EverliveError';
import utils from 'utils';
import Data from 'types/Data';
import persistersModule from 'offline/offlinePersisters';

(function () {
    Everlive.version = '"<%= version %>"';

    if (!platform.isNativeScript && !platform.isNodejs) {
        const kendo = require('kendo/kendo.everlive');
        Everlive.createDataSource = kendo.createDataSource;
        Everlive.createHierarchicalDataSource = kendo.createHierarchicalDataSource;
    }

    //Global event handlers for push notification events. Required by the cordova PushNotifications plugin that we use.
    Everlive.PushCallbacks = {};
    Everlive.Offline = {};

    Everlive.Query = Query;
    Everlive.AggregateQuery = AggregateQuery;
    Everlive.QueryBuilder = QueryBuilder;
    Everlive.GeoPoint = GeoPoint;
    Everlive.Constants = constants;
    Everlive.Request = Request;
    Everlive.EverliveErrors = EverliveErrors;
    Everlive.Data = Data;
    Everlive._utils = utils;
    Everlive._traverseAndRevive = Everlive._utils.parseUtilities.traverseAndRevive;
    Everlive._common = {_, rsvp, reqwest};

    Everlive.persister = {
        LocalStorage: persistersModule.LocalStoragePersister,
        FileSystem: persistersModule.FileSystemPersister
    };

    module.exports = Everlive;
}());
