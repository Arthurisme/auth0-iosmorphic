'use strict';

export default class AuthenticationSetup {
    constructor(everlive, options = {}) {
        this.onAuthenticationRequired = options.onAuthenticationRequired;
        this.persist = options.persist;
        this.everlive = everlive;
    }
}