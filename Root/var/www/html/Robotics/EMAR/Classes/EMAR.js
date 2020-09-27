var EMAR = {
    location: 1,
    zone: 1,
    device: 5,
    controller: 4,
    LifeDevice: 1,
    Create: function() {
        $.post(window.location.href, $("#emar_create").serialize(), function(resp) {
            var resp = jQuery.parseJSON(resp);
            switch (resp.Response) {
                case "OK":
                    GeniSys.ResetForm("emar_create");
                    $('.modal-title').text('EMAR Devices');
                    $('.modal-body').html("EMAR Device ID #" + resp.EDID + " created! Please save the API keys safely. The device's credentials are provided below. The credentials can be reset in the GeniSyAI Security Devices area.<br /><br /><strong>Device ID:</strong> " + resp.DID + "<br /><strong>MQTT User:</strong> " + resp.MU + "<br /><strong>MQTT Password:</strong> " + resp.MP + "<br /><br /><strong>Blockchain User:</strong> " + resp.BU + "<br /><strong>Blockchain Pass:</strong> " + resp.BP + "<br /><br /><strong>App ID:</strong> " + resp.AppID + "<br /><strong>App Key:</strong> " + resp.AppKey + "<br /><br />" + resp.Message);
                    $('#responsive-modal').modal('show');
                    Logging.logMessage("Core", "Forms", "Device ID #" + resp.DID + " created!");
                    break;
                default:
                    msg = "EMAR Create Failed: " + resp.Message
                    Logging.logMessage("Core", "EMAR", msg);
                    break;
            }
        });
    },
    Update: function() {
        $.post(window.location.href, $("#emar_update").serialize(), function(resp) {
            console.log(resp)
            var resp = jQuery.parseJSON(resp);
            switch (resp.Response) {
                case "OK":
                    $('.modal-title').text('EMAR Update');
                    $('.modal-body').text("EMAR Update OK");
                    $('#responsive-modal').modal('show');
                    Logging.logMessage("Core", "EMAR", "EMAR Update OK");
                    break;
                default:
                    msg = "EMAR Update Failed: " + resp.Message
                    Logging.logMessage("Core", "EMAR", msg);
                    break;
            }
        });
    },
    ResetMqtt: function() {
        $.post(window.location.href, { "reset_mqtt": 1, "id": $("#did").val(), "lid": $("#lid").val(), "zid": $("#zid").val() },
            function(resp) {
                var resp = jQuery.parseJSON(resp);
                switch (resp.Response) {
                    case "OK":
                        Logging.logMessage("Core", "Forms", "Reset OK");
                        GeniSysAI.mqttpa = resp.P;
                        GeniSysAI.mqttpae = resp.P.replace(/\S/gi, '*');
                        $("#idmqttp").text(GeniSysAI.mqttpae);
                        $('.modal-title').text('New MQTT Password');
                        $('.modal-body').text("This device's new MQTT password is: " + resp.P);
                        $('#responsive-modal').modal('show');
                        break;
                    default:
                        msg = "Credentials reset failed: " + resp.Message
                        Logging.logMessage("Core", "Credentials", msg);
                        break;
                }
            });
    },
    ResetDvcKey: function() {
        $.post(window.location.href, { "reset_key": 1, "id": $("#did").val(), "lid": $("#lid").val(), "zid": $("#zid").val() },
            function(resp) {
                var resp = jQuery.parseJSON(resp);
                switch (resp.Response) {
                    case "OK":
                        Logging.logMessage("Core", "Forms", "Reset OK");
                        $('.modal-title').text('New Device Key');
                        $('.modal-body').text("This device's new key is: " + resp.P);
                        $('#responsive-modal').modal('show');
                        break;
                    default:
                        msg = "Reset failed: " + resp.Message
                        Logging.logMessage("Core", "Forms", msg);
                        break;
                }
            });
    },
    wheels: function(direction) {
        iotJumpWay.publishToDeviceCommands({
            "loc": EMAR.location,
            "zne": EMAR.zone,
            "dvc": EMAR.device,
            "message": {
                "From": EMAR.controller,
                "Type": "Wheels",
                "Value": direction,
                "Message": "Move " + direction
            }
        });
    },
    arm: function(direction) {
        iotJumpWay.publishToDeviceCommands({
            "loc": EMAR.location,
            "zne": EMAR.zone,
            "dvc": EMAR.device,
            "message": {
                "From": EMAR.controller,
                "Type": "Arm",
                "Value": direction,
                "Message": "Move " + direction
            }
        });
    },
    cams: function(direction) {
        iotJumpWay.publishToDeviceCommands({
            "loc": EMAR.location,
            "zne": EMAR.zone,
            "dvc": EMAR.device,
            "message": {
                "From": EMAR.controller,
                "Type": "Head",
                "Value": direction,
                "Message": "Move " + direction
            }
        });
    },
    HideInputs: function() {
        $('#ip').attr('type', 'password');
        $('#mac').attr('type', 'password');
        $('#sport').attr('type', 'password');
        $('#sportf').attr('type', 'password');
        $('#sckport').attr('type', 'password');
        $('#sdir').attr('type', 'password');

        EMAR.mqttua = $("#mqttu").text();
        EMAR.mqttuae = $("#mqttu").text().replace(/\S/gi, '*');
        EMAR.mqttpa = $("#mqttp").text();
        EMAR.mqttpae = $("#mqttp").text().replace(/\S/gi, '*');
        EMAR.idappida = $("#idappid").text();
        EMAR.idappidae = $("#idappid").text().replace(/\S/gi, '*');
        EMAR.bcida = $("#bcid").text();
        EMAR.bcidae = $("#bcid").text().replace(/\S/gi, '*');

        $("#mqttut").text(GeniSysAI.mqttu3ae);
        $("#mqttpt").text(GeniSysAI.mqttp3ae);
        $("#idappid").text(GeniSysAI.idappidae);
        $("#bcid").text(GeniSysAI.bcidae);

        $("#mqttu").text(EMAR.mqttuae);
        $("#mqttp").text(EMAR.mqttpae);
        $("#idappid").text(EMAR.idappidae);
        $("#bcid").text(EMAR.bcidae);
    },
    GetLifes: function() {
        $.post(window.location.href, { "get_lifes": 1, "device": $("#id").val() }, function(resp) {
            var resp = jQuery.parseJSON(resp);
            switch (resp.Response) {
                case "OK":
                    if (resp.ResponseData["status"] == "ONLINE") {
                        $("#offline1").removeClass("hide");
                        $("#online1").addClass("hide");
                    } else {
                        $("#offline1").addClass("hide");
                        $("#online1").removeClass("hide");
                    }
                    $("#ecpuU").text(resp.ResponseData.cpu)
                    $("#ememU").text(resp.ResponseData.mem)
                    $("#ehddU").text(resp.ResponseData.hdd)
                    $("#etempU").text(resp.ResponseData.tempr)

                    Logging.logMessage("Core", "EMAR", "EMAR Stats Updated OK");
                    break;
                default:
                    msg = "EMAR Stats Update Failed: " + resp.Message
                    Logging.logMessage("Core", "EMAR", msg);
                    break;
            }
        });
    },
    imgError: function(image) {
        $("#" + image).removeClass("hide");
        $("#" + image + "on").addClass("hide");
        return true;
    },
    UpdateLife: function() {
        setInterval(function() {
            EMAR.GetLifes();
        }, 5000);
    },
};

