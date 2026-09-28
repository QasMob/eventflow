const EventFlow = require('./index')


const analytics = new EventFlow({apiKey: 'pk_EQxFJ8GGBsxMiGXEq_StR'});

analytics.track('idkMobeen', {company: 'mobs'}, 'user1');
