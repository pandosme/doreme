var fs = require("fs");
var request = require('request');
var xml2js = require('xml2js');

var exports = module.exports = {};

exports.request = function( camera, path,callback ) {
	request.get({url:camera.url+path,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( true, "VAPIX Request failed");
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( true, body );
			return;
		}
		if( body.search("Error") >= 0 ) {
			callback( true, body);
			return;
		}
		callback( false, body );
	}).auth( camera.user, camera.password, false);
}

exports.post = function( camera, path, data, callback ) {
	request.post({url: camera.url+path,body: data,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( true, "VAPIX Post failed" );
			return;
		}
		if( response.statusCode === 401 ) {
			callback( true, "Unauthorized request" );
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( true, body );
			return;
		}
		callback(null,body);
	}).auth(camera.user, camera.password, false);
}

exports.soap = function( camera, soapBody, callback ) {
	var soapEnvelope = '<SOAP-ENV:Envelope ' +
					   'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
					   'xmlns:xsd="http://www.w3.org/2001/XMLSchema" '+
					   'xmlns:tt="http://www.onvif.org/ver10/schema "'+
					   'xmlns:tds="http://www.onvif.org/ver10/device/wsdl" '+
					   'xmlns:tev="http://www.onvif.org/ver10/event/wsdl" '+
					   'xmlns:tns1="http://www.onvif.org/ver10/topics" ' +
	                   'xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" '+
					   'xmlns:acertificates="http://www.axis.com/vapix/ws/certificates" '+
					   'xmlns:acert="http://www.axis.com/vapix/ws/cert" '+
					   'xmlns:aev="http://www.axis.com/vapix/ws/event1" ' +
					   'xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope">';
					   
	soapEnvelope += '<SOAP-ENV:Body>' + soapBody + '</SOAP-ENV:Body>';
	soapEnvelope += '</SOAP-ENV:Envelope>';
	
	request.post({url: camera.url+'/vapix/services',body: soapEnvelope,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( true, "Soap request error" );
			return;
		}
		if( response.statusCode === 401 ) {
			callback( true, "Unauthorized request" );
			return;
		}
		if( response.statusCode !== 200 ) {
			parseSOAPResponse( body,
				function(result){ //success
					callback(true,result);
				},
				function(result) { //
					callback(true,"Soap Parse error");
				}
			)
			return;
		}
		parseSOAPResponse( body,
			function(result){ //success
				callback(false,result);
			},
			function(result) {
				callback(true,result);
			}
		)
	}).auth(camera.user, camera.password, false);
}

exports.image = function( camera, mediaProfil, callback ) {
	path = '/axis-cgi/jpg/image.cgi';
	if( mediaProfil && mediaProfil.length > 3 )
		path += '?' + mediaProfil;
	request.get({url:camera.url+path,encoding:null,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( true, body);
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( true, body );
			return;
		}
		callback( null, body );
	}).auth( camera.user, camera.password, false);
}

exports.getParam = function( camera, paramPath, callback ) {
	if( !paramPath || paramPath.length === 0 || paramPath.toLowerCase ( ) === "root" ) {
		callback(true,"Invalid parameter path.  Set data to a valid parameter group" );
		return;
	}
	var path = '/axis-cgi/param.cgi?action=list&group=' + paramPath
	console.log(path);
	request.get({url:camera.url+path,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( true, "VAPIX Parameter Request failed");
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( true, body );
			return;
		}
		if( body.search("Error") >= 0 ) {
			callback( true, body);
			return;
		}
		var params = ParseVapixParameter(body);
		callback( false, params );
	}).auth( camera.user, camera.password, false);
}

function ParseVapixParameter( data ) {
	var rows = data.split('\n');
	var result = {};
	rows.forEach(function(row){
		row = row.trim();
		if( row.length > 5) {
			var items = row.split('=');
			var props = items[0].split('.');
			var prop = result;
			for( i = 2; i < props.length; i++ ) {
				if( prop.hasOwnProperty(props[i]) ) {
					prop = prop[props[i]];
				} else {
					if( i === props.length - 1 ) {
						if( items.length > 1 ) {
							prop[props[i]] = items[1];
							if( items[1] === 'yes' )
								prop[props[i]] = true;
							if( items[1] === 'no' )
								prop[props[i]] = false;
						} else {
							prop[props[i]] = "";
						}
					} else {
						prop[props[i]] = {};
					}
					prop = prop[props[i]];
				}
			}
		}
	});
	
	return result;
}

