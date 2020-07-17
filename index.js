// configurator_app
/* Copyright (C) 2020  <name of author>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict"

var userID = "default";

// register the application module
b4w.register("configurator_app_main", function(exports, require) {
    
    // import modules used by the app
    var m_app       = require("app");
    var m_cam     = require("camera");
    var m_cam_anim  = require("camera_anim");
    var m_cfg       = require("config");
    var m_container = require("container");
    var m_data      = require("data");
    var m_material  = require("material");
    var m_main     = require("main");
    var m_preloader = require("preloader");
    var m_scenes  = require("scenes");
    var m_trans   = require("transform");
    var m_ver       = require("version");
    // var m_screen  = require("screen");
    // var m_util    = require("util");
    // var m_vec3      = require("vec3");
    // var m_obj       = require("objects");
    // var m_logic_n   = require("logic_nodes");
    // var m_rgba      = require("rgba")

    // detect application mode
    var DEBUG = (m_ver.type() == "DEBUG");

    // automatically detect assets path
    var APP_ASSETS_PATH = m_cfg.get_assets_path("configurator_app");

    /**
     * export the method to initialize the app (called at the bottom of this file)
     */
    exports.init = function() {
        m_app.init({
            canvas_container_id: "main_canvas_container",
            callback: init_cb,
            show_fps: false,
            console_verbose: DEBUG,
            autoresize: true
        });
    }

    /**
     * callback executed when the app is initialized 
     */
    function init_cb(canvas_elem, success) {
        if (!success) {
            console.log("b4w init failure");
            return;
        }

        m_preloader.create_preloader();

        // ignore right-click on the canvas element
        canvas_elem.oncontextmenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        load();
    }

    /**
     * load the scene data
     */
    function load() {
        m_data.load(APP_ASSETS_PATH + "configurator_app.json", load_cb, preloader_cb);
    }

    /**
     * update the app's preloader
     */
    function preloader_cb(percentage) {
        m_preloader.update_preloader(percentage);
    }

    /**
     * callback executed when the scene data is loaded
     */
    function load_cb(data_id, success) {
        if (!success) {
            console.log("b4w load failure");
            return;
        }

        //Deine variables when scene data is loaded
        var final_target_obj = m_scenes.get_object_by_name("face");
        var cam_obj = m_scenes.get_active_camera();
        var distanceLimits = {min: 2.3, max:50}
        var target = m_trans.get_translation(final_target_obj);

        //m_config.set("quality", m_config.P_ULTRA);
        //m_config.set("canvas_resolution_factor", 1010);
        // m_container.resize_to_container(true);

        m_app.enable_camera_controls();
        //set target for camera
        m_cam.target_setup(cam_obj, {pivot : target, use_panning: true});
        //set distance limit to target
        m_cam.target_set_distance_limits(cam_obj, distanceLimits);


        //define selected object groups
        var face = [m_scenes.get_object_by_name("face")];
        var outside_left = [m_scenes.get_object_by_name("front_left"), 
                            m_scenes.get_object_by_name("front_left_back")];
        var outside_right = [m_scenes.get_object_by_name("front_right"), 
                            m_scenes.get_object_by_name("front_right_back")];;
        var outside = [m_scenes.get_object_by_name("front_left"), 
                        m_scenes.get_object_by_name("front_left_back"),
                        m_scenes.get_object_by_name("front_right"), 
                        m_scenes.get_object_by_name("front_right_back")];
        var band = [m_scenes.get_object_by_name("tape_top1"), 
                    m_scenes.get_object_by_name("tape_top2"),
                    m_scenes.get_object_by_name("tape_bottom1"), 
                    m_scenes.get_object_by_name("tape_bottom2")];
        var cord = [m_scenes.get_object_by_name("cord_left"), 
                    m_scenes.get_object_by_name("cord_right")];
        var stitch = [m_scenes.get_object_by_name("stitch_left"), 
                        m_scenes.get_object_by_name("stitch_right"), 
                        m_scenes.get_object_by_name("stitch_top_inside"), 
                        m_scenes.get_object_by_name("stitch_top_outside"), 
                        m_scenes.get_object_by_name("stitch_bottom_inside"), 
                        m_scenes.get_object_by_name("stitch_bottom_outside")];
        
        /**** document handler functions *****/
        // hide or display face
        var checkbox = document.getElementById("face_switch");
            checkbox.addEventListener("change", function(e) {
                var obj = m_scenes.get_object_by_name("face");
                if(this.checked) {
                    m_scenes.show_object(obj);
                } else {
                    m_scenes.hide_object(obj);
                }
                //m_scenes.unload();
                //m_data.unload(obj);
                //m_obj.hide_all_by_data_id(0);
        });
        var face_slider = document.getElementById("face_slider");
        face_slider.addEventListener("input", function(e) {
            console.log("color slider changed!");
            //document.getElementById("test_color").style.backgroundColor = "#ff0000";

            var skin_color_luschan = [ // Skin colors Felix von Luschan
                        [0.953125, 0.9453125, 0.95703125],
                        [0.921875, 0.91796875, 0.91015625],
                        [0.9765625, 0.97265625, 0.96484375],
                        [0.98828125, 0.98046875, 0.8984375],
                        [0.98828125, 0.9609375, 0.8984375],
                        [0.9921875, 0.96484375, 0.89453125],
                        [0.9765625, 0.9375, 0.93359375],
                        [0.94921875, 0.9140625, 0.89453125],
                        [0.953125, 0.94140625, 0.9140625],
                        [0.98046875, 0.984375, 0.953125],
                        [0.984375, 0.96875, 0.92578125],
                        [0.9921875, 0.9609375, 0.87890625],
                        [0.99609375, 0.97265625, 0.87890625],
                        [0.99609375, 0.97265625, 0.87890625],
                        [0.94140625, 0.90234375, 0.76171875],
                        [0.93359375, 0.8828125, 0.67578125],
                        [0.875, 0.8203125, 0.57421875],
                        [0.9453125, 0.8828125, 0.58984375],
                        [0.91796875, 0.8359375, 0.62109375],
                        [0.91796875, 0.84765625, 0.51953125],
                        [0.88671875, 0.765625, 0.40234375],
                        [0.87890625, 0.75390625, 0.4140625],
                        [0.87109375, 0.75390625, 0.48046875],
                        [0.8671875, 0.71875, 0.46484375],
                        [0.77734375, 0.640625, 0.390625],
                        [0.734375, 0.58984375, 0.3828125],
                        [0.609375, 0.41796875, 0.26171875],
                        [0.5546875, 0.34375, 0.2421875],
                        [0.47265625, 0.30078125, 0.1875],
                        [0.390625, 0.19140625, 0.0859375],
                        [0.39453125, 0.1875, 0.125],
                        [0.375, 0.19140625, 0.12890625],
                        [0.33984375, 0.1953125, 0.16015625],
                        [0.25, 0.125, 0.08203125],
                        [0.19140625, 0.14453125, 0.16015625],
                        [0.10546875, 0.109375, 0.1796875]
            ] 

            var skin_color = [ // Skin colors Felix von Luschan
            [255,229,200],
            [255,218,190],
            [255,206,180],
            [255,195,170],
            [240,184,160],
            [225,172,150],
            [210,161,140],
            [195,149,130],
            [180,138,120],
            [165,126,110],
            [150,114,100],
            [200,140,110],//
            [241,194,125],//
            [224,172,105],//default 13
            [198,134,66],//
            [141,85,36],//
            [138,95,60],//
            [135,103,90],
            [120,92,80],
            [105,80,70],
            [90,69,60],
            [75,57,50],
            [60,46,40],    
            [52,37,27],
            [45,34,30],
            [25,15,7],
            [18,10,5],
            [10,5,3]
            ]
            function mapToDezimalRGB(rgb_array) {
                return rgb_array.map(function(element) {
                    return element/255;
                })
            }
            //convert rgb 0...255 to rgb range 0...1
            for (var i=0; i<skin_color.length; i++) {
                skin_color[i] =  mapToDezimalRGB(skin_color[i]);
            }

           
            //document.getElementById("test_color").style.backgroundColor = skin_color[face_slider.value];
            face.forEach(function (obj, idx) {
                change_diffuse_collor(face[idx], skin_color[face_slider.value]);
            })

            //face_slider.backgroundColor = "#ff0000"
            //face_slider.style.webkit.slider.runnable.track = "red";
        })

         // Cart buttons
         var quantity = document.getElementById("quantity");
         quantity.addEventListener("change", function(e) {
            this.value = Math.round(this.value);
         });

         document.getElementById("add_to_cart").addEventListener("click", function(e) {
            console.log("Add to cart button pressed - with userID: "+userID);

            m_app.enable_camera_controls();
            cam_obj = m_scenes.get_active_camera();

            var final_cam_pos_obj = m_scenes.get_object_by_name("cam_screenshot");
            final_target_obj = m_scenes.get_object_by_name("face");

            m_cam.static_setup(cam_obj);

            var position_reached_callback = function() {
                //set target mode and pivot
                var target = m_trans.get_translation(final_target_obj);
                m_cam.target_setup(cam_obj, {pivot : target, use_panning: true});
                
                m_cam.target_set_distance_limits(cam_obj, distanceLimits);
                
                //Take a screenshot m_screen.shot();
                var cb = function(url) {
                    console.log("screenshot callback canvas_data_url: " + url);
                    
                }
                var format = "image/png";
                var quality = "1.0";
                m_main.canvas_data_url(cb, format, quality, true);
                // Show popup
                document.getElementById("popup_text").innerText = "Die Artikelauswahl wurde zum Warenkorb hinzugefügt.\n\nAnzal: " + quantity.value;
                document.getElementById('cart_popup').style.display='block';

            }
            m_cam_anim.move_camera_to_point(cam_obj, final_cam_pos_obj, 15.0, 3.0, position_reached_callback)
        });

        document.getElementById("go_to_cart").addEventListener("click", function(e) {
            console.log("Go to Cart button pressed");
            send_get_request();
        });

        document.getElementById("cart_popup_close").addEventListener("click", function(e) {
            console.log("close x");
            document.getElementById('cart_popup').style.display='none';
        });
        document.getElementById("cart_popup_continue_btn").addEventListener("click", function(e) {
            console.log("continue btn clicked");
            document.getElementById('cart_popup').style.display='none';

        });
        document.getElementById("cart_popup_go_to_cart_btn").addEventListener("click", function(e) {
            console.log("popup go to cart btn clicked");
        });

        function sendConfigChangeToServer (configKey, configValue, userID) {
            var change = {};
            change[configKey] = configValue;
            change['userID'] = userID;      
            // console.log("config change is: ", change);         
            $.ajax({
                type: "POST",
                async: false,
                url: "/session_handler/configChange",
                data: JSON.stringify(change),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){alert(data);},
                failure: function(errMsg) {
                    alert(errMsg);
                }
          });
          return
        }

        

        /****Add on click listeners for color radio buttons****/
        //outside_left
        document.getElementById("left_white_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.9,0.9,0.9]);
            })
            var configKey = "left_color";
            var configValue = "white";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("left_red_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.8,0.0,0.0]);
            })
            var configKey = "left_color";
            var configValue = "red";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("left_bordeaux_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.150,0.008,0.0]);
            })
            var configKey = "left_color";
            var configValue = "bordeaux";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("left_royal_blue_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.01,0.022,0.6]);
            })
            var configKey = "left_color";
            var configValue = "royal_blue";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("left_marine_blue_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.010,0.018,0.1]);
            })
            var configKey = "left_color";
            var configValue = "marine_blue";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("left_dark_grey_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.128,0.128,0.128]);
            })
            var configKey = "left_color";
            var configValue = "dark_grey";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("left_black_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.0,0.0,0.0]);
            })
            var configKey = "left_color";
            var configValue = "black";
            sendConfigChangeToServer (configKey, configValue, userID);
        });

        //outside_right
        document.getElementById("right_white_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.9,0.9,0.9]);
            })
            var configKey = "right_color";
            var configValue = "white";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("right_red_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.8,0.0,0.0]);
            })
            var configKey = "right_color";
            var configValue = "red";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("right_bordeaux_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.150,0.008,0.0]);
            })
            var configKey = "right_color";
            var configValue = "bordeaux";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("right_royal_blue_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.01,0.022,0.6]);
            })
            var configKey = "right_color";
            var configValue = "royal_blue";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("right_marine_blue_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.010,0.018,0.1]);
            })
            var configKey = "right_color";
            var configValue = "marine_blue";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("right_dark_grey_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.128,0.128,0.128]);
            })
            var configKey = "right_color";
            var configValue = "dark_grey";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("right_black_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.0,0.0,0.0]);
            })
            var configKey = "right_color";
            var configValue = "black";
            sendConfigChangeToServer (configKey, configValue, userID);
        });

        //Band
        document.getElementById("band_white_btn").addEventListener("click", function(e) {
            band.forEach(function (obj, idx) {
                change_diffuse_collor(band[idx], [0.9,0.9,0.9]);
            })
            var configKey = "band_color";
            var configValue = "white";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("band_black_btn").addEventListener("click", function(e) {
            band.forEach(function (obj, idx) {
                change_diffuse_collor(band[idx], [0.0,0.0,0.0]);
            })
            var configKey = "band_color";
            var configValue = "black";
            sendConfigChangeToServer (configKey, configValue, userID);
        });

        //Cord
        document.getElementById("cord_white_btn").addEventListener("click", function(e) {
            cord.forEach(function (obj, idx) {
                change_diffuse_collor(cord[idx], [0.9,0.9,0.9]);
            })
            var configKey = "cord_color";
            var configValue = "white";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("cord_black_btn").addEventListener("click", function(e) {
            cord.forEach(function (obj, idx) {
                change_diffuse_collor(cord[idx], [0.0,0.0,0.0]);
            })
            var configKey = "cord_color";
            var configValue = "black";
            sendConfigChangeToServer (configKey, configValue, userID);
        });

        //Stitch
        document.getElementById("stitch_white_btn").addEventListener("click", function(e) {
            stitch.forEach(function (obj, idx) {
                change_diffuse_collor(stitch[idx], [0.9,0.9,0.9]);
            })
            var configKey = "stitch_color";
            var configValue = "white";
            sendConfigChangeToServer (configKey, configValue, userID);
        });
        document.getElementById("stitch_black_btn").addEventListener("click", function(e) {
            stitch.forEach(function (obj, idx) {
                change_diffuse_collor(stitch[idx], [0.0,0.0,0.0]);
            })
            var configKey = "stitch_color";
            var configValue = "black";
            sendConfigChangeToServer (configKey, configValue, userID);
        });


        /****Initialize "checked" states for color radio buttons****/
        document.getElementById("left_dark_grey_btn").click();
        document.getElementById("right_dark_grey_btn").click();
        document.getElementById("band_white_btn").click();
        document.getElementById("cord_white_btn").click();
        document.getElementById("stitch_white_btn").click();
    }

    function change_diffuse_collor(obj, color) {
        var mat = m_material.get_materials_names(obj)[0];
        m_material.set_diffuse_color(obj, mat, color);
        //var diffuse_color = m_material.get_diffuse_color(obj, "Material");
        //var diffuse_color_factor = m_material.get_diffuse_color_factor(obj, "Material");
        //var diffuse_intensity = m_material.get_diffuse_intensity(obj, "Material");
        //m_material.set_diffuse_color_factor(obj, "Material", 0.05);
        //m_material.set_diffuse_intensity(obj, "Material", 0.2)
        //m_material.set_diffuse_color(obj, "Material.001", m_rgba.from_values(1.0, 0.0, 0.0, 1.0));
    }
});

// import the app module and start the app by calling the init method
b4w.require("configurator_app_main").init();


