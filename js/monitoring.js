(function () {
    'use strict';

    var config = window.PORTFOLIO_MONITORING || {};
    var events = [];
    var maxEvents = 20;
    var environment = config.environment || (location.hostname === '127.0.0.1' ? 'local' : 'production');
    var release = config.release || 'portfolio-static@local';
    var sentryDsn = config.sentryDsn || '';
    var hasSentry = Boolean(window.Sentry && typeof window.Sentry.init === 'function');

    function remember(event) {
        events.push({
            type: event.type,
            message: event.message,
            source: event.source || 'browser',
            timestamp: new Date().toISOString()
        });

        if (events.length > maxEvents) {
            events.shift();
        }
    }

    function captureError(error, context) {
        var message = error && error.message ? error.message : String(error || 'Unknown error');

        remember({
            type: 'error',
            message: message,
            source: context || 'window'
        });

        if (hasSentry && window.Sentry.captureException && error instanceof Error) {
            window.Sentry.captureException(error);
        }
    }

    function captureMessage(message, context) {
        remember({
            type: 'message',
            message: message,
            source: context || 'manual'
        });

        if (hasSentry && window.Sentry.captureMessage) {
            window.Sentry.captureMessage(message);
        }
    }

    if (sentryDsn && hasSentry) {
        window.Sentry.init({
            dsn: sentryDsn,
            environment: environment,
            release: release,
            tracesSampleRate: 0
        });
    }

    window.addEventListener('error', function (event) {
        captureError(event.error || event.message, event.filename || 'window.error');
    });

    window.addEventListener('unhandledrejection', function (event) {
        captureError(event.reason || 'Unhandled promise rejection', 'unhandledrejection');
    });

    window.portfolioMonitoring = {
        captureError: captureError,
        captureMessage: captureMessage,
        getBufferedEvents: function () {
            return events.slice();
        },
        isSentryActive: function () {
            return Boolean(sentryDsn && hasSentry);
        }
    };

    document.documentElement.setAttribute('data-monitoring', 'ready');
    document.documentElement.setAttribute('data-sentry-active', String(Boolean(sentryDsn && hasSentry)));
})();
