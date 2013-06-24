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

```

Pending functionality
-------

```js
// Agregation
var exChild = {};
exChild.name = "Example Child";
exampleDao.saveChild(ex, "ExampleChild", exChild);
// This will create other object that can be obtained as an element of an array of "ex"
// or directly through a new Dao like (Note the Entity name: "ExampleChild")
var exampleChildDao = new jsPersDao("ExampleChild");

// Obtain object and all agregated items of Entity Type "ExampleChild";
exampleDao.get(0).children("ExampleChild");

// Obtain object and all agregated items";
exampleDao.get(0).children();

// Criteria
exampleDao.getAll().where("type", ">", 2).and("name", "=", "one");

```


