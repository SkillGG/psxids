"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var cheerio_1 = require("cheerio");
var fs_1 = require("fs");
var coolRomListURL = "https://coolrom.com.au/roms/";
var coolRomDBs = {
    psp: "psp",
    psx: "psx",
    psx2: "ps2"
};
var coolRomBaseURL = "https://coolrom.com.au";
var coolRomLists = "0_A_B_C_D_E_F_G_H_I_J_K_L_M_N_O_P_Q_R_S_T_U_V_W_X_Y_Z".split("_");
var countries = [
    ["Europe", "pal", "E"],
    ["USA", "ntscu", "E"],
    ["Japan", "ntscj", "J"],
    ["China", "ntscj", "Ch"],
    ["Korea", "ntscj", "K"],
    ["Italy", "pal", "I"],
    ["Spain", "pal", "S"],
    ["Australia", "pal", "E"],
    ["Netherlands", "pal", "Du"],
    ["Sweden", "pal", "Sw"],
    ["Germany", "pal", "G"],
    ["France", "pal", "F"],
    ["Poland", "pal", "Pl"],
];
var dbURLs = {
    psp: "http://psxdatacenter.com/psp/$list.html",
    psx2: "http://psxdatacenter.com/psx2/$list2.html",
    psx: "http://psxdatacenter.com/$list.html"
};
var regions = {
    j: "ntscj",
    p: "pal",
    u: "ntscu"
};
var fetchAllDownloadURLs = function (db) { return __awaiter(void 0, void 0, void 0, function () {
    var linkData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                linkData = [];
                return [4 /*yield*/, Promise.all(coolRomLists.map(function (_, i) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _b = (_a = linkData.push).apply;
                                    _c = [linkData];
                                    return [4 /*yield*/, fetchDownloadURL(db, i)];
                                case 1:
                                    _b.apply(_a, _c.concat([(_d.sent())]));
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                _a.sent();
                linkData.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                return [2 /*return*/, linkData];
        }
    });
}); };
var fetchDownloadURL = function (db, i) { return __awaiter(void 0, void 0, void 0, function () {
    var path, site, $, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = coolRomListURL + coolRomDBs[db] + "/" + coolRomLists[i];
                return [4 /*yield*/, fetch(path)
                        .then(function (r) { return r.text(); })["catch"](function (err) {
                        console.error("Fetch error!", err);
                        throw "Something went wrong!";
                    })];
            case 1:
                site = _a.sent();
                console.log("Fetching link data from ".concat(path));
                $ = (0, cheerio_1.load)(site);
                data = [];
                $("table table table font[size='2'] > div > a")
                    .toArray()
                    .forEach(function (e) {
                    var elem = $(e);
                    var name = elem.text().replace(/\([^\)]+\)/g, "");
                    var href = coolRomBaseURL + elem.attr("href");
                    var country = elem.parent().attr("class") || "USA";
                    data.push({ name: name, href: href, country: country });
                });
                return [2 /*return*/, data];
        }
    });
}); };
var fetchEveryGameDataFromDB = function (ps) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                data = [];
                _b = (_a = data.push).apply;
                _c = [data];
                return [4 /*yield*/, fetchFromDB(ps, "j")];
            case 1:
                _b.apply(_a, _c.concat([(_k.sent())]));
                _e = (_d = data.push).apply;
                _f = [data];
                return [4 /*yield*/, fetchFromDB(ps, "p")];
            case 2:
                _e.apply(_d, _f.concat([(_k.sent())]));
                _h = (_g = data.push).apply;
                _j = [data];
                return [4 /*yield*/, fetchFromDB(ps, "u")];
            case 3:
                _h.apply(_g, _j.concat([(_k.sent())]));
                return [2 /*return*/, data];
        }
    });
}); };
var fetchFromDB = function (ps, db) { return __awaiter(void 0, void 0, void 0, function () {
    var url, site, $, dbGames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = dbURLs[ps].replace("$", db);
                console.log("Fetching game data from ".concat(url));
                return [4 /*yield*/, fetch(url)
                        .then(function (r) { return r.text(); })["catch"](function (err) {
                        console.error("Fetching data from " + url + "failed!", err);
                        throw "Something went wrong!";
                    })];
            case 1:
                site = _a.sent();
                $ = (0, cheerio_1.load)(site);
                dbGames = [];
                $(".sectiontable tr")
                    .toArray()
                    .forEach(function (e) {
                    var _a;
                    var elem = $(e);
                    var id = elem.children("td:nth-child(2)").text();
                    var name = elem
                        .children("td:nth-child(3)")
                        .text()
                        .replace(/\xa0/, "");
                    var langs = ((_a = elem
                        .children("td:nth-child(4)")
                        .text()
                        .match(/[\[\(]([^\[\(]+)[\]\)]/g)) === null || _a === void 0 ? void 0 : _a.map(function (e) { return e.trim().replace(/[\[\(\)\]]/g, ""); })) || [];
                    dbGames.push({
                        id: id,
                        langs: langs,
                        name: name,
                        region: regions[db]
                    });
                });
                return [2 /*return*/, dbGames];
        }
    });
}); };
var getDataFromDB = function (db, fromFile) {
    if (fromFile === void 0) { fromFile = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var data, linkData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fromFile) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetchEveryGameDataFromDB(db)];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, fetchAllDownloadURLs(db)];
                case 2:
                    linkData = _a.sent();
                    (0, fs_1.writeFileSync)("./".concat(db, "/gameData.json"), JSON.stringify(data, undefined, 2), "utf-8");
                    (0, fs_1.writeFileSync)("./".concat(db, "/linkData.json"), JSON.stringify(linkData, undefined, 2), "utf-8");
                    console.log("Got ", data.length, "games");
                    console.log("Got ", linkData.length, "links");
                    console.log("Saving games to " + "./".concat(db, "/gameData.json"));
                    console.log("Saving links to " + "./".concat(db, "/linkData.json"));
                    return [3 /*break*/, 4];
                case 3:
                    data = JSON.parse((0, fs_1.readFileSync)("./".concat(db, "/gameData.json"), "utf-8"));
                    linkData = JSON.parse((0, fs_1.readFileSync)("./".concat(db, "/linkData.json"), "utf-8"));
                    console.log("Got ", data.length, " ".concat(db, " games"));
                    console.log("Got ", linkData.length, " ".concat(db, " links"));
                    _a.label = 4;
                case 4: return [2 /*return*/, [data, linkData]];
            }
        });
    });
};
var connectDataWithLinks = function (data, links) {
    var checkRegion = function (linkCountry, gameRegion, gameLanguage, country, setRegion, setLanguage) {
        return linkCountry === country &&
            gameRegion === setRegion &&
            gameLanguage.includes(setLanguage);
    };
    // links.reverse();
    var allGames = data.reduce(function (p, n, ix) {
        if (p.find(function (g) { return g.id === n.id; }))
            return p;
        var lnk = links.find(function (l, il, al) {
            var hasSameRegion = countries.reduce(function (p, nc) {
                return (p ||
                    checkRegion(l.country, n.region, n.langs, nc[0], nc[1], nc[2]));
            }, false);
            var hasSameName = n.name
                .replace(/[^a-z\d]/gi, "")
                .toLowerCase()
                .includes(l.name.replace(/[^a-z\d+]/gi, "").toLowerCase());
            return hasSameRegion && hasSameName;
        });
        if (lnk) {
            return __spreadArray(__spreadArray([], p, true), [__assign(__assign({}, n), { link: lnk.href })], false);
        }
        return __spreadArray(__spreadArray([], p, true), [n], false);
    }, []);
    return allGames;
};
var getConnectedDataFromDB = function (db) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, d, l;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getDataFromDB(db, !1)];
            case 1:
                _a = _b.sent(), d = _a[0], l = _a[1];
                return [2 /*return*/, connectDataWithLinks(d, l)];
        }
    });
}); };
var writeData = function (db, data) {
    console.log("Got ".concat(data.length, " ").concat(db, " games"));
    console.log("Got ".concat(data.filter(function (r) { return !!r.link; }).length, " ").concat(db, " games with links"));
    console.log("Saving to ./".concat(db, "/data.json"));
    (0, fs_1.writeFileSync)("./".concat(db, "/data.json"), JSON.stringify(data), {
        encoding: "utf-8"
    });
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                console.log("======== PSPortable ========");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                return [4 /*yield*/, getConnectedDataFromDB("psp").then(function (data) {
                        return writeData("psp", data);
                    })];
            case 1:
                _a.sent();
                console.log("Waiting 60s");
                return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 60 * 1000); })];
            case 2:
                _a.sent();
                console.log("============ PS1 ===========");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                return [4 /*yield*/, getConnectedDataFromDB("psx").then(function (data) {
                        return writeData("psx", data);
                    })];
            case 3:
                _a.sent();
                console.log("Waiting 60s");
                return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 60 * 1000); })];
            case 4:
                _a.sent();
                console.log("============ PS2 ===========");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                console.log("============================");
                return [4 /*yield*/, getConnectedDataFromDB("psx2").then(function (data) {
                        return writeData("psx2", data);
                    })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
main();
// fetchDownURL(3);
