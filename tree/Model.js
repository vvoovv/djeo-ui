define([
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // mixin
	"dojo/has",
	"dojo/_base/array", // forEach
	"dojo/Stateful"
], function(declare, lang, has, array, Stateful){

return declare([Stateful], {

	checkedStrict: true,

	multiState: true,
	
	labelAttr: "name",

	constructor: function(kwArgs) {
		lang.mixin(this, kwArgs);
	},
	
	validateData: function() {
		
	},
	
	destroy: function(){
		// summary:
		//		Destroys this object, releasing connections to the store
		// tags:
		//		extension
	},

	// =======================================================================
	// Methods for traversing hierarchy

	getRoot: function(onItem){
		// summary:
		//		Calls onItem with the root item for the tree, possibly a fabricated item.
		//		Calls onError on error.
		onItem(this.map.document);
	},

	mayHaveChildren: function(feature){
		// summary:
		//		Tells if an item has or may have children.  Implementing logic here
		//		avoids showing +/- expando icon for nodes that we know don't have children.
		//		(For efficiency reasons we may not want to check if an element actually
		//		has children until user clicks the expando node)
		// item: dojo.data.Item
		// tags:
		//		extension
		return !!feature.isContainer;
	},

	getChildren: function(parentFeature, onComplete){
		// summary:
		// 		Calls onComplete() with array of child items of given parent item, all loaded.
		//		Throws exception on error.
		// parentItem: dojo.data.Item
		// onComplete: function(items)
		// tags:
		//		extension
		onComplete(parentFeature.features);
	},

	// =======================================================================
	// Inspecting items

	isItem: function(something){
		// summary:
		//		Returns true if *something* is an item and came from this model instance.
		//		Returns false if *something* is a literal, an item from another model instance,
		//		or is any object other than an item.
		// tags:
		//		extension
	},

	fetchItemByIdentity: function(keywordArgs){
		// summary:
		//		Given the identity of an item, this method returns the item that has
		//		that identity through the onItem callback.  Conforming implementations
		//		should return null if there is no item with the given identity.
		//		Implementations of fetchItemByIdentity() may sometimes return an item
		//		from a local cache and may sometimes fetch an item from a remote server.
		// tags:
		//		extension
	},

	getIdentity: function(feature){
		// summary:
		//		Returns identity for an item
		// tags:
		//		extension
		return feature.id;
	},

	getLabel: function(feature){
		// summary:
		//		Get the label for an item
		// tags:
		//		extension
		return (feature === this.map.document) ? this.rootLabel : (feature[this.labelAttr] ? feature[this.labelAttr] : "");
	},

	// =======================================================================
	// Write interface

	newItem: function(args, parent, insertIndex){
		// summary:
		//		Creates a new item.   See `dojo.data.api.Write` for details on args.
		// args: dojo.dnd.Item
		// parent: Item
		// insertIndex: int?
		// tags:
		//		extension
	},

	pasteItem: function(childItem, oldParentItem, newParentItem, bCopy){
		// summary:
		//		Move or copy an item from one parent item to another.
		//		Used in drag & drop.
		//		If oldParentItem is specified and bCopy is false, childItem is removed from oldParentItem.
		//		If newParentItem is specified, childItem is attached to newParentItem.
		// childItem: Item
		// oldParentItem: Item
		// newParentItem: Item
		// bCopy: Boolean
		// tags:
		//		extension
	},

	// =======================================================================
	// Callbacks

	onChange: function(item){
		// summary:
		//		Callback whenever an item has changed, so that Tree
		//		can update the label, icon, etc.   Note that changes
		//		to an item's children or parent(s) will trigger an
		//		onChildrenChange() so you can ignore those changes here.
		// item: dojo.data.Item
		// tags:
		//		callback
	},

	onChildrenChange: function(parent, newChildrenList){
		// summary:
		//		Callback to do notifications about new, updated, or deleted items.
		// parent: dojo.data.Item
		// newChildrenList: dojo.data.Item[]
		// tags:
		//		callback
	},
	
	getChecked: function (feature){
		return feature.visible;
	},
	
	setChecked: function(feature, newCheckedValue){
		feature.show(newCheckedValue);
		this._updateCheckedChild(feature, newCheckedValue);
		this._updateCheckedParent(feature);
	},
	
	_updateCheckedChild: function (feature, newCheckedValue) {
		this.onChange(feature, "checked", newCheckedValue);
		if (this.mayHaveChildren(feature)) {
			this.getChildren(feature, lang.hitch(this, 
					function ( children ) {
						array.forEach( children, function (child) {
								this._updateCheckedChild(child, newCheckedValue);
							}, 
						this 
						);
					}
				), // end hitch()
				this.onError 
			); // end getChildren()
		}
	},
	
	_updateCheckedParent: function(feature, isMixedState) {
		var parent = feature.parent;
		if (parent === this.map) return;
		var features = parent.features;
		// finding which state the parent has now
		var checkedState = true;
		if (parent.numVisibleFeatures==0) {
			checkedState = false;
		}
		else if (isMixedState || parent.numVisibleFeatures < features.length) {
			checkedState = "mixed";
			isMixedState = true;
		}
		this.onChange(parent, "checked", checkedState);
		this._updateCheckedParent(parent, isMixedState);
	}

});

});