exports.setParam = function( camera, group, parameters, callback ) {
	if( !group || group.length == 0 ) {
		callback( true, "Undefined property group");
		return;
	}

	if( !parameters || !(typeof parameters === 'object') ) {
		callback( true, "Input is not a valid object");
		return;
	}
	var path = '/axis-cgi/param.cgi?action=update';
	for( var parameter in parameters ) {
		var value = parameters[parameter];
		if( value === true )
			value = 'yes';
		if( value === false )
			value = 'no'
		if(  typeof parameters[parameter] === 'object' ) {
			//Don't update sub groups 
		} else {
			path += '&root.' + group + '.' + parameter + '=' + encodeURIComponent(value);
		}
	}
	request.get({url:camera.url+path,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( true, "Request error: " + body);
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( true, body );
			return;
		}
		if( body.search("Error") === -1 )
			callback( false, "OK");
		else
			callback( true, body);
	}).auth(camera.user, camera.password, false);
}

exports.listACAP = function( camera, callback ) {
	var path =  '/axis-cgi/applications/list.cgi';
	request.get({url:camera.url+path,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( true, "Request error: " + body);
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( true, body );
			return;
		}
		if( body.search("Error") >= 0 ) {
			callback( true, body );
			return;
		}
		var parser = new xml2js.Parser({
			explicitArray: false,
			mergeAttrs: true
		});
		parser.parseString(body, function (err, result) {
			if( err ) {
				callback( err,result);
				return;
			}
			var data = result;
			if( !data.hasOwnProperty("reply")) {
				callback( true, "Response parse error.");
				return;
			}
			data = data.reply;
			if( !data.hasOwnProperty("result") || data.result !== "ok" || !data.hasOwnProperty("application")) {
				callback( true, "Response parse error.");
				return;
			}
			callback(null,data.application);
		});
	}).auth(camera.user, camera.password, false);
}

exports.installACAP = function( camera, filepath, callback ) {
	var path = '/axis-cgi/applications/upload.cgi'
	var req = request.post( {url:camera.url+path,strictSSL: false},function (error, response, body) {
		body = body?body.trim():"";
		if( error ) {
			callback( error, body );
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( response.statusCode, body );
			return;
		}
		switch( body ) {
			case "OK":
				callback( false, "OK" );
			break;
			case "Error: 1":
				callback( true, "Invalid file type" );
			break;
			case "Error: 2":
				callback( true, "File verification failed" );
			break;
			case "Error: 3":
				callback( true, "File is too large or the storage is full" );
			break;
			case "Error: 5":
			case "Error: 10":
				callback( true, "File is not compatible with the HW or FW" );
			break;
			default:
				callback( true, body );
			break;
		}
	}).auth(camera.user, camera.password, false);
	var form = req.form();
	form.append('file',fs.createReadStream(filepath));
}

exports.updateFimrware = function( camera, filepath, callback ) {
//	var path = '/axis-cgi/firmwaremanagement.cgi'
	var path = '/axis-cgi/firmwareupgrade.cgi'
//	var url = address + '/axis-cgi/packagemanager.cgi'
	var req = request.post( {url:camera.url+path,strictSSL: false},function (error, response, body) {
		body = body?body.trim():"";
		if( error ) {
			callback( error, body );
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( true, body );
			return;
		}
		callback( false, body );
	}).auth(camera.user, camera.password, false);
	var form = req.form();
	form.append('file',fs.createReadStream(filepath));
}


