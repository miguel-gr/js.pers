js.pers
=======

Javascript Simple Persistence

Alpha Version

The Objective of this project is to create a Simple Framework for javascript persistence.
The initial focus is local persistence but may expand to syncronization with remote data.

Current functionality
-------

```js
// New DAO
var exampleDao = new jsPersDao("Example");

// Insert Object
var ex = {};
ex.name = "One";
ex.type = 7;
exampleDao.save(ex);


// Obtain object by id
exampleDao.get(0);

// Obtain all
exampleDao.getAll();

// Agregation
var exChild = {};
exChild.name = "Example Child";
exampleDao.saveChild(ex, "ExampleChild", exChild);

// This will create other object that can be obtained as an element of an array of "ex"
// or directly through a new Dao like (Note the Entity name: "ExampleChild")
var exampleChildDao = new jsPersDao("ExampleChild");

// Obtain object and all agregated items of Entity Type "ExampleChild";
exampleDao.children("ExampleChild").get(0);

```

Pending functionality
-------

```js

// Obtain object and all agregated items";
exampleDao.children().get(0);

// Criteria
exampleDao.where("type", ">", 2).and("name", "=", "one").getAll();

```

Notes
-------
* All objects are added with an autoincremental identifier named *id*. Example: *ex.id*  
* If any children are obtained they are added to the object as an array in an attribute named as it entity name with the first letter in lowercase. Example: *ex.exampleChild*.
