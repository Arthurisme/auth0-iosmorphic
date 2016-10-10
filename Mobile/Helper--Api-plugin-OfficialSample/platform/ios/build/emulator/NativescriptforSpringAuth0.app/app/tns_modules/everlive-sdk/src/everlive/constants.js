import _ from 'underscore';
import commonConstants from 'common/constants';

/**
 * Constants used by the SDK* @typedef {Object} Everlive.Constants
 */


const constants = {
    idField: 'Id',
    guidEmpty: '00000000-0000-0000-0000-000000000000',
    cloudFuncsEndpoint: 'Functions',
    sqlProceduresEndpoint: 'Invoke/SqlProcedures',
    everliveUrl: '//api.everlive.com/v1/',
    /**
     * A class used to represent the conflict resolution strategies.
     * @property {string} ClientWins
     * @property {string} ServerWins
     * @property {string} Custom
     * @typedef {string} Everlive.Constants.ConflictResolutionStrategy
     */
    ConflictResolutionStrategy: {
        ClientWins: 'clientWins',
        ServerWins: 'serverWins',
        Custom: 'custom'
    },
    ConflictResolution: {
        KeepServer: 'keepServer',
        KeepClient: 'keepClient',
        Custom: 'custom',
        Skip: 'skip'
    },
    /**
     * A class used to represent the available storage providers.
     * @property {string} LocalStorage
     * @property {string} FileSystem
     * @property {string} Custom
     * @typedef {string} Everlive.Constants.StorageProvider
     */
    StorageProvider: {
        LocalStorage: 'localStorage',
        FileSystem: 'fileSystem',
        Custom: 'custom'
    },

    DefaultStoragePath: 'el_store',

    // the default location for storing files offline
    DefaultFilesStoragePath: 'el_file_store',

    // the default location for storing offline to online location map
    DefaultFilesMetadataPath: 'el_file_mapping',

    EncryptionProvider: {
        Default: 'default',
        Custom: 'custom'
    },

    // The headers used by the Everlive services
    Headers: {
        ContentType: 'content-type',

        filter: 'x-everlive-filter',
        select: 'x-everlive-fields',
        sort: 'x-everlive-sort',
        skip: 'x-everlive-skip',
        take: 'x-everlive-take',
        expand: 'x-everlive-expand',
        singleField: 'x-everlive-single-field',
        includeCount: 'x-everlive-include-count',
        powerFields: 'x-everlive-power-fields',
        debug: 'x-everlive-debug',
        overrideSystemFields: 'x-everlive-override-system-fields',
        sdk: 'x-everlive-sdk',
        sync: 'x-everlive-sync',
        aggregate: 'x-everlive-aggregate',
        customParameters: 'x-everlive-custom-parameters'
    },
    //Constants for different platforms in Everlive
    Platform: {
        WindowsPhone: 1,
        Windows: 2,
        Android: 3,
        iOS: 4,
        OSX: 5,
        Blackberry: 6,
        Nokia: 7,
        Unknown: 100
    },
    OperatorType: {
        query: 1,

        where: 100,
        filter: 101,

        and: 110,
        or: 111,
        not: 112,

        equal: 120,
        not_equal: 121,
        lt: 122,
        lte: 123,
        gt: 124,
        gte: 125,
        isin: 126,
        notin: 127,
        all: 128,
        size: 129,
        regex: 130,
        contains: 131,
        startsWith: 132,
        endsWith: 133,

        nearShpere: 140,
        withinBox: 141,
        withinPolygon: 142,
        withinShpere: 143,

        select: 200,
        exclude: 201,

        order: 300,
        order_desc: 301,

        skip: 400,
        take: 401,
        expand: 402
    },

    /**
     * A class used to represent the current authentication status of the {{site.TelerikBackendServices}} JavaScript SDK instance.
     * @property {string} unauthenticated Indicates that no user is authenticated.
     * @property {string} masterKey Indicates that a master key authentication is used.
     * @property {string} invalidAuthentication Indicates an authentication has been attempted, but it was invalid.
     * @property {string} authenticated Indicates that a user is authenticated.
     * @property {string} authenticating Indicates that a user is currently authenticating. Some requests might be pending and waiting for the user to authenticate.
     * @property {string} expiredAuthentication Indicates that a user's authentication has expired and that the user must log back in.
     * @typedef {string} Everlive.AuthStatus
     */
    AuthStatus: {
        unauthenticated: 'unauthenticated',
        masterKey: 'masterKey',
        invalidAuthentication: 'invalidAuthentication',
        authenticated: 'authenticated',
        expiredAuthentication: 'expiredAuthentication',
        authenticating: 'authenticating'
    },
    offlineItemStates: {
        created: 'create',
        modified: 'update',
        deleted: 'delete'
    },

    /**
     * HTTP Methods
     * @typedef {string} constants.HttpMethod
     * @property {string} GET
     * @property {string} POST
     * @property {string} PUT
     * @property {string} DELETE
     */
    HttpMethod: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE'
    },
    maxDistanceConsts: {
        radians: '$maxDistance',
        km: '$maxDistanceInKilometers',
        miles: '$maxDistanceInMiles'
    },
    radiusConsts: {
        radians: 'radius',
        km: 'radiusInKilometers',
        miles: 'radiusInMiles'
    }
};

