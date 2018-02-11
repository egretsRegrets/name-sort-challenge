/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "11ffb6bc67530f559a4a"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./data.json":
/*!*******************!*\
  !*** ./data.json ***!
  \*******************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

eval("module.exports = {\"sampleInput\":[\"Nick\",\"jake\",\"RAY\",\"Kate\",\"Nick\",\"Jeremy\",\"Ryan\",\"nick\",\"AMOL\",\"rAY\",\"VIANNEY\",\"Samuel\",\"ryan\",\"Shilpika\",\"nick\",\"THOMAS\",\"tom\",\"james\",\"JERM\",\"amOl\",\"kate\",\"SCOTT\",\"Jenifer\",\"bill\",\"jenny\",\"STEVEN\"],\"expectedOutput\":[\"bill\",\"jake\",\"james\",\"jenifer\",\"jenny\",\"jeremy\",\"jerm\",\"samuel\",\"scott\",\"shilpika\",\"steven\",\"thomas\",\"tom\",\"vianney\"]}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9kYXRhLmpzb24uanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9kYXRhLmpzb24/YzAwMiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcInNhbXBsZUlucHV0XCI6W1wiTmlja1wiLFwiamFrZVwiLFwiUkFZXCIsXCJLYXRlXCIsXCJOaWNrXCIsXCJKZXJlbXlcIixcIlJ5YW5cIixcIm5pY2tcIixcIkFNT0xcIixcInJBWVwiLFwiVklBTk5FWVwiLFwiU2FtdWVsXCIsXCJyeWFuXCIsXCJTaGlscGlrYVwiLFwibmlja1wiLFwiVEhPTUFTXCIsXCJ0b21cIixcImphbWVzXCIsXCJKRVJNXCIsXCJhbU9sXCIsXCJrYXRlXCIsXCJTQ09UVFwiLFwiSmVuaWZlclwiLFwiYmlsbFwiLFwiamVubnlcIixcIlNURVZFTlwiXSxcImV4cGVjdGVkT3V0cHV0XCI6W1wiYmlsbFwiLFwiamFrZVwiLFwiamFtZXNcIixcImplbmlmZXJcIixcImplbm55XCIsXCJqZXJlbXlcIixcImplcm1cIixcInNhbXVlbFwiLFwic2NvdHRcIixcInNoaWxwaWthXCIsXCJzdGV2ZW5cIixcInRob21hc1wiLFwidG9tXCIsXCJ2aWFubmV5XCJdfVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZGF0YS5qc29uXG4vLyBtb2R1bGUgaWQgPSAuL2RhdGEuanNvblxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./data.json\n");

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _data = __webpack_require__(/*! ../../data */ \"./data.json\");\n\nvar _data2 = _interopRequireDefault(_data);\n\nvar _sortNames = __webpack_require__(/*! ./sortNames */ \"./src/js/sortNames.js\");\n\nvar _sortNames2 = _interopRequireDefault(_sortNames);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// Rendering and Logging:\n\nvar sortedNames = (0, _sortNames2.default)(_data2.default.sampleInput);\n\n// utility for rendering li's from an array\nfunction appendLiForTxtElem(txt, appendTarget) {\n  var li = document.createElement('li');\n  var txtNode = document.createTextNode(txt);\n  li.appendChild(txtNode);\n  appendTarget.append(li);\n}\n\nfunction renderUnsortedNames(names) {\n  var namesTarget = document.getElementById('unsortedNames');\n  names.forEach(function (name) {\n    return appendLiForTxtElem(name, namesTarget);\n  });\n}\n\nfunction renderSortedNames(names) {\n  var namesTarget = document.getElementById('uniqueNameList');\n  names.forEach(function (name) {\n    return appendLiForTxtElem(name, namesTarget);\n  });\n}\n\nconsole.log('alpha-sorted unique names: ' + sortedNames.manualSort.join(', '));\n\n// Will log 'Fail' if our sortedNames output does not match our expectedOutput\nconsole.assert(sortedNames.manualSort.join(', ') === _data2.default.expectedOutput.join(', '));\n\nrenderUnsortedNames(_data2.default.sampleInput);\nrenderSortedNames(sortedNames.protoMethods);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvbWFpbi5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvanMvbWFpbi5qcz82OTFmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhIGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHVuaXF1ZU5hbWVzRnJvbUNvbGxlY3Rpb24gZnJvbSAnLi9zb3J0TmFtZXMnO1xuXG4vLyBSZW5kZXJpbmcgYW5kIExvZ2dpbmc6XG5cbmNvbnN0IHNvcnRlZE5hbWVzID0gdW5pcXVlTmFtZXNGcm9tQ29sbGVjdGlvbihkYXRhLnNhbXBsZUlucHV0KTtcblxuLy8gdXRpbGl0eSBmb3IgcmVuZGVyaW5nIGxpJ3MgZnJvbSBhbiBhcnJheVxuZnVuY3Rpb24gYXBwZW5kTGlGb3JUeHRFbGVtKHR4dCwgYXBwZW5kVGFyZ2V0KSB7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgY29uc3QgdHh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCk7XG4gIGxpLmFwcGVuZENoaWxkKHR4dE5vZGUpO1xuICBhcHBlbmRUYXJnZXQuYXBwZW5kKGxpKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyVW5zb3J0ZWROYW1lcyhuYW1lcykge1xuICBjb25zdCBuYW1lc1RhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bnNvcnRlZE5hbWVzJyk7XG4gIG5hbWVzLmZvckVhY2gobmFtZSA9PiBhcHBlbmRMaUZvclR4dEVsZW0obmFtZSwgbmFtZXNUYXJnZXQpKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU29ydGVkTmFtZXMobmFtZXMpIHtcbiAgY29uc3QgbmFtZXNUYXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5pcXVlTmFtZUxpc3QnKTtcbiAgbmFtZXMuZm9yRWFjaChuYW1lID0+IGFwcGVuZExpRm9yVHh0RWxlbShuYW1lLCBuYW1lc1RhcmdldCkpO1xufVxuXG5jb25zb2xlLmxvZyhgYWxwaGEtc29ydGVkIHVuaXF1ZSBuYW1lczogJHtzb3J0ZWROYW1lcy5tYW51YWxTb3J0LmpvaW4oJywgJyl9YCk7XG5cbi8vIFdpbGwgbG9nICdGYWlsJyBpZiBvdXIgc29ydGVkTmFtZXMgb3V0cHV0IGRvZXMgbm90IG1hdGNoIG91ciBleHBlY3RlZE91dHB1dFxuY29uc29sZS5hc3NlcnQoc29ydGVkTmFtZXMubWFudWFsU29ydC5qb2luKCcsICcpID09PSBkYXRhLmV4cGVjdGVkT3V0cHV0LmpvaW4oJywgJykpO1xuXG5yZW5kZXJVbnNvcnRlZE5hbWVzKGRhdGEuc2FtcGxlSW5wdXQpO1xucmVuZGVyU29ydGVkTmFtZXMoc29ydGVkTmFtZXMucHJvdG9NZXRob2RzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvbWFpbi5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/js/main.js\n");

