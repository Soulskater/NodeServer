/**
 * Created by MCG on 2015.02.24..
 */

var routes = [
    {
        path: '/',
        content: require('./services/index')
    },
    {
        path: '/api/user',
        content: require('./api/user/authenticationApi')
    },
    {
        path: '/api/projects',
        content: require('./api/projects/projectsApi')
    },
    {
        path: '/api/blog',
        content: require('./api/blog/blogApi')
    },
    {
        path: '/api/blog/comment',
        content: require('./api/blog/comment/blogCommentApi')
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