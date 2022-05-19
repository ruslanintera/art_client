import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._isActive = false; // for SideBar
    this._page = 1;
    this._totalCount = 0;
    this._limit = 2;

    /**************************************************************************************** */
    this._role = [];
    this._roleOne = {};
    this._rolePage = 1;
    this._roleTotal = 0;
    this._roleLimit = 2;
    this._manufacturer = [];
    this._manufacturerOne = {};
    this._manufacturerPage = 1;
    this._manufacturerTotal = 0;
    this._manufacturerLimit = 2;
    this._dc = [];
    this._dcOne = {};
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
  setActiveRackType(obj) {
    this._activeRackType = obj;
  }
  get getActiveRackType() {
    return this._activeRackType;
  }

  // тут полное описание текущего RACK === CUBE !!!
  //setActiveRackType3d(obj) { this._activeRackType3d = obj } get getActiveRackType3d() { return this._activeRackType3d }
  // тут полное описание текущего RACK === 3D RACK MODEL !!!
  // setActive3dModel(obj) {
  //   this._active3dModel = obj;
  // }
  // get getActive3dModel() {
  //   return this._active3dModel;
  // }
  // тут полное описание текущего элемента
  setActive3dElement(obj) {
    this._active3dElement = obj;
  }
  get getActive3dElement() {
    return this._active3dElement;
  }

  /**** Role ************************************************************************ */
  setRole(obj) {
    this._role = obj;
  }
  get getRole() {
    return this._role;
  }
  setRoleOne(obj) {
    this._roleOne = obj;
  }
  get getRoleOne() {
    return this._roleOne;
  }
  setRolePage(page) {
    this._rolePage = page;
  }
  get getRolePage() {
    return this._rolePage;
  }
  setRoleTotal(total) {
    this._roleTotal = total;
  }
  get getRoleTotal() {
    return this._roleTotal;
  }
  get getRoleLimit() {
    return this._roleLimit;
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
  /**** DC ************************************************************************ */
  setDC(obj) {
    this._dc = obj;
  }
  get getDC() {
    return this._dc;
  }
  setDCOne(obj) {
    this._dcOne = obj;
  }
  get getDCOne() {
    return this._dcOne;
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
  /**** Racktype ************************************************************************ */
  setRacktype3d(obj) {
    this._racktype3d = obj;
  }
  get getRacktype3d() {
    return this._racktype3d;
  }
  setRacktype(obj) {
    this._racktype = obj;
  }
  get getRacktype() {
    return this._racktype;
  }

  setRacktypeOne(obj) {
    this._racktypeOne = obj;
  }
  get getRacktypeOne() {
    return this._racktypeOne;
  }
  setRacktypePage(page) {
    //console.log("setRacktypePage page=", page);
    this._racktypePage = page;
  }
  get getRacktypePage() {
    return this._racktypePage;
  }
  setRacktypeTotal(total) {
    this._racktypeTotal = total;
  }
  get getRacktypeTotal() {
    return this._racktypeTotal;
  }
  get getRacktypeLimit() {
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

  /**** Rack3d ************************************************************************ * /
  setRack3d(obj) {
    this._rack3d = obj;
  }
  get getRack3d() {
    return this._rack3d;
  }
  setRack3dOne(obj) {
    this._rack3dOne = obj;
  }
  get getRack3dOne() {
    return this._rack3dOne;
  }
  setRack3dPage(page) {
    this._rack3dPage = page;
  }
  get getRack3dPage() {
    return this._rack3dPage;
  }
  setRack3dTotal(total) {
    this._rack3dTotal = total;
  }
  get getRack3dTotal() {
    return this._rack3dTotal;
  }
  get getRack3dLimit() {
    return this._rack3dLimit;
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
  /**** Permission ************************************************************************ */
  setPermission(obj) {
    this._permission = obj;
  }
  get getPermission() {
    return this._permission;
  }
  setPermissionOne(obj) {
    this._permissionOne = obj;
  }
  get getPermissionOne() {
    return this._permissionOne;
  }
  setPermissionPage(page) {
    this._permissionPage = page;
  }
  get getPermissionPage() {
    return this._permissionPage;
  }
  setPermissionTotal(total) {
    this._permissionTotal = total;
  }
  get getPermissionTotal() {
    return this._permissionTotal;
  }
  get getPermissionLimit() {
    return this._permissionLimit;
  }

  /**************************************************************************************** */

  /**************************************************************************************** */
}