/***/ }),

/***/ "./src/js/manualSort.js":
/*!******************************!*\
  !*** ./src/js/manualSort.js ***!
  \******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.mergeSort = mergeSort;\nexports.alphaCompare = alphaCompare;\n// The usual mergeSort implementation wrapped in an outer func layer that accepts a custom sort-determining func\nfunction mergeSort(array) {\n  var sortFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (left, right) {\n    if (left < right) return -1;\n    return 1;\n  };\n\n  function merge(left, right) {\n    var result = [];\n    var iLeft = 0;\n    var iRight = 0;\n    while (iLeft < left.length && iRight < right.length) {\n      if (sortFunc(left[iLeft], right[iRight]) === -1) {\n        result.push(left[iLeft]);\n        iLeft += 1;\n      } else {\n        result.push(right[iRight]);\n        iRight += 1;\n      }\n    }\n\n    return result.concat(left.slice(iLeft), right.slice(iRight));\n  }\n\n  function sort(arr) {\n    if (arr.length === 1) {\n      return arr;\n    }\n    var middle = Math.floor(arr.length / 2);\n    var left = arr.slice(0, middle);\n    var right = arr.slice(middle);\n\n    return merge(sort(left), sort(right));\n  }\n\n  return sort(array);\n}\n\nfunction alphaCompare(left, right, wordLength) {\n  // if left[0] has a lesser character code than right[0] we can exit with -1, signaling that left will be sorted to the left\n  if (left.charCodeAt(0) < right.charCodeAt(0)) {\n    return -1;\n  }\n  // if our two letters have the same charCode and are therefore the same, we need to compare the next letter\n  if (left.charCodeAt(0) === right.charCodeAt(0)) {\n    /**\n     * We track the length of our shortest word to make sure we don't accidentally unshift all the letters of a word.\n     * wordLength will only be passed in as an arg if we run alphaCompare recursively,\n     * if it's not present we assign shortestWordLength the length of whichever word is shorter.\n     */\n    var shortestWordLength = void 0;\n    if (!wordLength) {\n      shortestWordLength = left.length > right.length ? left.length : right.length;\n    } else {\n      shortestWordLength = wordLength;\n    }\n    if (shortestWordLength > 1) {\n      // we'll run alphaCompare again, comparing the next letters of left and right\n      return alphaCompare(left.slice(1), right.slice(1), shortestWordLength - 1);\n    }\n    return 0;\n  }\n  return 0;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvbWFudWFsU29ydC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvanMvbWFudWFsU29ydC5qcz8yMzA2Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSB1c3VhbCBtZXJnZVNvcnQgaW1wbGVtZW50YXRpb24gd3JhcHBlZCBpbiBhbiBvdXRlciBmdW5jIGxheWVyIHRoYXQgYWNjZXB0cyBhIGN1c3RvbSBzb3J0LWRldGVybWluaW5nIGZ1bmNcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVNvcnQoXG4gIGFycmF5LFxuICAvLyBhIGRlZmF1bHQgc29ydEZ1bmMgaXMgcHJvdmlkZWQgaWYgbm9uZSBpcyBwYXNzZWQgaW5cbiAgc29ydEZ1bmMgPSAobGVmdCwgcmlnaHQpID0+IHtcbiAgICBpZiAobGVmdCA8IHJpZ2h0KSByZXR1cm4gLTE7XG4gICAgcmV0dXJuIDE7XG4gIH1cbikge1xuICBmdW5jdGlvbiBtZXJnZShsZWZ0LCByaWdodCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBpTGVmdCA9IDA7XG4gICAgbGV0IGlSaWdodCA9IDA7XG4gICAgd2hpbGUgKGlMZWZ0IDwgbGVmdC5sZW5ndGggJiYgaVJpZ2h0IDwgcmlnaHQubGVuZ3RoKSB7XG4gICAgICBpZiAoc29ydEZ1bmMobGVmdFtpTGVmdF0sIHJpZ2h0W2lSaWdodF0pID09PSAtMSkge1xuICAgICAgICByZXN1bHQucHVzaChsZWZ0W2lMZWZ0XSk7XG4gICAgICAgIGlMZWZ0ICs9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaChyaWdodFtpUmlnaHRdKTtcbiAgICAgICAgaVJpZ2h0ICs9IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdC5jb25jYXQobGVmdC5zbGljZShpTGVmdCksIHJpZ2h0LnNsaWNlKGlSaWdodCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gc29ydChhcnIpIHtcbiAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG4gICAgY29uc3QgbWlkZGxlID0gTWF0aC5mbG9vcihhcnIubGVuZ3RoIC8gMik7XG4gICAgY29uc3QgbGVmdCA9IGFyci5zbGljZSgwLCBtaWRkbGUpO1xuICAgIGNvbnN0IHJpZ2h0ID0gYXJyLnNsaWNlKG1pZGRsZSk7XG5cbiAgICByZXR1cm4gbWVyZ2Uoc29ydChsZWZ0KSwgc29ydChyaWdodCkpO1xuICB9XG5cbiAgcmV0dXJuIHNvcnQoYXJyYXkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWxwaGFDb21wYXJlKGxlZnQsIHJpZ2h0LCB3b3JkTGVuZ3RoKSB7XG4gIC8vIGlmIGxlZnRbMF0gaGFzIGEgbGVzc2VyIGNoYXJhY3RlciBjb2RlIHRoYW4gcmlnaHRbMF0gd2UgY2FuIGV4aXQgd2l0aCAtMSwgc2lnbmFsaW5nIHRoYXQgbGVmdCB3aWxsIGJlIHNvcnRlZCB0byB0aGUgbGVmdFxuICBpZiAobGVmdC5jaGFyQ29kZUF0KDApIDwgcmlnaHQuY2hhckNvZGVBdCgwKSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICAvLyBpZiBvdXIgdHdvIGxldHRlcnMgaGF2ZSB0aGUgc2FtZSBjaGFyQ29kZSBhbmQgYXJlIHRoZXJlZm9yZSB0aGUgc2FtZSwgd2UgbmVlZCB0byBjb21wYXJlIHRoZSBuZXh0IGxldHRlclxuICBpZiAobGVmdC5jaGFyQ29kZUF0KDApID09PSByaWdodC5jaGFyQ29kZUF0KDApKSB7XG4gICAgLyoqXG4gICAgICogV2UgdHJhY2sgdGhlIGxlbmd0aCBvZiBvdXIgc2hvcnRlc3Qgd29yZCB0byBtYWtlIHN1cmUgd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IHVuc2hpZnQgYWxsIHRoZSBsZXR0ZXJzIG9mIGEgd29yZC5cbiAgICAgKiB3b3JkTGVuZ3RoIHdpbGwgb25seSBiZSBwYXNzZWQgaW4gYXMgYW4gYXJnIGlmIHdlIHJ1biBhbHBoYUNvbXBhcmUgcmVjdXJzaXZlbHksXG4gICAgICogaWYgaXQncyBub3QgcHJlc2VudCB3ZSBhc3NpZ24gc2hvcnRlc3RXb3JkTGVuZ3RoIHRoZSBsZW5ndGggb2Ygd2hpY2hldmVyIHdvcmQgaXMgc2hvcnRlci5cbiAgICAgKi9cbiAgICBsZXQgc2hvcnRlc3RXb3JkTGVuZ3RoO1xuICAgIGlmICghd29yZExlbmd0aCkge1xuICAgICAgc2hvcnRlc3RXb3JkTGVuZ3RoID0gbGVmdC5sZW5ndGggPiByaWdodC5sZW5ndGggPyBsZWZ0Lmxlbmd0aCA6IHJpZ2h0Lmxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvcnRlc3RXb3JkTGVuZ3RoID0gd29yZExlbmd0aDtcbiAgICB9XG4gICAgaWYgKHNob3J0ZXN0V29yZExlbmd0aCA+IDEpIHtcbiAgICAgIC8vIHdlJ2xsIHJ1biBhbHBoYUNvbXBhcmUgYWdhaW4sIGNvbXBhcmluZyB0aGUgbmV4dCBsZXR0ZXJzIG9mIGxlZnQgYW5kIHJpZ2h0XG4gICAgICByZXR1cm4gYWxwaGFDb21wYXJlKGxlZnQuc2xpY2UoMSksIHJpZ2h0LnNsaWNlKDEpLCBzaG9ydGVzdFdvcmRMZW5ndGggLSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2pzL21hbnVhbFNvcnQuanMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0E7QUF1Q0E7QUF4Q0E7QUFDQTtBQU9BO0FBSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/js/manualSort.js\n");

/***/ }),