// using an invalid field name in the context of Everlive
// to ensure no naming collisions can occur
constants.offlineItemsStateMarker = '__everlive_offline_state';

constants.SyncErrors = {
    generalError: 'generalError',
    itemSyncError: 'itemSyncError'
};

constants.syncBatchSize = 10;

constants.AuthStoreKey = '__everlive_auth_key';

constants.CachingStoreKey = '__everlive_cache';

// the minimum interval between sync requests
constants.defaultSyncInterval = 1000 * 60 * 10; // 10 minutes
constants.fileUploadKey = 'fileUpload';
constants.fileUploadDelimiter = '_';

constants.FilesTypeNameLegacy = 'system.files';
constants.FilesTypeName = 'Files';

constants.MaxConcurrentDownloadTasks = 3;

constants.DefaultFilesystemStorageQuota = 10485760;
constants.Events = {
    SyncStart: 'syncStart',
    SyncEnd: 'syncEnd',
    Processed: 'processed',
    ItemProcessed: 'itemProcessed',
    BeforeExecute: 'beforeExecute'
};

constants.DataQueryOperations = {
    Read: 'read',
    Create: 'create',
    Update: 'update',
    Delete: 'destroy',
    DeleteById: 'destroySingle',
    ReadById: 'readById',
    Count: 'count',
    RawUpdate: 'rawUpdate',
    SetAcl: 'setAcl',
    SetOwner: 'setOwner',
    UpdateById: 'updateSingle', // used only by the event query
    UserLogin: 'login',
    UserLogout: 'logout',
    UserChangePassword: 'changePassword',
    UserLoginWithProvider: 'loginWith',
    UserLinkWithProvider: 'linkWith',
    UserUnlinkFromProvider: 'unlinkFrom',
    UserResetPassword: 'resetPassword',
    UserSetPassword: 'setPassword',
    FilesUpdateContent: 'updateContent',
    FilesGetDownloadUrlById: 'downloadUrlById',
    Aggregate: 'aggregate',
    InvokeCloudFunction: 'invokeCloudFunction',
    InvokeStoredProcedure: 'invokeStoredProcedure'
};

constants.Aggregation = {
    MaxDocumentsCount: 100000
};

constants.Push = {
    NotificationsType: 'Push/Notifications',
    DevicesType: 'Push/Devices'
};

constants.EncodableHeaders = [
    constants.Headers.filter,
    constants.Headers.expand,
    constants.Headers.powerFields,
    constants.Headers.customParameters
];

_.deepExtend(constants, commonConstants);

module.exports = constants;
