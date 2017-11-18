var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jsonData =require('./public/data');

var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var typeDefs = [`
type Query {
  hello: String
  userDetails(id:ID!): User
  getToDos(toDoId:ID!): Todos
  activeUsers: [User]
}

type User {
  id: String,
  fName: String,
  lName: String,
  email: String,
  pinCode: Int,
  birthDate: String,
  isActive: Boolean,
  todos: [Todos]
}

type Todos{
  id: String,
  userid: String,
  text: String,
  done: Boolean
}

schema {
  query: Query
}`];

var resolvers = {
  Query: {
    hello(root) {
      return 'world';
    },
    getToDos(obj, args, context) {
      console.log(args.toDoId);
      for(var j=0;j<jsonData.Todos.length;j++){

            if(jsonData.Todos[j].id==args.toDoId){
              return(jsonData.Todos[j])
            }    
        }
    },
    userDetails(obj, args, context) {
      console.log(args.id);
      for(var i=0;i< jsonData.User.length; i++){
        if(jsonData.User[i].id==args.id){
          var todos=[];
          for(var j=0;j<jsonData.Todos.length;j++){

            if(jsonData.Todos[j].userid==jsonData.User[i].id){
              todos.push(jsonData.Todos[j]);
            } 
            
          }
          var userdata=jsonData.User[i];
          userdata.todos=todos;
          console.log(userdata)
          return userdata;
        }
      }
      return null;
    },
    activeUsers(obj, args, context) {
      var usersdata=[];
      for(var i=0;i< jsonData.User.length; i++){
        if(jsonData.User[i].isActive){
          var user=jsonData.User[i];
          var todos=[];
          for(var j=0;j<jsonData.Todos.length;j++){

            if(jsonData.Todos[j].userid==user.id){
              todos.push(jsonData.Todos[j]);
            } 
            
          }
          user.todos=todos;
          console.log(user)
          usersdata.push(user)
          
        }
      }
      return usersdata;
    }
  }
};


var schema = makeExecutableSchema({typeDefs, resolvers});

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
