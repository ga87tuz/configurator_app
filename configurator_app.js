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
// register the application module
b4w.register("configurator_app_main", function(exports, require) {
    
    // import modules used by the app
    var m_app       = require("app");
    var m_cfg       = require("config");
    var m_data      = require("data");
    var m_preloader = require("preloader");
    var m_ver       = require("version");
    var m_material  = require("material");
    var m_obj       = require("objects");
    var m_logic_n   = require("logic_nodes");
    
    //var m_cam     = require("camera");
    var m_scenes  = require("scenes");
    //var m_trans   = require("transform");
    //var m_util    = require("util");
    //var m_rgba      = require("rgba")

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
            show_fps: DEBUG,
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

        m_app.enable_camera_controls();


        //define selected object groups
        // var sel_obj = [m_scenes.get_object_by_name("front_left"), 
        //                 m_scenes.get_object_by_name("front_left_back")]; //init left is selected

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
        // //select object
        // var obj_dropdown = document.getElementById("obj_dropdown");
        // obj_dropdown.addEventListener("change", function(e) {
        //     console.log("selected object: " + this.value);
        //     if(this.value == "left"){
        //         sel_obj = [m_scenes.get_object_by_name("front_left"),
        //                     m_scenes.get_object_by_name("front_left_back")];
        //     } else if (this.value == "right"){
        //         sel_obj = [m_scenes.get_object_by_name("front_right"), 
        //                     m_scenes.get_object_by_name("front_right_back")];
        //     } else if (this.value == "band"){
        //         sel_obj = [m_scenes.get_object_by_name("band_top1"), 
        //         m_scenes.get_object_by_name("band_top2"),
        //         m_scenes.get_object_by_name("band_bottom1"), 
        //         m_scenes.get_object_by_name("band_bottom2")];
        //     } else if (this.value == "cord"){
        //         sel_obj = [m_scenes.get_object_by_name("cord_left"), 
        //         m_scenes.get_object_by_name("cord_right")];
        //     }
        //     else if (this.value == "stitch"){
        //         sel_obj = [m_scenes.get_object_by_name("stitch_left"), 
        //         m_scenes.get_object_by_name("stitch_right"), 
        //         m_scenes.get_object_by_name("stitch_top_inside"), 
        //         m_scenes.get_object_by_name("stitch_top_outside"), 
        //         m_scenes.get_object_by_name("stitch_bottom_inside"), 
        //         m_scenes.get_object_by_name("stitch_bottom_outside")];
        //     }
        // });

        /****change color of elements****/

        //outside_left
        document.getElementById("left_white_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.9,0.9,0.9]);
            })
        });
        document.getElementById("left_red_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.8,0.0,0.0]);
            })
        });
        document.getElementById("left_bordeaux_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.150,0.008,0.0]);
            })
        });
        document.getElementById("left_tanne_green_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.0,0.019,0.0]);
            })
        });
        document.getElementById("left_royal_blue_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.01,0.022,0.6]);
            })
        });
        document.getElementById("left_marine_blue_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.010,0.018,0.1]);
            })
        });
        document.getElementById("left_dark_grey_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.128,0.128,0.128]);
            })
        });
        document.getElementById("left_black_btn").addEventListener("click", function(e) {
            outside_left.forEach(function (obj, idx) {
                change_diffuse_collor(outside_left[idx], [0.0,0.0,0.0]);
            })
        });

        //outside_right
        document.getElementById("right_white_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.9,0.9,0.9]);
            })
        });
        document.getElementById("right_red_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.8,0.0,0.0]);
            })
        });
        document.getElementById("right_bordeaux_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.150,0.008,0.0]);
            })
        });
        document.getElementById("right_tanne_green_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.0,0.019,0.0]);
            })
        });
        document.getElementById("right_royal_blue_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.01,0.022,0.6]);
            })
        });
        document.getElementById("right_marine_blue_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.010,0.018,0.1]);
            })
        });
        document.getElementById("right_dark_grey_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.128,0.128,0.128]);
            })
        });
        document.getElementById("right_black_btn").addEventListener("click", function(e) {
            outside_right.forEach(function (obj, idx) {
                change_diffuse_collor(outside_right[idx], [0.0,0.0,0.0]);
            })
        });

        //Band
        document.getElementById("band_white_btn").addEventListener("click", function(e) {
            band.forEach(function (obj, idx) {
                change_diffuse_collor(band[idx], [0.9,0.9,0.9]);
            })
        });
        document.getElementById("band_black_btn").addEventListener("click", function(e) {
            band.forEach(function (obj, idx) {
                change_diffuse_collor(band[idx], [0.0,0.0,0.0]);
            })
        });

        //Cord
        document.getElementById("cord_white_btn").addEventListener("click", function(e) {
            cord.forEach(function (obj, idx) {
                change_diffuse_collor(cord[idx], [0.9,0.9,0.9]);
            })
        });
        document.getElementById("cord_black_btn").addEventListener("click", function(e) {
            cord.forEach(function (obj, idx) {
                change_diffuse_collor(cord[idx], [0.0,0.0,0.0]);
            })
        });

        //Stitch
        document.getElementById("stitch_white_btn").addEventListener("click", function(e) {
            stitch.forEach(function (obj, idx) {
                change_diffuse_collor(stitch[idx], [0.9,0.9,0.9]);
            })
        });
        document.getElementById("stitch_black_btn").addEventListener("click", function(e) {
            stitch.forEach(function (obj, idx) {
                change_diffuse_collor(stitch[idx], [0.0,0.0,0.0]);
            })
        });
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