exports.controlACAP = function( camera, action, acap, callback ) {
	if( !action || action.length == 0 ) {
		callback( true, "Invalid ACAP action");
		return;
	}
	
	if( !acap || acap.length == 0 || acap.length > 20 ) {
		callback( true, "Invalid ACAP ID");
		return;
	}
	
	var path =  '/axis-cgi/applications/control.cgi?action=' + action + '&package=' + acap;
	request.get({url:camera.url+path,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( error, "Request error");
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( response.statusCode, body );
			return;
		}
		body = body.trim();
		switch( body ) {
			case "OK":
			case "Error: 6":  //Application is already running
			case "Error: 7":  //Application is not running
				callback( null, "OK");
			break;
			case "Error: 4":
				callback( true, "Invalid ACAP " + acap);
			break;
			default:
				callback( true, body );
			break;
		}
	}).auth(camera.user, camera.password, false);
}

exports.listAccounts = function( camera, callback ) {
 	var path =  '/axis-cgi/pwdgrp.cgi?action=get';
	request.get({url:camera.url+path,strictSSL: false}, function (error, response, body) {
		if( error ) {
			callback( error, "Request error");
			return;
		}
		if( response.statusCode !== 200 ) {
			callback( response.statusCode, body );
			return;
		}
		var accounts = [];
		var admins = [];
		var operators = [];
		var viewers = [];
		var rows = body.split('\n');
		rows.forEach(function(line){
			line = line.trim();
			items = line.split('=');
			if( items.length === 2 ) {
				account = items[0];
				users = items[1].replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '');
				users = users.split(',');
				if( account === 'digusers')
					accounts = users;
				if( account === 'admin')
					admins = users;
				if( account === 'viewer')
					viewers = users;
				if( account === 'operator')
					operators = users;
			}
		})
		list = [];
		accounts.forEach(function(account){
			var privileges = "Undefined";
			viewers.forEach(function(name){
				if( account === name )
					privileges = "Viewer"
			})
			operators.forEach(function(name){
				if( account === name )
					privileges = "Operator"
			})
			admins.forEach(function(name){
				if( account === name )
					privileges = "Administrator"
			})
			list.push({
				account: account,
				privileges: privileges
			})    
		})
		callback( false, list );
	}).auth(camera.user, camera.password, false);
}

exports.setAccount = function( camera, account, callback ) {
	if( !account || !account.hasOwnProperty('user') || account.user.length < 3 ) {
		callback(true,"Invalid or missing user name");
		return;
	}
	if( !account.hasOwnProperty('password') || account.password.length < 6 ) {
		callback(true,"Missing password or password is too short");
		return;
	}
	if( !account.hasOwnProperty('privileges') || account.privileges.length < 4 ) {
		callback(true,"Invalid privileges");
		return;
	}
	
	var path = '/axis-cgi/pwdgrp.cgi?action=update&user=' + account.user + '&pwd=' + encodeURIComponent(account.password);
	exports.request( camera,path, function( error, response ) {	
		if( error ) {
			var sgrp = "viewer";
			if( account.privileges==="Operator" )
				sgrp += ":operator:ptz";
			if( account.privileges==="Administrator" )
				sgrp += ":operator:admin:ptz";
			path = '/axis-cgi/pwdgrp.cgi?action=add&user=' + account.user + '&pwd=' + encodeURIComponent(account.password) + '&grp=users&sgrp=' + sgrp + '&comment=node';
			exports.request( camera,path, function( error, response ) {	
				if( error ) {
					callback( error, response );
					return;
				}
				callback( null, response );
			});
			return;
		}
		callback( false, response );
	});
}

exports.listCertificates = function( camera, callback ) {
	var soapBody = '<tds:GetCertificates xmlns="http://www.onvif.org/ver10/device/wsdl"></tds:GetCertificates>';
	exports.soap( camera, soapBody, function( error, response ) {
		if( error ) {
			callback( error, response );
			return;
		}
		if( response.hasOwnProperty('tds:GetCertificatesResponse') && response['tds:GetCertificatesResponse'].hasOwnProperty('tds:NvtCertificate')) {
			var NvtCertificate = response['tds:GetCertificatesResponse']['tds:NvtCertificate'];
			var certs = [];
			if( Array.isArray( NvtCertificate ) )
				certs = NvtCertificate;
			else
				certs.push(NvtCertificate);
			
			list = [];
			certs.forEach( function(cert) {
				var pemData = cert['tt:Certificate']['tt:Data'];
				var rows = pemData.match(/.{1,64}/g);
				var pem = '----BEGIN CERTIFICATE-----\n';
				rows.forEach(function(row){
					pem += row + '\n'
				})
				pem += '-----END CERTIFICATE-----\n';
				list.push({
					id: cert['tt:CertificateID'],
					pem: pem
				});
			});
			callback( false, list );
			return;
		}
		callback(true,"Invalid SOAP response. Missing tds:GetCertificatesResponse");
	});
};

