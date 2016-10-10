import Sitefinity from 'Sitefinity';
import Query from 'query/Query';
import initDataStore from 'kendo.sitefinity';

(function () {
    Sitefinity.Query = Query;
    Sitefinity.initDataSource = initDataStore;

    module.exports = Sitefinity;
}());