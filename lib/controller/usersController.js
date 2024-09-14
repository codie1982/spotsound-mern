"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var asyncHandler = require("express-async-handler");
var bcrypt = require("bcryptjs");
var ConnectionModel = require("../models/connectionModel");
var User = require("../models/userModel");
var Username = require("../models/usernameModel");
var Authorizate = require("../models/authorizationModel");
var usernameDb = require("../dbMap/username/usernameDb");
var userDbmap = require("../dbMap/users/usersDbmap");
var mailVerifyDbmap = require("../dbMap/mail/mailVerifyDbmap");
var generateToken = require("../library/user/generate_token");
var mailController = require("../mail/mailController");
var isSingleWord = require("../library/user/isSingleWord");
var _require = require("google-auth-library"),
  OAuth2Client = _require.OAuth2Client;
var getUserDataFromGoogle = require("./googleController");
var preparedata = require("../config/preparedata");
var CONSTANT = require("../constant/users/user_constant");
var geoip = require('geoip-lite');
var connectionDbmap = require("../dbMap/connection/connectionDbmap");
var SCOPE = "https://www.googleapis.com/auth/userinfo.profile email openid";
var redirecServertUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:5001" : "https://" + process.env.REDIRECT_SERVER_URL + "/api/users/oauth";
var redirecUrl = process.env.NODE_ENV == "development" ? "http://127.0.0.1:3000" : "https://" + process.env.REDIRECT_URL;
var allow_origin_url = process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://" + process.env.ALLOW_ORJIN_URL;
//access private
var getMe = asyncHandler(/*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _yield$userDbmap$getU, name, email, profileImage, data;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return userDbmap.getUserInfo(req.user._id);
        case 2:
          _yield$userDbmap$getU = _context.sent;
          name = _yield$userDbmap$getU.name;
          email = _yield$userDbmap$getU.email;
          profileImage = _yield$userDbmap$getU.profileImage;
          try {
            data = {
              name: name,
              email: email,
              image: profileImage.path
            };
            res.status(200).json(preparedata(data, 200, "Connection Status"));
          } catch (error) {
            console.error("Error reading data:", error);
          }
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
//access public
var register = asyncHandler(/*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body, firstname, lastname, username, email, device, provider, password, userAgent, ip, isUserExist, isUserNameExist, doc, mUser, userid, newUsername, newAuth;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, username = _req$body.username, email = _req$body.email, device = _req$body.device, provider = _req$body.provider, password = _req$body.password;
          if (!(provider == CONSTANT.EMAIL)) {
            _context2.next = 42;
            break;
          }
          userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
          ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
          if (!username || !email || !password) {
            res.status(400).json(preparedata({}, 400, "Please add all fields"));
          }
          if (!isSingleWord(username)) {
            res.status(400).json(preparedata({}, 400, "Kullanıcı adı tek kelime olmalı"));
          }
          //check Email
          _context2.next = 8;
          return userDbmap.isUserFromEmail(email);
        case 8:
          isUserExist = _context2.sent;
          if (isUserExist) {
            res.status(400).json(preparedata({}, 400, "User Already register"));
          }
          //check Username
          _context2.next = 12;
          return usernameDb.find(username);
        case 12:
          isUserNameExist = _context2.sent;
          if (isUserNameExist) {
            res.status(400).json(preparedata(null, 400, "Username Already Exist"));
          }
          //Create Use
          doc = new User();
          _context2.next = 17;
          return makepassword(password);
        case 17:
          doc.password = _context2.sent;
          doc.firstname = firstname;
          doc.lastname = lastname;
          doc.email = email;
          doc.appType = device;
          doc.authProvider = provider;
          _context2.next = 25;
          return doc.save();
        case 25:
          mUser = _context2.sent;
          if (!mUser) {
            _context2.next = 37;
            break;
          }
          userid = mUser._id;
          newUsername = new Username({
            userid: userid,
            // Bu bir ObjectId olmalı (mevcut kullanıcı ID'si)
            usernames: [{
              username: username // Kullanıcı adı buraya eklenir
            }]
          }); // Kaydı kaydetme
          _context2.next = 31;
          return newUsername.save();
        case 31:
          newAuth = new Authorizate({
            userid: userid // Bu bir ObjectId olmalı (mevcut kullanıcı ID'si)
          }); //Kullanıcıyı kayıt et
          _context2.next = 34;
          return newAuth.save();
        case 34:
          //Onay maili gönder
          mailController.mailVerify(email).then(function (code) {
            res.status(201).json(preparedata({}, 201, "Kaydınız başarı ile yapıldı. Lütfen mail onay Kodunu gönderiniz."));
          })["catch"](function (err) {
            res.status(201).json(preparedata({}, 201, "Kaydınız başarı ile yapıldı. Lütfen mail onay Kodunu gönderiniz."));
          });
          _context2.next = 40;
          break;
        case 37:
          provider;
          res.status(400);
          throw new Error("InValied DB User ERROR");
        case 40:
          _context2.next = 44;
          break;
        case 42:
          res.status(400);
          throw new Error("InValied User data");
        case 44:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
//access public
var registerWithGoogle = asyncHandler(/*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var oAuth2Client, url;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          res.header("Access-Control-Allow-Origin", allow_origin_url);
          res.header("Access-Control-Allow-Credentials", "true");
          res.header("Referrer-Policy", "no-referrer-when-downgrade");
          console.log("process.env.CLIENT_ID", process.env.CLIENT_ID);
          console.log("process.env.CLIENT_SECRET", process.env.CLIENT_SECRET);
          console.log("redirecServertUrl", redirecServertUrl);
          console.log("SCOPE", SCOPE);
          oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirecServertUrl);
          url = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPE,
            prompt: "consent"
          });
          if (url) {
            res.status(200).json({
              status: {
                code: 200,
                description: "google authentication url"
              },
              message: "google authentication url",
              data: {
                url: url
              }
            });
          } else {
            res.status(400).json({
              status: {
                code: 400,
                description: "no google url"
              },
              message: "there is no google authentication url",
              data: null
            });
          }
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
var googleOAuth = asyncHandler(/*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var selectedUserid, selectedUsername, selectedUserProfilImage, selectedUseremail, code, oAuth2Client, ut, user, googleData, sub, name, given_name, family_name, picture, email, email_verified, userExist, doc, mUser, userAgent, ip, sessionid, connectionModel, geo, userToken, nConnection, _userToken;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          selectedUseremail = "";
          code = req.query.code;
          _context4.prev = 2;
          oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirecServertUrl);
          _context4.next = 6;
          return oAuth2Client.getToken(code);
        case 6:
          ut = _context4.sent;
          _context4.next = 9;
          return oAuth2Client.setCredentials(ut.tokens);
        case 9:
          user = oAuth2Client.credentials;
          _context4.next = 12;
          return getUserDataFromGoogle(user.access_token);
        case 12:
          googleData = _context4.sent;
          sub = googleData.sub, name = googleData.name, given_name = googleData.given_name, family_name = googleData.family_name, picture = googleData.picture, email = googleData.email, email_verified = googleData.email_verified; //checkUsers
          _context4.next = 16;
          return userDbmap.isUserFromEmail(email);
        case 16:
          userExist = _context4.sent;
          if (userExist) {
            _context4.next = 39;
            break;
          }
          doc = new User();
          doc.firstname = given_name;
          doc.lastname = family_name;
          doc.email = email;
          doc.email_verify = email_verified;
          doc.profileImage.type = "external";
          doc.profileImage.path = picture;
          doc.appType = "web";
          doc.authProvider = "google";
          doc.authProviderID = sub;
          _context4.next = 30;
          return userDbmap.add(doc);
        case 30:
          mUser = _context4.sent;
          if (mUser) {
            _context4.next = 34;
            break;
          }
          res.status(400);
          throw new Error("InValied User data");
        case 34:
          selectedUserid = nUser["id"];
          selectedUsername = googleData.name;
          selectedUserProfilImage = googleData.picture;
          _context4.next = 42;
          break;
        case 39:
          selectedUserid = userExist["_id"];
          selectedUsername = userExist["name"];
          selectedUserProfilImage = userExist.profileImage.path;
        case 42:
          //Kullanıcı Oturumu Açma
          // Cihaz bilgilerini al
          userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
          ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
          sessionid = req.sessionID;
          _context4.next = 47;
          return ConnectionModel.findOne({
            sessionid: sessionid
          });
        case 47:
          connectionModel = _context4.sent;
          if (connectionModel) {
            _context4.next = 57;
            break;
          }
          geo = geoip.lookup(ip);
          userToken = generateToken(selectedUserid);
          _context4.next = 53;
          return connectionDbmap.saveConnection(geo, ip, userAgent, "desktop", "web", sessionid, userToken, selectedUserid);
        case 53:
          nConnection = _context4.sent;
          //Mail gönderimi yapıp gönderdiğimiz maili de DBye yazmak gerekli
          if (nConnection) {
            req.session.user = {
              name: selectedUsername,
              image: selectedUserProfilImage,
              token: userToken,
              lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
            };
            res.redirect("".concat(redirecUrl, "/oauth?token=").concat(userToken));
          } else {
            res.redirect("https://www.spotsoundmusic.com");
          }
          _context4.next = 60;
          break;
        case 57:
          _userToken = connectionModel.token;
          req.session.user = {
            name: selectedUsername,
            image: selectedUserProfilImage,
            token: _userToken,
            lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
          };
          res.redirect("".concat(process.env.REDIRECT_URL, "?token=").concat(_userToken));
        case 60:
          _context4.next = 65;
          break;
        case 62:
          _context4.prev = 62;
          _context4.t0 = _context4["catch"](2);
          console.log("error", _context4.t0);
        case 65:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 62]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
//access private
var logout = asyncHandler(/*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          try {
            delete req.session['user'];
            req.session.destroy(function (err) {
              res.status(200).json(preparedata(null, 200, "user logout successful!"));
            });
          } catch (error) {
            console.error("Error reading data:", error);
          }
        case 1:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
//access public
var login = asyncHandler(/*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var userAgent, ip, sessionid, _req$body2, email, password, user, userid, userToken, geo;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          userAgent = req.headers["user-agent"]; // Kullanıcı ajanı (tarayıcı bilgisi)
          ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Kullanıcının IP adresi
          sessionid = req.sessionID;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          if (!(!email || !password)) {
            _context6.next = 7;
            break;
          }
          res.status(400);
          throw new Error("there is no email or password");
        case 7:
          _context6.prev = 7;
          _context6.next = 10;
          return userDbmap.getUserFromMail(email);
        case 10:
          user = _context6.sent;
          userid = user._id;
          if (!(user || bcrypt.compare(password, user.password))) {
            _context6.next = 23;
            break;
          }
          userToken = generateToken(userid);
          geo = geoip.lookup(ip);
          _context6.next = 17;
          return connectionDbmap.saveConnection(geo, ip, userAgent, "desktop", "web", sessionid, userToken, userid);
        case 17:
          req.session.user = {
            name: user.firstname,
            image: user.profileImage.path,
            token: userToken,
            lang: geo != null ? geo.country == "TR" ? "TR" : "EN" : "TR"
          };
          delete user._id;
          delete user.profileImage._id;
          res.status(200).json(preparedata(_objectSpread(_objectSpread({}, user), {}, {
            token: userToken
          }), 200, "user is login success"));
          _context6.next = 25;
          break;
        case 23:
          res.status(400);
          throw new Error("inValide credental");
        case 25:
          _context6.next = 30;
          break;
        case 27:
          _context6.prev = 27;
          _context6.t0 = _context6["catch"](7);
          console.error("Error reading data:", _context6.t0);
        case 30:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[7, 27]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
var makepassword = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(password) {
    var salt, hashedPassword;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return bcrypt.genSalt(10);
        case 2:
          salt = _context7.sent;
          _context7.next = 5;
          return bcrypt.hash(password, salt);
        case 5:
          hashedPassword = _context7.sent;
          return _context7.abrupt("return", hashedPassword);
        case 7:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function makepassword(_x13) {
    return _ref7.apply(this, arguments);
  };
}();
module.exports = {
  getMe: getMe,
  login: login,
  register: register,
  registerWithGoogle: registerWithGoogle,
  logout: logout,
  googleOAuth: googleOAuth
};