const _ = require('underscore');
const {DataQueryOperations, Events} = require('constants');
const EventQuery = require('query/EventQuery');

const beforeExecuteAllowedOperations = [
    DataQueryOperations.Count,
    DataQueryOperations.Read,
    DataQueryOperations.Create,
    DataQueryOperations.Update,
    DataQueryOperations.UpdateById,
    DataQueryOperations.Delete,
    DataQueryOperations.DeleteById,
    DataQueryOperations.ReadById,
    DataQueryOperations.Aggregate,
    DataQueryOperations.RawUpdate
];

export default class EventQueryProcessor {
    processDataQuery(query, iterator, data, value) {
        if (_.contains(beforeExecuteAllowedOperations, query.operation)) {
            var eventQuery = EventQuery.fromDataQuery(query);
            data.sdk._emitter.emit(Events.BeforeExecute, eventQuery);
            if (eventQuery.isCancelled()) {
                return iterator.cancel();
            }

            query.applyEventQuery(eventQuery);
        }

        return iterator.next(value);
    }
}