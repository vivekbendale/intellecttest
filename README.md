Steps to Run -
1.Git Clone\n
2.npm install
3.npm start

Enpoint URL - http://localhost:3000/graphiql

Quries to Test on Graphql - 


1. Get User User Details
{
  userDetails(id:1) {
    fName
    lName
    todos {
      id
    }
  }
}

2.Get Specific ToDo Item
{
  getToDos(toDoId:101) {
    id
    text
  }
}


3.Get All active Users with related todos
{
  activeUsers {
    id
    fName
    lName
    todos {
      id
    }
  }
}

