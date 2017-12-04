define(["modules/app_registry",
		"jQuery",
		"modules/router",
		"modules/options/modified"],
			function(
				AppRegistry,
				$,
				Router,
				Modified) {
	return {
		MozActivityPick: function() {

      if(shared_desc){
        var schema = new RDBSchema(SCHEMA);
        schema.getObject(shared_desc, PHOTO, function(res){
          console.log(JSON.stringify(res.res));
          AppRegistry.image.selectedImage = window.URL.createObjectURL(
            res.res.BLOBdata);
          $("#edit-header").show();
          $("#select-mode").removeClass("hidden");
          Modified.render();
          Router.routing();
        });
      }
      else{
        $("#pick-photo").click(function() {
          setTimeout(function() {					
            var pickImg = new MozActivity({
              name: "pick",
              data: {
                type: ["image/png", "image/jpg", "image/jpeg"],
                nocrop: true
              }
            });
            pickImg.onsuccess = function () { 
                    EXIF.getData(this.result.blob, function(){
                       exif_data = this.exifdata;
                    });
              AppRegistry.image.selectedImage = window.URL.createObjectURL(this.result.blob);
              
              $("#edit-header").show();
              $("#select-mode").removeClass("hidden");
              Modified.render();
              
              Router.routing();
            };							
            pickImg.onerror = function () { 
              alert("Please select or shoot a photo");
              $("#pick-photo").trigger("click");
            };
          }, 500);
        });
      }
		
			$("#home-button").click(function() {
				setTimeout(function() {
					$("#edit-header").hide();
					$("#slider-holder").hide();
					$("#content").html("");
					$("#select-mode ul > li").removeClass("ui-btn-active-override");
					$("#edit-header > h1").text("Picked photo");
					AppRegistry.reset();
				}, 500);
			});
		}
	};
});
