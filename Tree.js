define([
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // mixin
	"dojo/aspect", // after
	"djeo/common/Placemark", // getImgSrc
	"cbtree/Tree",
	"./tree/Model"
], function(declare, lang, aspect, P, Tree, Model){

return declare([Tree], {
	
	rootLabel: "Map features",

	constructor: function(kwArgs){
		if (!kwArgs.map) {
			throw new Error("'map' attribute must be provided as an argument");
		}
		if (!this.model) {
			var modelKwArgs = {
				map: kwArgs.map,
				rootLabel: kwArgs.rootLabel || this.rootLabel
			}
			if (kwArgs.modelOptions) {
				lang.mixin(modelKwArgs, kwArgs.modelOptions);
			}
			this.model = new Model(modelKwArgs);
		}
	},
	
	postCreate: function(){
		this.inherited(arguments);
		aspect.after(this, "onDblClick", function(feature, node, evt){
			this.map.zoomTo(feature);
		}, true);
	},
	
	getIconClass: function(feature, opened){
		var result;
		if (feature.isContainer){
			result = this.inherited(arguments);
		}
		else {
			// calculated style
			var cs = feature.reg.cs;
			if ( (cs && (cs.guiIcon || P.getImgSrc(cs))) || feature.isArea()) {
				result = "djeoBaseFeature";
			}
		}
		return result;
	},
	
	getIconStyle: function(feature, opened){
		var result;
		if (!feature.isContainer) {
			// check if we have an icon
			var cs = feature.reg.cs;
			if (!(cs && cs.guiIcon) && feature.isArea()) {
				result = {
					backgroundColor: cs.area && cs.area.fill ? cs.area.fill : cs.fill
				}
			}
			else if (cs){
				var src = cs.guiIcon || P.getImgSrc(cs);
				if (src) {
					result = {
						backgroundImage: "url("+this.map.engine.factories.Placemark._getImageUrl(src)+")"
					};
				}
			}
		}
		return result;
	}
});

});
