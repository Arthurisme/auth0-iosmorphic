export default class OnlineQueryProcessor {
    processDataQuery(query, iterator, data, value) {
        const {request} = query;

        request._execute()
            .then(result => {
                return iterator.next(result);
            })
            .catch(err => iterator.error(err));
    }
}