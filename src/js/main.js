/**
 * Initialise Controller
 */
controller = require("./controller/controller");
helper = require("./helper/helper");
global.cont = new controller();
global.helper = new helper();
global.endpoint = "resultSet1";

