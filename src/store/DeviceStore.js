import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._isActive = false // for SideBar
    this._page = 1
    this._totalCount = 0
    this._limit = 2
    this._SetOne = {}

    /**************************************************************************************** */
    this._manufacturer = []; this._manufacturerOne = {}; this._manufacturerPage = 1
    this._manufacturerTotal = 0; this._manufacturerLimit = 2
 
    this._dc = []; this._dcPage = 1; this._dcTotal = 0; this._dcLimit = 2

    this._racktype = []; this._racktype3d = []; this._racktypeOne = {}; this._racktypePage = 1
    this._racktypeTotal = 0; this._racktypeLimit = 5;

    this._photoVideo = []; this._photoVideo3d = []; this._photoVideoOne = {}; this._photoVideoPage = 1;
    this._photoVideoTotal = 0; this._photoVideoLimit = 5;
    this._video = []; this._video3d = []; this._videoOne = {}; this._videoPage = 1;
    this._videoTotal = 0; this._videoLimit = 5;
    this._photo = []; this._photo3d = []; this._photoOne = {}; this._photoPage = 1;
    this._photoTotal = 0; this._photoLimit = 5;
    this._audio = []; this._audio3d = []; this._audioOne = {}; this._audioPage = 1;
    this._audioTotal = 0; this._audioLimit = 5;


    this._modelrack3d = []
 this._modelrack3dForPageNumber = []
 this._modelrack3dOne = {}
 this._modelrack3dPage = 1
 this._modelrack3dTotal = 0
 this._modelrack3dLimit = 9

    this._activeRackType = {}
    this._active3dElement = {}

    /**************************************************************************************** */

    makeAutoObservable(this)
  }

  // for SideBar
  setIsActive(bool) { this._isActive = bool }
  get isActive() { return this._isActive }

  // тут описание текущей моели
  setActiveModel(obj) { this._activeRackType = obj }
  get getActiveModel() { return this._activeRackType }

  // тут полное описание текущего элемента
  setActive3dElement(obj) { this._active3dElement = obj }
  get getActive3dElement() { return this._active3dElement }

  /**** Manufacturer ************************************************************************ */
  setManufacturer(obj) { this._manufacturer = obj }
  get getManufacturer() { return this._manufacturer }
  setManufacturerOne(obj) { this._manufacturerOne = obj }
  get getManufacturerOne() { return this._manufacturerOne }
  setManufacturerPage(page) { this._manufacturerPage = page }
  get getManufacturerPage() { return this._manufacturerPage }
  setManufacturerTotal(total) { this._manufacturerTotal = total }
  get getManufacturerTotal() { return this._manufacturerTotal }
  get getManufacturerLimit() { return this._manufacturerLimit }
  /**** Set ************************************************************************ */
  setDC(obj) { this._dc = obj }
  get getDC() { return this._dc }
  setSetOne(obj) { this._SetOne = obj }
  get getSetOne() { return this._SetOne }
  setDCPage(page) { this._dcPage = page }
  get getDCPage() { return this._dcPage }
  setDCTotal(total) { this._dcTotal = total }
  get getDCTotal() { return this._dcTotal }
  get getDCLimit() { return this._dcLimit }
  /**** ModelType3d ************************************************************************ */
  setModelType3d3d(obj) { this._racktype3d = obj }
  get getModelType3d3d() { return this._racktype3d }
  setModelType3d(obj) { this._racktype = obj }
  get getModelType3d() { return this._racktype }

  setModelType3dOne(obj) { this._racktypeOne = obj }
  get getModelType3dOne() { return this._racktypeOne }
  setModelType3dPage(page) { this._racktypePage = page }
  get getModelType3dPage() { return this._racktypePage }
  setModelType3dTotal(total) { this._racktypeTotal = total }
  get getModelType3dTotal() { return this._racktypeTotal }
  get getModelType3dLimit() { return this._racktypeLimit }
  /**** PhotoVideo ************************************************************************ */
  setPhotoVideo3d(obj) { this._photoVideo3d = obj }
  get getPhotoVideo3d() { return this._photoVideo3d }
  setPhotoVideo(obj) { this._photoVideo = obj }
  get getPhotoVideo() { return this._photoVideo }

  setPhotoVideoOne(obj) { this._photoVideoOne = obj }
  get getPhotoVideoOne() { return this._photoVideoOne }
  setPhotoVideoPage(page) { this._photoVideoPage = page }
  get getPhotoVideoPage() { return this._photoVideoPage }
  setPhotoVideoTotal(total) { this._photoVideoTotal = total }
  get getPhotoVideoTotal() { return this._photoVideoTotal }
  get getPhotoVideoLimit() { return this._photoVideoLimit }
  /**** Photo ************************************************************************ */
  setPhoto(obj) { this._photo = obj }
  get getPhoto() { return this._photo }

  setPhotoOne(obj) { this._photoOne = obj }
  get getPhotoOne() { return this._photoOne }
  setPhotoPage(page) { this._photoPage = page }
  get getPhotoPage() { return this._photoPage }
  setPhotoTotal(total) { this._photoTotal = total }
  get getPhotoTotal() { return this._photoTotal }
  get getPhotoLimit() { return this._photoLimit }
  /**** Video ************************************************************************ */
  setVideo(obj) { this._video = obj }
  get getVideo() { return this._video }

  setVideoOne(obj) { this._videoOne = obj }
  get getVideoOne() { return this._videoOne }
  setVideoPage(page) { this._videoPage = page }
  get getVideoPage() { return this._videoPage }
  setVideoTotal(total) { this._videoTotal = total }
  get getVideoTotal() { return this._videoTotal }
  get getVideoLimit() { return this._videoLimit }
  /**** Audio ************************************************************************ */
  setAudio(obj) { this._audio = obj }
  get getAudio() { return this._audio }

  setAudioOne(obj) { this._audioOne = obj }
  get getAudioOne() { return this._audioOne }
  setAudioPage(page) { this._audioPage = page }
  get getAudioPage() { return this._audioPage }
  setAudioTotal(total) { this._audioTotal = total }
  get getAudioTotal() { return this._audioTotal }
  get getAudioLimit() { return this._audioLimit }

  /**** ModelRack3d - список элементов 3Д модели ************************************************************************ */
  setModelRack3d(obj) {
 this._modelrack3d = obj
  }
  get getModelRack3d() {
 return this._modelrack3d
  }
  //постраничный вывод списка элементов 3Д модели:
  setModelRack3dForPageNumber(obj) {
 this._modelrack3dForPageNumber = obj
  }
  get getModelRack3dForPageNumber() {
 return this._modelrack3dForPageNumber
  }

  setModelRack3dOne(obj) {
 this._modelrack3dOne = obj
  }
  get getModelRack3dOne() {
 return this._modelrack3dOne
  }
  setModelRack3dPage(page) {
 this._modelrack3dPage = page
  }
  get getModelRack3dPage() {
 return this._modelrack3dPage
  }
  setModelRack3dTotal(total) {
 this._modelrack3dTotal = total
  }
  get getModelRack3dTotal() {
 return this._modelrack3dTotal
  }
  get getModelRack3dLimit() {
 return this._modelrack3dLimit
  }

  /**************************************************************************************** */

  /**************************************************************************************** */
}
