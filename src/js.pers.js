
/**
 * Persistence.
 */

Dao = Class.extend({
    // Type of this DAO
	type:"",
	// Ids of current entities for this DAO
	ids:[],
	// Children DAOs
	childrenDAOs:{},
	// Types of children that will be obtained in a query
	childrenTypesForQuery:[],
	
	init: function(entityType) {
        this.type = entityType;
        this.ids = this.loadIds();
	},

    /**
     * Save or updates an entity
     */
    save: function(entity){
        var id = this.getEntityId(entity);
        if(!id){ // New Id
            id = this.getMaxId()+1;
            entity.id = id;
        }
        var name = this.type+":"+id;
        window.localStorage.setItem(name, JSON.stringify(entity));
        this.adId(id);
    },

    /**
     * Save a child
     */
    saveChild: function(parent, childType, child){
        if(parent==null || childType==null || child==null){
            console.error("All parameters are needed");
        }
        // Save child
        var childDao = this.getChildDao(childType);
        childDao.save(child);
        // Update parent
        if(typeof parent.childrenIds === "undefined"){
            parent.childrenIds = {};
        }
        if(typeof parent.childrenIds[childType] === "undefined"){
            parent.childrenIds[childType] = [];
        }
        for(var i=0; i<=parent.childrenIds[childType].length; i++){
            if(child.id===parent.childrenIds[childType][i]) return; // Id already added
        }
        parent.childrenIds[childType].push(child.id); // Add new child Id
        parent.childrenIds[childType].sort(function(a,b){return a - b});
        this.save(parent);
    },

    /**
     * Get an entity by its id, null if not found
     */
    get: function(id){
        var obj = JSON.parse(window.localStorage.getItem(this.type+":"+id));
        // Get children if requested
        if(this.childrenTypesForQuery.length>0){
            for(var i=0; i<this.childrenTypesForQuery.length; i++){
                var currChildType = this.childrenTypesForQuery[i];
                var childDao = this.getChildDao(currChildType);
                var attrName=currChildType.substr(0,1).toLowerCase()+currChildType.substr(1);
                obj[attrName]=[];
                if(obj.childrenIds){
                    for(var j=0; j<obj.childrenIds[currChildType].length; j++){
                        obj[attrName].push(childDao.get(obj.childrenIds[currChildType][j]));
                    }
                }
            }
            this.childrenTypesForQuery = []; // Reset values
        }
        return obj;
    },

    /**
     * Get all entities
     */
    getAll: function(){
        var res = [];
        for(var i=0; i<this.ids.length; i++){
            var obj = this.get(this.ids[i]);
            if(obj!=null){
                res.push(obj);
            } else {
                console.info("Should not be null! - "+this.type+":"+i);
            }
        }
        return res;
    },
    
    /**
     * Define the children of this entity that will be obtained or removed.
     * @param childrenTypes can be a String or an Array of Strings
     */
    children: function(childrenTypes){
        var tmpArray = childrenTypes;
        if( typeof childrenTypes === 'string' ) {
            tmpArray = [];
            tmpArray.push(childrenTypes);
        }
        this.childrenTypesForQuery = this.childrenTypesForQuery.concat(tmpArray);
        return this;
    },

    /**
     * Remove an entity. If there are children defined (using the function children()) they are removed too.
     */
    delete: function(id){
        var obj = JSON.parse(window.localStorage.getItem(this.type+":"+id));
        // Delete children if requested
        if(this.childrenTypesForQuery.length>0 && obj.childrenIds){
            for(var i=0; i<this.childrenTypesForQuery.length; i++){
                var currChildType = this.childrenTypesForQuery[i];
                var ids = JSON.parse(window.localStorage.getItem(currChildType+":ids"));
                for(var j=0; j<obj.childrenIds[currChildType].length; j++){
                    // Remove item
                    var idOfChild = obj.childrenIds[currChildType][j];
                    var name = currChildType+":"+idOfChild;
                    window.localStorage.removeItem(name);
                }
                // Update Ids in child
                var remindIds = this.getIdsDifference(ids, obj.childrenIds[currChildType]);
                window.localStorage.setItem(currChildType+":ids", JSON.stringify(remindIds));
                this.getChildDao(currChildType).loadIds();
            }
            this.childrenTypesForQuery = []; // Reset values
        }
        window.localStorage.removeItem(this.type+":"+id);
        // Update Ids
        this.ids = this.getIdsDifference(this.ids, id);
        window.localStorage.setItem(this.getIdsListName(), JSON.stringify(this.ids));
    },
    
    // ----------------------
    
    /**
     * Load ids from storage to DAO's memory
     */
    loadIds: function(){
        var ids = JSON.parse(window.localStorage.getItem(this.getIdsListName()));
        if(ids!=null){
            this.ids = ids;
        }
        return this.ids;
    },

    // Get difference of Ids (may need to consider backwards compatibility: http://bit.ly/MOUGKh)
    getIdsDifference: function(original, toRemove){
        var tmpArray = toRemove;
        if( typeof tmpArray === 'number' ) {
            tmpArray = [];
            tmpArray.push(toRemove);
        }
        return original.filter(function(i) {return tmpArray.indexOf(i) < 0;});
    },
    
    
    // Get the id of an entity, returns false if not present
    getEntityId: function(entity){
        var res = parseInt(entity.id);
        if(isNaN(res)) return false;
        return res;
    },
    
    // Get name of the Ids List
    getIdsListName: function(){
        return this.type+":ids";
    },
    
    // get max id
    getMaxId: function(){
        if(this.ids.length===0){
            return 0;
        }
        return this.ids[this.ids.length-1];
    },
    
    // Add a new Id if needed
    adId: function(id){
        for(var i=0; i<=this.ids.length; i++){
            if(id===this.ids[i]) return; // Id already added
        }
        this.ids.push(id); // Add new Id
        this.ids.sort(function(a,b){return a - b});
        window.localStorage.setItem(this.getIdsListName(), JSON.stringify(this.ids));
    },

    // Get a child Dao, if does not exits, it is created
    getChildDao: function(name){
        if(typeof this.childrenDAOs[name] === "undefined"){
            this.childrenDAOs[name] = new Dao(name);
        }
        return this.childrenDAOs[name];
    }
    
});