exports.createCertificate = function( camera, id, certificate, callback ) {
	if( id.length < 4 ) {
		callback( true,"Invalid certificate id");
		return;
	}
	if( !certificate || !certificate.hasOwnProperty('commonName') ) {
		callback( true,"Invalid Connon Name");
		return;
	}
	var soapBody = '<acertificates:CreateCertificate2 xmlns="http://www.axis.com/vapix/ws/certificates">';
	soapBody += '<acertificates:Id>' + id + '</acertificates:Id> <acertificates:Subject>';
	soapBody +=	'<acert:CN>' + certificate.commonName + '</acert:CN>';
	if( certificate.hasOwnProperty('country')) soapBody += '<acert:C>' + certificate.country + '</acert:C>';
	if( certificate.hasOwnProperty('organizationName')) soapBody += '<acert:O>' + certificate.organizationName + '</acert:O>';
	if( certificate.hasOwnProperty('organizationalUnitName')) soapBody += '<acert:OU>' + certificate.organizationalUnitName + '</acert:OU>';
	if( certificate.hasOwnProperty('stateOrProvinceName')) soapBody += '<acert:ST>' + certificate.stateOrProvinceName + '</acert:ST>';
	soapBody +=	'</acertificates:Subject></acertificates:CreateCertificate2>';
	exports.soap( camera, soapBody, function( error, response ) {
		if( error ) {
			callback(error, response);
			return;
		}
		if( response.hasOwnProperty('acertificates:CreateCertificate2Response') && response['acertificates:CreateCertificate2Response'].hasOwnProperty('acertificates:Certificate') ) {
			var PEM_Data = response['acertificates:CreateCertificate2Response']['acertificates:Certificate'];
			var rows = PEM_Data.match(/.{1,64}/g);
			var pem = '----BEGIN CERTIFICATE-----\n';
			rows.forEach(function(row){
				pem += row + '\n'
			});
			pem += '-----END CERTIFICATE-----\n';
			callback( false, pem );
		} else {
			callback( true, "Unable to parse Certificate PEM from response" );
		}
	});
}

exports.requestCSR = function( camera, id, certificate, callback ) {
	if( id.length < 4 ) {
		callback( true,"Invalid certificate id");
		return;
	}
	if( !certificate || !certificate.hasOwnProperty('commonName') ) {
		callback( true,"Invalid Common Name");
		return;
	}
	var soapBody = '<acertificates:GetPkcs10Request2 xmlns="http://www.axis.com/vapix/ws/certificates">';
	soapBody += '<acertificates:Id>' + id + '</acertificates:Id> <acertificates:Subject>';
	soapBody +=	'<acert:CN>' + certificate.commonName + '</acert:CN>';
	if( certificate.hasOwnProperty('country')) soapBody += '<acert:C>' + certificate.country + '</acert:C>';
	if( certificate.hasOwnProperty('organizationName')) soapBody += '<acert:O>' + certificate.organizationName + '</acert:O>';
	if( certificate.hasOwnProperty('organizationalUnitName')) soapBody += '<acert:OU>' + certificate.organizationalUnitName + '</acert:OU>';
	if( certificate.hasOwnProperty('stateOrProvinceName')) soapBody += '<acert:ST>' + certificate.stateOrProvinceName + '</acert:ST>';
	soapBody +=	'</acertificates:Subject></acertificates:Subject></acertificates:GetPkcs10Request2>';
	exports.soap( camera, soapBody, function( error, response ) {
		if( error ) {
			callback(error, response);
			return;
		}
		if( response.hasOwnProperty('acertificates:GetPkcs10Request2Response') && response['acertificates:GetPkcs10Request2Response'].hasOwnProperty('acertificates:Pkcs10Request') ) {
			var PEM_Data = response['acertificates:GetPkcs10Request2Response']['acertificates:Pkcs10Request'];
			var rows = PEM_Data.match(/.{1,64}/g);
			var pem = '-----BEGIN CERTIFICATE REQUEST-----\n';
			rows.forEach(function(row){
				pem += row + '\n'
			});
			pem += '-----END CERTIFICATE REQUEST-----\n';
			callback( false, pem );
		} else {
			callback( true, "Unable to parse Certificate PEM from response" );
		}
	});
}

