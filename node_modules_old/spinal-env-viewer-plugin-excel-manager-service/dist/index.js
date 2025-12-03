"use strict";
/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelManager = exports.SpinalExcelManager = void 0;
const CreateExcel_1 = require("./classes/CreateExcel");
const convertExcel_1 = require("./classes/convertExcel");
const fs_1 = require("fs");
// console.log("FileReader", FileReader)
class SpinalExcelManager {
    static export(argExcelsData) {
        let excelsData = Array.isArray(argExcelsData) ? argExcelsData : [argExcelsData];
        let promises = excelsData.map((excel) => __awaiter(this, void 0, void 0, function* () {
            let createExcel = new CreateExcel_1.default(excel.data);
            yield createExcel.createSheet();
            return createExcel.getWorkbook();
        }));
        return Promise.all(promises);
    }
    static exportViaWorkbook(argExcelsData) {
        let excelsData = Array.isArray(argExcelsData) ? argExcelsData : [argExcelsData];
        let promises = excelsData.map((excel) => __awaiter(this, void 0, void 0, function* () {
            let createExcel = new CreateExcel_1.default(excel.data);
            yield createExcel.createSheet();
            return createExcel.getWorkbookInstance();
        }));
        return Promise.all(promises);
    }
    static convertExcelToJson(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(file);
            let buffer;
            if (typeof file === "string") {
                buffer = fs_1.readFileSync(file);
            }
            else {
                buffer = file;
            }
            if (typeof window !== "undefined") {
                return this.convertInNavigator(buffer);
            }
            const convertExcel = new convertExcel_1.default();
            return convertExcel.toJson(buffer);
        });
    }
    static convertConfigurationFile(file) {
        const headerRow = 6;
        const convertExcel = new convertExcel_1.default();
        const fileReader = new FileReader();
        // console.log("file", file);
        return new Promise((resolve, reject) => {
            fileReader.onload = (_file) => __awaiter(this, void 0, void 0, function* () {
                const data = _file.target.result;
                const json = yield convertExcel.configurationToJson(data, headerRow);
                return resolve(json);
            });
            ///////////////////////////////////////////////
            //                  On Error
            ///////////////////////////////////////////////
            fileReader.onerror = err => {
                reject(err);
            };
            fileReader.readAsArrayBuffer(file);
        });
    }
    static convertInNavigator(file) {
        const convertExcel = new convertExcel_1.default();
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onload = (_file) => __awaiter(this, void 0, void 0, function* () {
                const data = _file.target.result;
                const json = yield convertExcel.toJson(data);
                return resolve(json);
            });
            //     ///////////////////////////////////////////////
            //     //                  On Error
            //     ///////////////////////////////////////////////
            fileReader.onerror = err => {
                reject(err);
            };
            fileReader.readAsArrayBuffer(file);
        });
    }
}
exports.default = SpinalExcelManager;
exports.SpinalExcelManager = SpinalExcelManager;
const globalRoot = typeof window === "undefined" ? global : window;
if (typeof globalRoot.spinal === 'undefined')
    globalRoot.spinal = {};
if (typeof globalRoot.spinal.excelManager === 'undefined') {
    globalRoot.spinal.excelManager = SpinalExcelManager;
}
globalRoot.excelManager = SpinalExcelManager;
const excelManager = SpinalExcelManager;
exports.excelManager = excelManager;
//# sourceMappingURL=index.js.map