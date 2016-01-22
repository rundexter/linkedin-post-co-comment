var Linkedin = require('node-linkedin')(),
    util = require('./util.js');

var pickInputs = {
        'id': { key: 'id', validate: { req: true } },
        'updateKey': { key: 'updateKey', validate: { req: true } },
        'comment': { key: 'comment', validate: { req: true } }
    },
    pickOutputs = {
        'id': 'id',
        'comment': 'comment',
        'updateKey': 'updateKey',
        'updateUrl': 'updateUrl'
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            linkedIn = Linkedin.init(dexter.provider('linkedin').credentials('access_token')),
            apiURL = 'https://api.linkedin.com/v1/companies/' + inputs.id + '/updates/key=' + inputs.updateKey + '/update-comments-as-company/';

        linkedIn.companies.createCall('POST', apiURL, {comment: inputs.comment}, function(err, data) {
            if (err || (data && data.errorCode !== undefined))
                this.fail(err || (data.message || 'Error Code: '.concat(data.errorCode)));
            else
                this.complete(util.pickOutputs(data, pickOutputs));

        }.bind(this))(linkedIn.companies.config);
    }
};
