/**
 * Created by MCG on 2015.03.01..
 */
var schema = require("../database/schema");
var types = require('../database/objectTypes');
var factory = require('./modelFactory');

var userSchema = new schema("User",
    {
        userID: {
            isKeyField: true,
            isIdentity: true,
            isRequired: true,
            type: types.number
        },
        userName: {
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        password: {
            isKeyField: false,
            isRequired: true,
            type: types.string
        },
        token: {
            isKeyField: false,
            isRequired: true,
            type: types.string
        }
        ,
        blogID: {
            isKeyField: false,
            isRequired: true,
            reference: {
                name: "Blog",
                referencedField: "blogID"
            },
            type: types.number
        }
    });

/*declare @username
declare @blog table ( blogID int, name varchar( 30 ))
declare @user table ( blogid int, username varchar( 100 ) )

insert dbo.[Blog](name)
output inserted.blogid, inserted.name into @table( id, name )
select 'Béla blog2'
union all
select 'Béla blog3'

insert dbo.[User](username)
output inserted.username into @table( username )
select 'Béla blog2'
union all
select 'Béla blog3'

insert into dbo.[User](username,password,token,blogid)
select 'Béla' + cast( t.blogid as varchar( 1000 ) ) , 'tesdgst', 'belatoken', t.blogid
from @table t*/

factory.registerSchema(userSchema);