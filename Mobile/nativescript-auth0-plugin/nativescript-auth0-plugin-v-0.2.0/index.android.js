var appSettings = require("application-settings");
var util = require("utils/utils");
var application = require("application");
var common = require("./common");

var localResolve;
var reciever;

exports.initalize = function () {
    application.on(application.launchEvent, function (args) {
        if (args.android) {
            var thiz = application.android.context;
            var lock = new com.auth0.lock.Lock.Builder()
            .loadFromApplication(thiz)
            //Other configuration goes here
            .closable(thiz)
            .build();
            
            global.a0lock = lock;
        }
    });
    
    //Activity OnCreate
    application.android.on(application.AndroidApplication.activityCreatedEvent, function (args) {
        reciever = new android.content.IntentFilter(com.auth0.lock.Lock.AUTHENTICATION_ACTION);
        application.android.registerBroadcastReceiver(reciever, recieverCallback);
    });
    
    //Activity OnDestroy
    application.android.on(application.AndroidApplication.activityDestroyedEvent, function (args) {
        application.android.unregisterBroadcastReceiver(reciever);
    });
}

exports.show = function(page) {
	return new Promise(function (resolve, reject) {
        try
        {
            localResolve = resolve;
            var context = util.ad.getApplicationContext();
            var lockIntent = new android.content.Intent(application.android.foregroundActivity, com.auth0.lock.LockActivity.class);
            
            if (lockIntent.resolveActivity(context.getPackageManager()) != null) {
                application.android.foregroundActivity.startActivity(lockIntent);	
            }
            
        }
        catch(args){
            reject(args);
        }
	});
}

function recieverCallback(context, intent){
        debugger;
        var profile = intent.getParcelableExtra("profile");
        var token = intent.getParcelableExtra("token");
        
        localResolve({
            profile: profile,
            token: token
        })
}