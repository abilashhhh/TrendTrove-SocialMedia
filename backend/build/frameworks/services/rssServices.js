"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRssFeeds = void 0;
const axios_1 = __importDefault(require("axios"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const ErrorInApplication_1 = __importDefault(require("../../utils/ErrorInApplication"));
const RSS_FEEDS = [
    "https://www.sciencenews.org/feed",
    "http://www.espn.com/espn/rss/news",
    "http://www.skysports.com/rss/12040",
    "https://www.tmz.com/rss.xml",
    "http://rss.cnn.com/rss/edition.rss",
    "https://variety.com/feed/",
];
const fetchRssFeeds = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parser = new rss_parser_1.default();
        const axiosInstance = axios_1.default.create({ timeout: 10000 });
        const feedPromises = RSS_FEEDS.map((url) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axiosInstance.get(url);
                const feed = yield parser.parseString(response.data);
                return feed.items;
            }
            catch (error) {
                console.error(`Failed to fetch RSS feed from URL: ${url}`, error);
                return [];
            }
        }));
        const feeds = yield Promise.all(feedPromises);
        return feeds.flat();
    }
    catch (error) {
        console.error("Failed to fetch or parse RSS feeds", error);
        throw new ErrorInApplication_1.default("Failed to get feeds", 500);
    }
});
exports.fetchRssFeeds = fetchRssFeeds;