$(document).ready(function() {

    $('#emar_create').validator().on('submit', function(e) {
        if (!e.isDefaultPrevented()) {
            e.preventDefault();
            EMAR.Create();
        }
    });

    $('#emar_update').validator().on('submit', function(e) {
        if (!e.isDefaultPrevented()) {
            e.preventDefault();
            EMAR.Update();
        }
    });

    $("#GeniSysAI").on("click", "#UPA", function(e) {
        e.preventDefault();
        EMAR.arm("UP");
    });
    $("#GeniSysAI").on("click", "#DOWNA", function(e) {
        e.preventDefault();
        EMAR.arm("DOWN");
    });
    $("#GeniSysAI").on("click", "#RIGHTA", function(e) {
        e.preventDefault();
        EMAR.arm("2UP");
    });
    $("#GeniSysAI").on("click", "#LEFTA", function(e) {
        e.preventDefault();
        EMAR.arm("2DOWN");
    });

    $("#GeniSysAI").on("click", "#FORWARDW", function(e) {
        e.preventDefault();
        EMAR.wheels("FORWARD");
    });
    $("#GeniSysAI").on("click", "#BACKW", function(e) {
        e.preventDefault();
        EMAR.wheels("BACK");
    });
    $("#GeniSysAI").on("click", "#RIGHTW", function(e) {
        e.preventDefault();
        EMAR.wheels("RIGHT");
    });
    $("#GeniSysAI").on("click", "#LEFTW", function(e) {
        e.preventDefault();
        EMAR.wheels("LEFT");
    });

    $("#GeniSysAI").on("click", "#UPC", function(e) {
        e.preventDefault();
        EMAR.cams("UP");
    });
    $("#GeniSysAI").on("click", "#DOWNC", function(e) {
        e.preventDefault();
        EMAR.cams("DOWN");
    });
    $("#GeniSysAI").on("click", "#RIGHTC", function(e) {
        e.preventDefault();
        EMAR.cams("RIGHT");
    });
    $("#GeniSysAI").on("click", "#LEFTC", function(e) {
        e.preventDefault();
        EMAR.cams("LEFT");
    });
    $("#GeniSysAI").on("click", "#CENTERC", function(e) {
        e.preventDefault();
        EMAR.cams("CENTER");
    });

    $("#GeniSysAI").on("click", "#reset_mqtt", function(e) {
        e.preventDefault();
        EMAR.ResetMqtt();
    });

    $("#GeniSysAI").on("click", "#reset_apriv", function(e) {
        e.preventDefault();
        EMAR.ResetDvcKey();
    });

    $('.hider').hover(function() {
        $('#' + $(this).attr("id")).attr('type', 'text');
    }, function() {
        $('#' + $(this).attr("id")).attr('type', 'password');
    });

    $('#mqttu').hover(function() {
        $("#mqttu").text(EMAR.mqttua);
    }, function() {
        $("#mqttu").text(EMAR.mqttuae);
    });

    $('#mqttp').hover(function() {
        $("#mqttp").text(EMAR.mqttpa);
    }, function() {
        $("#mqttp").text(EMAR.mqttpae);
    });

    $('#idappid').hover(function() {
        $("#idappid").text(EMAR.idappida);
    }, function() {
        $("#idappid").text(EMAR.idappidae);
    });

    $('#bcid').hover(function() {
        $("#bcid").text(EMAR.bcida);
    }, function() {
        $("#bcid").text(EMAR.bcidae);
    });

});