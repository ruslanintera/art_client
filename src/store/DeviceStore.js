import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._isActive = false; // for SideBar
    this._page = 1;
    this._totalCount = 0;
    this._limit = 2;

    /**************************************************************************************** */
    this._manufacturer = [];
    this._manufacturerOne = {};
    this._manufacturerPage = 1;
    this._manufacturerTotal = 0;
    this._manufacturerLimit = 2;
    this._dc = [];
    this._SetOne = {};
    this._dcPage = 1;
    this._dcTotal = 0;
    this._dcLimit = 2;

    this._racktype = [];
    this._racktype3d = [];
    this._racktypeOne = {};
    this._racktypePage = 1;
    this._racktypeTotal = 0;
    this._racktypeLimit = 5;

    this._rack = [];
    this._rackOne = {};
    this._rackPage = 1;
    this._rackTotal = 0;
    this._rackLimit = 2;
    this._detailtype = [];
    this._detailtypeOne = {};
    this._detailtypePage = 1;
    this._detailtypeTotal = 0;
    this._detailtypeLimit = 2;

    this._rack3d = [];
    this._rack3dOne = {};
    this._rack3dPage = 1;
    this._rack3dTotal = 0;
    this._rack3dLimit = 2;

    this._modelrack3d = [];
    this._modelrack3dForPageNumber = [];
    this._modelrack3dOne = {};
    this._modelrack3dPage = 1;
    this._modelrack3dTotal = 0;
    this._modelrack3dLimit = 9;

    this._activeObject = {}; // selected RACK
    this._activeRackType = {}; // selected RACK TYPE - activated
    //this._active3dModel = {}; // selected 3d Model of RACK
    this._active3dElement = {}; // selected 3d Element

    /**************************************************************************************** */

    makeAutoObservable(this);
  }

  // for SideBar
  setIsActive(bool) {
    this._isActive = bool;
  }
  get isActive() {
    return this._isActive;
  }

  setActiveObject(obj) {
    this._activeObject = obj;
  }
  get getActiveObject() {
    return this._activeObject;
  }

  // тут описание текущей моели
  setActiveModel(obj) {
    this._activeRackType = obj;
  }
  get getActiveModel() {
    return this._activeRackType;
  }

  // тут полное описание текущего элемента
  setActive3dElement(obj) {
    this._active3dElement = obj;
  }
  get getActive3dElement() {
    return this._active3dElement;
  }

  /**** Manufacturer ************************************************************************ */
  setManufacturer(obj) {
    this._manufacturer = obj;
  }
  get getManufacturer() {
    return this._manufacturer;
  }
  setManufacturerOne(obj) {
    this._manufacturerOne = obj;
  }
  get getManufacturerOne() {
    return this._manufacturerOne;
  }
  setManufacturerPage(page) {
    this._manufacturerPage = page;
  }
  get getManufacturerPage() {
    return this._manufacturerPage;
  }
  setManufacturerTotal(total) {
    this._manufacturerTotal = total;
  }
  get getManufacturerTotal() {
    return this._manufacturerTotal;
  }
  get getManufacturerLimit() {
    return this._manufacturerLimit;
  }
  /**** Set ************************************************************************ */
  setDC(obj) {
    this._dc = obj;
  }
  get getDC() {
    return this._dc;
  }
  setSetOne(obj) {
    this._SetOne = obj;
  }
  get getSetOne() {
    return this._SetOne;
  }
  setDCPage(page) {
    this._dcPage = page;
  }
  get getDCPage() {
    return this._dcPage;
  }
  setDCTotal(total) {
    this._dcTotal = total;
  }
  get getDCTotal() {
    return this._dcTotal;
  }
  get getDCLimit() {
    return this._dcLimit;
  }
  /**** ModelType3d ************************************************************************ */
  setModelType3d3d(obj) {
    this._racktype3d = obj;
  }
  get getModelType3d3d() {
    return this._racktype3d;
  }
  setModelType3d(obj) {
    this._racktype = obj;
  }
  get getModelType3d() {
    return this._racktype;
  }

  setModelType3dOne(obj) {
    this._racktypeOne = obj;
  }
  get getModelType3dOne() {
    return this._racktypeOne;
  }
  setModelType3dPage(page) {
    //console.log("setModelType3dPage page=", page);
    this._racktypePage = page;
  }
  get getModelType3dPage() {
    return this._racktypePage;
  }
  setModelType3dTotal(total) {
    this._racktypeTotal = total;
  }
  get getModelType3dTotal() {
    return this._racktypeTotal;
  }
  get getModelType3dLimit() {
    return this._racktypeLimit;
  }
  /**** Rack ************************************************************************ */
  setRack(obj) {
    this._rack = obj;
  }
  get getRack() {
    return this._rack;
  }
  setRackOne(obj) {
    this._rackOne = obj;
  }
  get getRackOne() {
    return this._rackOne;
  }
  setRackPage(page) {
    this._rackPage = page;
  }
  get getRackPage() {
    return this._rackPage;
  }
  setRackTotal(total) {
    this._rackTotal = total;
  }
  get getRackTotal() {
    return this._rackTotal;
  }
  get getRackLimit() {
    return this._rackLimit;
  }

  /**** ModelRack3d - список элементов 3Д модели ************************************************************************ */
  setModelRack3d(obj) {
    this._modelrack3d = obj;
  }
  get getModelRack3d() {
    return this._modelrack3d;
  }
  //постраничный вывод списка элементов 3Д модели:
  setModelRack3dForPageNumber(obj) {
    this._modelrack3dForPageNumber = obj;
  }
  get getModelRack3dForPageNumber() {
    return this._modelrack3dForPageNumber;
  }

  setModelRack3dOne(obj) {
    this._modelrack3dOne = obj;
  }
  get getModelRack3dOne() {
    return this._modelrack3dOne;
  }
  setModelRack3dPage(page) {
    this._modelrack3dPage = page;
  }
  get getModelRack3dPage() {
    return this._modelrack3dPage;
  }
  setModelRack3dTotal(total) {
    this._modelrack3dTotal = total;
  }
  get getModelRack3dTotal() {
    return this._modelrack3dTotal;
  }
  get getModelRack3dLimit() {
    return this._modelrack3dLimit;
  }

  /**************************************************************************************** */

  /**************************************************************************************** */
}
