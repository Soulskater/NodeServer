/**
 * Created by MCG on 2015.02.24..
 */

var routes = [
    {
        path: '/',
        content: require('./services/index')
    },
    {
        path: '/users',
        content: require('./services/users')
    }
];

module.exports = function (app) {
    return {
        createRoutes: function () {
            for (var i = 0, len = routes.length; i < len; i++) {
                var route = routes[i];
                app.use(route.path, route.content);
            }
        }
    };
};