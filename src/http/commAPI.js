import { $host } from "../http/index";

/** Role ******************************************* */
export const fetchRoleCreate = async (obj) => {
  const { data } = await $host.post("api/role/create/", obj);
  return data;
};
export const fetchRole = async (id, name, page = 1, limit = 5) => {
  const { data } = await $host.get("api/role", {
    params: { id, name, page, limit },
  });
  return data;
};
export const fetchRoleUpdate = async (obj) => {
  const { data } = await $host.post("api/role/update/" + obj.id, obj);
  return data;
};
export const fetchOneRole = async (id) => {
  const { data } = await $host.get("api/role/" + id);
  return data;
};
export const fetchRoleDelete = async (id) => {
  const { data } = await $host.get("api/role/delete/" + id);
  return data;
};

/** Manufacturer ******************************************* */
export const fetchManufacturerCreate = async (obj) => {
  const { data } = await $host.post("api/manufacturer/create/", obj);
  return data;
};
export const fetchManufacturer = async (id, name, page = 1, limit = 5) => {
  const { data } = await $host.get("api/manufacturer", {
    params: { id, name, page, limit },
  });
  return data;
};
export const fetchManufacturerUpdate = async (obj) => {
  const { data } = await $host.post("api/manufacturer/update/" + obj.id, obj);
  return data;
};
export const fetchOneManufacturer = async (id) => {
  const { data } = await $host.get("api/manufacturer/" + id);
  return data;
};
export const fetchManufacturerDelete = async (id) => {
  const { data } = await $host.get("api/manufacturer/delete/" + id);
  return data;
};

/** DC ******************************************* */
export const fetchDCCreate = async (obj) => {
  const { data } = await $host.post("api/dc/create/", obj);
  return data;
};
export const fetchDC = async (
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
export const fetchDCUpdate = async (obj) => {
  //console.log("fetchDCUpdate                     obj = ", obj)
  const { data } = await $host.post("api/dc/update/" + obj.id, obj);
  //console.log("fetchDCUpdate                     data = ", data)

  return data;
};
export const fetchOneDC = async (id) => {
  const { data } = await $host.get("api/dc/" + id);
  return data;
};
export const fetchDCDelete = async (id) => {
  const { data } = await $host.get("api/dc/delete/" + id);
  return data;
};

/** Racktype ******************************************* */
export const fetchRacktypeCreate = async (obj) => {
  const { data } = await $host.post("api/racktype/create/", obj);
  return data;
};
export const fetchRacktype = async ({
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
export const fetchRacktypeUpdate = async (obj) => {
  const { data } = await $host.post("api/racktype/update/" + obj.id, obj);
  return data;
};
export const fetchRacktypeUploadGLB = async (obj, id) => {
  const { data } = await $host.post("api/racktype/uploadglbjpg/" + id, obj);
  return data;
};
export const fetchOneRacktype = async (id) => {
  const { data } = await $host.get("api/racktype/" + id);
  return data;
};
export const fetchRacktypeDelete = async (id) => {
  const { data } = await $host.get("api/racktype/delete/" + id);
  return data;
};

/** Rack ******************************************* */
export const fetchRackCreate = async (obj) => {
  const { data } = await $host.post("api/rack/create/", obj);
  return data;
};
export const fetchRack = async (id, name, page = 1, limit = 5) => {
  const { data } = await $host.get("api/rack", {
    params: { id, name, page, limit },
  });
  return data;
};
export const fetchRackUpdate = async (obj) => {
  const { data } = await $host.post("api/rack/update/" + obj.id, obj);
  return data;
};
export const fetchOneRack = async (id) => {
  const { data } = await $host.get("api/rack/" + id);
  return data;
};
export const fetchRackDelete = async (id) => {
  const { data } = await $host.get("api/rack/delete/" + id);
  return data;
};

/** Rack3d ******************************************* */
export const fetchRack3dCreate = async (obj) => {
  const { data } = await $host.post("api/rack3d/create/", obj);
  return data;
};
export const fetchRack3d = async (id, name, page = 1, limit = 5) => {
  const { data } = await $host.get("api/rack3d", {
    params: { id, name, page, limit },
  });
  return data;
};
export const fetchRack3dUpdate = async (obj) => {
  const { data } = await $host.post("api/rack3d/update/" + obj.id, obj);
  return data;
};
export const fetchOneRack3d = async (id) => {
  const { data } = await $host.get("api/rack3d/" + id);
  return data;
};
export const fetchRack3dDelete = async (id) => {
  const { data } = await $host.get("api/rack3d/delete/" + id);
  return data;
};

/**  ******************************************* */
/**  ******************************************* */
/**  ******************************************* */