/***/ "./src/js/sortNames.js":
/*!*****************************!*\
  !*** ./src/js/sortNames.js ***!
  \*****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = uniqueNamesFromCollection;\n\nvar _manualSort = __webpack_require__(/*! ./manualSort */ \"./src/js/manualSort.js\");\n\nfunction uniqueNamesFromCollection(collection) {\n  // map names in collection to lowercase\n  var lowerCaseCollection = collection.map(function (name) {\n    return name.toLowerCase();\n  });\n\n  var uniqueNames = lowerCaseCollection.filter(function (name, nameIndex) {\n    /**\n     * lowerCaseCollection.slice(0, nameIndex) gives us a look at the left-hand side of our input array\n     * lowerCaseCollection.slice(nameIndex + 1) gives us a look at the right-hand side of our input array\n     * if we dont see another instance of our current name either behind or ahead of it, we can safely filter it into our return array\n     */\n    if (!lowerCaseCollection.slice(0, nameIndex).includes(name) && !lowerCaseCollection.slice(nameIndex + 1).includes(name)) {\n      return name;\n    }\n  });\n\n  function protoSort() {\n    /**\n     * array.prototype.sort is a utility method for carrying out in-place sorts on arrays (the sort is merge-sort)\n     * it takes a sorting func as an arg, which is expected to compare 2 contiguous elems of the arr and return a neg or pos int\n     * if the res of the sorting func is negative, the 1st arg of the sorting func is moved to the left of the 2nd arg;\n     * if the res is positive, the 2nd arg is moved to the left of the 1st,\n     * if the res is 0, the elems remain in their current position/indexes\n     */\n    return uniqueNames.sort(\n    /**\n     * string.prototype.localeCompare() compares a reference string to a given string and returns a number\n     * it's second argument is a string or array of strings describing the language or languages (locale) to use in the comparison\n     * for language reference see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation\n     */\n    function (leftName, rightName) {\n      return leftName.localeCompare(rightName, 'en');\n    });\n  }\n\n  function manualSort() {\n    return (0, _manualSort.mergeSort)(uniqueNames, _manualSort.alphaCompare);\n  }\n\n  return {\n    protoMethods: protoSort(),\n    manualSort: manualSort()\n  };\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvc29ydE5hbWVzLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3NyYy9qcy9zb3J0TmFtZXMuanM/OTM5NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtZXJnZVNvcnQsIGFscGhhQ29tcGFyZSB9IGZyb20gJy4vbWFudWFsU29ydCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVuaXF1ZU5hbWVzRnJvbUNvbGxlY3Rpb24oY29sbGVjdGlvbikge1xuICAvLyBtYXAgbmFtZXMgaW4gY29sbGVjdGlvbiB0byBsb3dlcmNhc2VcbiAgY29uc3QgbG93ZXJDYXNlQ29sbGVjdGlvbiA9IGNvbGxlY3Rpb24ubWFwKG5hbWUgPT4gbmFtZS50b0xvd2VyQ2FzZSgpKTtcblxuICBjb25zdCB1bmlxdWVOYW1lcyA9IGxvd2VyQ2FzZUNvbGxlY3Rpb24uZmlsdGVyKChuYW1lLCBuYW1lSW5kZXgpID0+IHtcbiAgICAvKipcbiAgICAgKiBsb3dlckNhc2VDb2xsZWN0aW9uLnNsaWNlKDAsIG5hbWVJbmRleCkgZ2l2ZXMgdXMgYSBsb29rIGF0IHRoZSBsZWZ0LWhhbmQgc2lkZSBvZiBvdXIgaW5wdXQgYXJyYXlcbiAgICAgKiBsb3dlckNhc2VDb2xsZWN0aW9uLnNsaWNlKG5hbWVJbmRleCArIDEpIGdpdmVzIHVzIGEgbG9vayBhdCB0aGUgcmlnaHQtaGFuZCBzaWRlIG9mIG91ciBpbnB1dCBhcnJheVxuICAgICAqIGlmIHdlIGRvbnQgc2VlIGFub3RoZXIgaW5zdGFuY2Ugb2Ygb3VyIGN1cnJlbnQgbmFtZSBlaXRoZXIgYmVoaW5kIG9yIGFoZWFkIG9mIGl0LCB3ZSBjYW4gc2FmZWx5IGZpbHRlciBpdCBpbnRvIG91ciByZXR1cm4gYXJyYXlcbiAgICAgKi9cbiAgICBpZiAoXG4gICAgICAhbG93ZXJDYXNlQ29sbGVjdGlvbi5zbGljZSgwLCBuYW1lSW5kZXgpLmluY2x1ZGVzKG5hbWUpICYmXG4gICAgICAhbG93ZXJDYXNlQ29sbGVjdGlvbi5zbGljZShuYW1lSW5kZXggKyAxKS5pbmNsdWRlcyhuYW1lKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBwcm90b1NvcnQoKSB7XG4gICAgLyoqXG4gICAgICogYXJyYXkucHJvdG90eXBlLnNvcnQgaXMgYSB1dGlsaXR5IG1ldGhvZCBmb3IgY2Fycnlpbmcgb3V0IGluLXBsYWNlIHNvcnRzIG9uIGFycmF5cyAodGhlIHNvcnQgaXMgbWVyZ2Utc29ydClcbiAgICAgKiBpdCB0YWtlcyBhIHNvcnRpbmcgZnVuYyBhcyBhbiBhcmcsIHdoaWNoIGlzIGV4cGVjdGVkIHRvIGNvbXBhcmUgMiBjb250aWd1b3VzIGVsZW1zIG9mIHRoZSBhcnIgYW5kIHJldHVybiBhIG5lZyBvciBwb3MgaW50XG4gICAgICogaWYgdGhlIHJlcyBvZiB0aGUgc29ydGluZyBmdW5jIGlzIG5lZ2F0aXZlLCB0aGUgMXN0IGFyZyBvZiB0aGUgc29ydGluZyBmdW5jIGlzIG1vdmVkIHRvIHRoZSBsZWZ0IG9mIHRoZSAybmQgYXJnO1xuICAgICAqIGlmIHRoZSByZXMgaXMgcG9zaXRpdmUsIHRoZSAybmQgYXJnIGlzIG1vdmVkIHRvIHRoZSBsZWZ0IG9mIHRoZSAxc3QsXG4gICAgICogaWYgdGhlIHJlcyBpcyAwLCB0aGUgZWxlbXMgcmVtYWluIGluIHRoZWlyIGN1cnJlbnQgcG9zaXRpb24vaW5kZXhlc1xuICAgICAqL1xuICAgIHJldHVybiB1bmlxdWVOYW1lcy5zb3J0KFxuICAgICAgLyoqXG4gICAgICAgKiBzdHJpbmcucHJvdG90eXBlLmxvY2FsZUNvbXBhcmUoKSBjb21wYXJlcyBhIHJlZmVyZW5jZSBzdHJpbmcgdG8gYSBnaXZlbiBzdHJpbmcgYW5kIHJldHVybnMgYSBudW1iZXJcbiAgICAgICAqIGl0J3Mgc2Vjb25kIGFyZ3VtZW50IGlzIGEgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MgZGVzY3JpYmluZyB0aGUgbGFuZ3VhZ2Ugb3IgbGFuZ3VhZ2VzIChsb2NhbGUpIHRvIHVzZSBpbiB0aGUgY29tcGFyaXNvblxuICAgICAgICogZm9yIGxhbmd1YWdlIHJlZmVyZW5jZSBzZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0ludGwjTG9jYWxlX2lkZW50aWZpY2F0aW9uX2FuZF9uZWdvdGlhdGlvblxuICAgICAgICovXG4gICAgICAobGVmdE5hbWUsIHJpZ2h0TmFtZSkgPT4gbGVmdE5hbWUubG9jYWxlQ29tcGFyZShyaWdodE5hbWUsICdlbicpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hbnVhbFNvcnQoKSB7XG4gICAgcmV0dXJuIG1lcmdlU29ydCh1bmlxdWVOYW1lcywgYWxwaGFDb21wYXJlKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvdG9NZXRob2RzOiBwcm90b1NvcnQoKSxcbiAgICBtYW51YWxTb3J0OiBtYW51YWxTb3J0KClcbiAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvc29ydE5hbWVzLmpzIl0sIm1hcHBpbmdzIjoiOzs7OztBQUVBO0FBQ0E7QUFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7Ozs7O0FBS0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/js/sortNames.js\n");

/***/ }),

/***/ 0:
/*!******************************!*\
  !*** multi ./src/js/main.js ***!
  \******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/js/main.js */"./src/js/main.js");


/***/ })

/******/ });