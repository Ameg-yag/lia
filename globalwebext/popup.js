// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var lia_server = "192.168.1.217:8000";
var lia_url = "http://192.168.1.217:8000";


var countries_url = lia_url + "/gw/get_countries";
jQuery.getJSON(countries_url,function(data){
		for (var i = 0; i <= 2;i++){
			$(document.createElement("img"))
				.attr({src:data[i].img_url,title:data[i].code})
				.appendTo(document.body)
				.click({details:data[i]},function(event){
						var details = event.data.details;
						console.log("Fetching proxy details for " + details.name);
						var country_url = lia_url + "/gw/get_country?code=" + details.code;
						jQuery.getJSON(country_url, function(proxy_details){
								console.log("Setting proxy to " + proxy_details.proxy_url + ":" + proxy_details.proxy_port);
								var config = {
									mode: "fixed_servers",
									rules: {
										singleProxy: {
											scheme: "http",
											host: proxy_details.proxy_url,
											port: proxy_details.proxy_port
										},
										bypassList: [lia_server]
									}
								};
								chrome.proxy.settings.set(
														  {value: config, scope: 'regular'},
														  function() {});
							});						
						chrome.browserAction.setBadgeBackgroundColor({color:[0,0,128,255]});
						chrome.browserAction.setBadgeText({text:details.code});

					})
				}
	});
