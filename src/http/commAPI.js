import { $authHost, $host } from "../http/index";

/** Manufacturer ******************************************* */
export const fetchManufacturerCreate = async (obj) => {
  const { data } = await $authHost.post("api/manufacturer/create/", obj);
  return data;
};
export const fetchManufacturer = async (id, name, page = 1, limit = 5) => {
  const { data } = await $host.get("api/manufacturer", {
    params: { id, name, page, limit },
  });
  return data;
};
export const fetchManufacturerUpdate = async (obj) => {
  const { data } = await $authHost.post(
    "api/manufacturer/update/" + obj.id,
    obj
  );
  return data;
};
export const fetchOneManufacturer = async (id) => {
  const { data } = await $host.get("api/manufacturer/" + id);
  return data;
};
export const fetchManufacturerDelete = async (id) => {
  const { data } = await $authHost.get("api/manufacturer/delete/" + id);
  return data;
};

/** Set ******************************************* */
export const fetchSetCreate = async (obj) => {
  const { data } = await $authHost.post("api/dc/create/", obj);
  return data;
};
export const fetchSet = async (
  id,
  name,
  adress,
  model3d,
  color,
  page = 1,
  limit = 5
) => {
  const { data } = await $host.get("api/dc", {
    params: { id, name, adress, model3d, color, page, limit },
  });
  return data;
};
export const fetchSetUpdate = async (obj) => {
  const { data } = await $authHost.post("api/dc/update/" + obj.id, obj);
  return data;
};
export const fetchOneDC = async (id) => {
  const { data } = await $host.get("api/dc/" + id);
  return data;
};
export const fetchSetDelete = async (id) => {
  const { data } = await $authHost.get("api/dc/delete/" + id);
  return data;
};

/** ModelType3d ******************************************* */
export const fetchModelType3dCreate = async (obj) => {
  const { data } = await $authHost.post("api/racktype/create/", obj);
  return data;
};
export const fetchModelType3d = async ({
  id,
  name,
  manufacturer,
  model3d,
  color,
  params1,
  params2,
  user,
  page = 1,
  limit = 5,
}) => {
  const { data } = await $host.get("api/racktype", {
    params: {
      id,
      name,
      manufacturer,
      model3d,
      color,
      params1,
      params2,
      user,
      page,
      limit,
    },
  });
  return data;
};
export const fetchModelType3dUpdate = async (obj) => {
  const { data } = await $authHost.post("api/racktype/update/" + obj.id, obj);
  return data;
};
export const fetchModelType3dUploadGLB = async (obj, id) => {
  const { data } = await $authHost.post("api/racktype/uploadglbjpg/" + id, obj);
  return data;
};
export const fetchOneModelType3d = async (id) => {
  const { data } = await $host.get("api/racktype/" + id);
  return data;
};
export const fetchModelType3dDelete = async (id) => {
  const { data } = await $authHost.get("api/racktype/delete/" + id);
  return data;
};

/** PhotoVideo ******************************************* */
export const fetchPhotoVideoCreate = async (obj) => {
  const { data } = await $authHost.post("api/photovideo/create/", obj);
  return data;
};
export const fetchPhotoVideo = async ({
  id,
  name,
  manufacturer,
  model3d,
  color,
  params1,
  params2,
  user,
  page = 1,
  limit = 5,
}) => {
  const { data } = await $host.get("api/photovideo", {
    params: {
      id,
      name,
      manufacturer,
      model3d,
      color,
      params1,
      params2,
      user,
      page,
      limit,
    },
  });
  return data;
};
export const fetchPhotoVideoUpdate = async (obj) => {
  const { data } = await $authHost.post("api/photovideo/update/" + obj.id, obj);
  return data;
};
export const fetchPhotoVideoUploadGLB = async (obj, id) => {
  const { data } = await $authHost.post(
    "api/photovideo/uploadglbjpg/" + id,
    obj
  );
  return data;
};
export const fetchOnePhotoVideo = async (id) => {
  const { data } = await $host.get("api/photovideo/" + id);
  return data;
};
export const fetchPhotoVideoDelete = async (id) => {
  const { data } = await $authHost.get("api/photovideo/delete/" + id);
  return data;
};

/** Rack ******************************************* */
export const fetchRackCreate = async (obj) => {
  const { data } = await $authHost.post("api/rack/create/", obj);
  return data;
};
export const fetchRack = async (id, name, page = 1, limit = 5) => {
  const { data } = await $host.get("api/rack", {
    params: { id, name, page, limit },
  });
  return data;
};
export const fetchRackUpdate = async (obj) => {
  const { data } = await $authHost.post("api/rack/update/" + obj.id, obj);
  return data;
};
export const fetchOneRack = async (id) => {
  const { data } = await $host.get("api/rack/" + id);
  return data;
};
export const fetchRackDelete = async (id) => {
  const { data } = await $authHost.get("api/rack/delete/" + id);
  return data;
};

/**  ******************************************* */
/**  ******************************************* */
/**  ******************************************* */
