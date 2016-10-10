const TargetAuthentication = require('auth/Authentication');
const DataQuery = require('common/dataQuery/DataQuery');
const utils = require('common/utils');

class Authentication extends TargetAuthentication {
    constructor(options, sdk) {
        super(options, sdk);
        this._sdk = sdk;
    }

    _buildQuery(data, op, success, error) {
        const query = new DataQuery({
            operation: op,
            meta: this._getQueryMeta(),
            skipAuth: true,
            onSuccess: success,
            onError: error
        });

        if (data) {
            query.data = data;
        }

        return query;
    }

    login(username, password, success, error) {
        return utils.buildPromise((success, error) => {
            const successFunc = (res) => {
                this._loginSuccess(res);
                success(res)
            };

            const loginQuery = this._buildQuery({
                username: username,
                password: password,
                grant_type: 'password'
            }, DataQuery.operations.UserLogin, successFunc, error);

            return super.login(loginQuery);
        }, success, error);

    }

    logout(success, error) {
        return utils.buildPromise((success, error) => {
            const successFunc = () => {
                this._logoutSuccess.apply(this, arguments);
                success.apply(null, arguments);
            };

            const errorFunc = (err) => {
                if (err.code === 301) { //invalid token
                    this.clearAuthorization();
                }

                error.apply(null, arguments);
            };

            const logoutQuery = this._buildQuery(null, DataQuery.operations.UserLogout, successFunc, errorFunc);
            return super.logout(logoutQuery);
        }, success, error);

    }
}

module.exports = Authentication;