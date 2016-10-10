import _ from 'underscore';
import utils, {parseUtilities} from 'utils';
import {EverliveErrors} from 'EverliveError';

export default class AuthenticationProcessor {
    processDataQuery(query, iterator, data, value) {
        if (!query.skipAuth && data.sdk.authentication && data.sdk.authentication.isAuthenticationInProgress()) {
            iterator.prependOnceListener('error', (error, ev) => {

                const err = parseUtilities.parseErrorOrResponse(error);
                if (err && (err.code === EverliveErrors.invalidToken.code || err.code === EverliveErrors.expiredToken.code)) {
                    ev.cancel();
                    const whenAuthenticatedPromise = data.sdk.authentication._ensureAuthentication();
                    if (!query.noRetry) {
                        whenAuthenticatedPromise.then(function () {
                            if (query.headers && query.headers.authorization) {
                                //at this stage if a token is used for authentication it is already invalidated
                                //we need to set the new one to the query
                                const authHeader = utils.buildAuthHeader(data.sdk.setup);
                                _.extend(query.headers, authHeader);
                            }

                            return iterator.restart();
                        });
                    } else {
                        return iterator.next(value);
                    }
                }
            });

            //if we are currently authenticating, queue the data query after we have logged in
            if (data.sdk.authentication.isAuthenticating()) {
                var whenAuthenticatedPromise = data.sdk.authentication._ensureAuthentication();
                if (!query.noRetry) {
                    whenAuthenticatedPromise.then(function () {
                        return iterator.restart();
                    });
                }

                return whenAuthenticatedPromise;
            } else {
                return iterator.next(value);
            }
        } else {
            return iterator.next(value);
        }
    }
}