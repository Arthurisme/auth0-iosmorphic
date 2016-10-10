import {parseUtilities} from 'common/utils';

export default class ErrorProcessor {
    processError(query, data, err) {
        const setup = data.sdk.setup;

        var parseOnlyCompleteDateTimeString = setup && setup.parseOnlyCompleteDateTimeObjects;
        var reviver = parseUtilities.getReviver(parseOnlyCompleteDateTimeString);

        return parseUtilities.parseXhrError(reviver, err);
    }
}