function parseSOAPResponse( xml, success, failure ) {
	var parser = new xml2js.Parser({
		explicitArray: false,
		mergeAttrs: true
	});

	parser.parseString(xml, function (err, result) {
		if( err ) {
			failure( err );
			return;
		}
		if( !result.hasOwnProperty('SOAP-ENV:Envelope') ) {
			failure( "Parse error.  Missing " +  'SOAP-ENV:Envelope' );
			return;
		}
		if( !result['SOAP-ENV:Envelope'].hasOwnProperty('SOAP-ENV:Body') ) {
			failure( "Parse error: Missing " +  'SOAP-ENV:Body' );
			return;
		}
		success( result['SOAP-ENV:Envelope']['SOAP-ENV:Body'] );
	});
}

exports.listEvents = function( camera, callback ) {
	var soapBody = '<aev:GetEventInstances xmlns="http://www.axis.com/vapix/ws/event1"></aev:GetEventInstances>';
	exports.soap( camera, soapBody, function(error, response ) {
		if( error ) {
			callback(error,response);
			return;
		}
		if( !response.hasOwnProperty('aev:GetEventInstancesResponse') ) {
			callback(true, "Soap parse error" );
			return;
		}
		var events = ParseEvents( null, null, null,response['aev:GetEventInstancesResponse']['wstop:TopicSet'] ).children;
		list = [];
		var acap = {
			topic: "acap",
			name: "ACAP",
			group:"",
			stateful: false,
			filter: "",
			children: []
		}
		list.push(acap)
		for(var i = 0; i < events.length; i++ ) {
			var add = true;
			if( events[i].topic === "tns1:UserAlarm") {
				list = list.concat(events[i].children[0].children);
				add = false;
			}
			if( events[i].topic === "tns1:Device") {
				list = list.concat(events[i].children[0].children);
				add = false;
			}
			if( events[i].topic === "tns1:RuleEngine") {
				acap.children = acap.children.concat(events[i].children);
				add = false;
			}
			if( events[i].topic === "tnsaxis:CameraApplicationPlatform") {
				acap.children = acap.children.concat(events[i].children);
				add = false;
			}
			if( add )
				list.push(events[i]);
		}
		callback(null, list );
	});
}


function ParseEvents( topic, group, name, event ) {
    if( event.hasOwnProperty('isApplicationData') )
        return null;
    if( topic === "tns1:Device/tnsaxis:SystemMessage")
        return null;
    if( topic === "tns1:Device/tnsaxis:Light")
        return null;
    if( topic === "tns1:Device/tnsaxis:Network")
        return null;
    if( topic === "tns1:Device/tnsaxis:HardwareFailure")
        return null;
    if( topic === "tns1:Device/tnsaxis:Status/SystemReady")
        return null;
    if( topic === "tns1:Device/tnsaxis:IO/VirtualInput")
        return null;
    if( topic === "tnsaxis:Storage/RecorderStatus")
        return null;
    var item = {
        topic: topic? topic:"",
        name: name? name:"",
        group: group? group:"",
        stateful: false,
        filter:"",
        children: []
    }
    var parentTopic = topic? topic+"/":"";
    if( event.hasOwnProperty('aev:NiceName') ) {
        switch( event['aev:NiceName'] ) {
            case 'PTZController': item.name = "PTZ"; break;
            case 'Day night vision': item.name = "Daytime"; break;
            case 'Recurring pulse': item.name = "Timer"; item.group="Timer";break;
            case 'Scheduled event': item.name = "Schedule"; item.group="Schedule";break;
            case 'Virtual Input': item.name = "Virtual Inport"; item.group="Virtual Inport";break;
            case 'Manual trigger': item.name = "User Button"; item.group="User Button";break;
            case 'Digital input port': item.name = "Digital Input"; item.group="Digital Input";break;
            case 'Video source': item.name = "Detectors"; item.group="Detectors";break;
            default: item.name = event['aev:NiceName'];
        }
        delete event['aev:NiceName'];
    }
    if( event.hasOwnProperty('wstop:topic') ) {
        delete event['wstop:topic'];
    }
    for( var property in event ) {
        if( typeof event[property] === 'object' ) {
            if( property === "aev:MessageInstance") {
                sources = [];
                sourceType = null;
                sourceName = null;
                if( event[property].hasOwnProperty('aev:SourceInstance') ) {
                    var source = event[property]['aev:SourceInstance']['aev:SimpleItemInstance'];
                    if( source.hasOwnProperty('aev:Value') && source['aev:Value'].length > 1 ) {
                        sourceType = source.Type;
                        sourceName = source.Name;
                        sources = source['aev:Value'];
                    }
                }
                var stateful = false;
                if( event[property].hasOwnProperty('aev:DataInstance') ) {
                    var data = event[property]['aev:DataInstance']['aev:SimpleItemInstance'];
                    if( data.Type === 'xsd:boolean' )
                        stateful = data.Name;
                }
                if( sources.length ) {
                    for( var i = 0; i < sources.length; i++ ) {
                        var sourceEvent = {
                            topic: item.topic,
                            name: item.group+'/'+ sources[i].hasOwnProperty('aev:NiceName')? sources[i]['aev:NiceName']:sources[i]['_'],
                            group: item.group,
                            stateful: (stateful !== false),
                            filter:'boolean(//SimpleItem[@Name="' + sourceName + '" and @Value="' + sources[i]['_'] + '"])',
                            children: []
                        }
                        if( stateful ) {
                            sourceEvent.children.push({
                                topic: sourceEvent.topic,
                                name: sourceEvent.name + ":True",
                                group: sourceEvent.group,
                                stateful: true,
								stateName: stateful,
								stateValue: 1,
                                filter: sourceEvent.filter + ' and boolean(//SimpleItem[@Name="' + stateful + '" and @Value="1"])',
                                children: []
                            })                    
                            sourceEvent.children.push({
                                topic: sourceEvent.topic,
                                name: sourceEvent.name + ":False",
                                group: sourceEvent.group,
                                stateful: true,
								stateName: stateful,
								stateValue: 0,
                                filter: sourceEvent.filter + ' and boolean(//SimpleItem[@Name="' + stateful + '" and @Value="0"])',
                                children: []
                            })                    
                        }
                        item.children.push(sourceEvent);
                    }
                } else {
                    if( stateful ) {
                        item.children.push({
                            topic: item.topic,
                            name: item.name + ":True",
                            group: item.group,
                            stateful: true,
							stateName: stateful,
							stateValue: 1,
                            filter:'boolean(//SimpleItem[@Name="' + stateful + '" and @Value="1"])',
                            children: []
                        })                    
                        item.children.push({
                            topic: item.topic,
                            name: item.name + ":False",
                            group: item.group,
                            stateful: true,
							stateName: stateful,
							stateValue: 0,
                            filter:'boolean(//SimpleItem[@Name="' + stateful + '" and @Value="0"])',
                            children: []
                        })                    
                    }
                }
            } else {
                if( property != "tns1:LightControl" &&
                    property != "tns1:Media" &&
                    property !=  "tns1:RecordingConfig"
                ) {
                    child = ParseEvents( parentTopic + property, item.name, name, event[property] );
                    if( child )
                        item.children.push( child );
                }
            }
        }  else {
            item[property] = event[property];
        }
    }
    return item;    
}
