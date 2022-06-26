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
export const fetchSet = async ({id, name, adress, model3d, color, page = 1, limit = 5}) => {
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
export const fetchModelType3d = async ({ id, name, manufacturer, model3d, color, params1, params2, user, page = 1, limit = 5,
}) => {
  const { data } = await $host.get("api/racktype", {
    params: { id, name, manufacturer, model3d, color, params1, params2, user, page, limit, },
  })
  return data
}
export const fetchModelType3dUpdate = async (obj) => {
  const { data } = await $authHost.post("api/racktype/update/" + obj.id, obj)
  return data
}
export const fetchModelType3dUploadGLB = async (obj, id) => {
  const { data } = await $authHost.post("api/racktype/uploadglbjpg/" + id, obj); return data
}
export const fetchOneModelType3d = async (id) => {
  const { data } = await $host.get("api/racktype/" + id); return data
}
export const fetchModelType3dDelete = async (id) => {
  const { data } = await $authHost.get("api/racktype/delete/" + id); return data
}

/** PhotoVideo ******************************************* */
export const fetchPhotoVideoCreate = async (obj) => { const { data } = await $authHost.post("api/photovideo/create/", obj); return data }
export const fetchPhotoVideo = async ({ id, name, manufacturer, model3d, color, params1, params2, user, page = 1, limit = 5,}) => {
  const { data } = await $host.get("api/photovideo", {
    params: { id, name, manufacturer, model3d, color, params1, params2, user, page, limit, },
  })
  return data
}
export const fetchPhotoVideoUpdate = async (obj) => { const { data } = await $authHost.post("api/photovideo/update/" + obj.id, obj); return data }
export const fetchPhotoVideoUploadJPG = async (obj, id) => { const { data } = await $authHost.post("api/photovideo/upload_jpg/" + id, obj); return data }
export const fetchPhotoVideoUploadMP4 = async (obj, id) => { const { data } = await $authHost.post("api/photovideo/upload_mp4/" + id, obj); return data }
export const fetchOnePhotoVideo = async (id) => { const { data } = await $host.get("api/photovideo/" + id); return data; }
export const fetchPhotoVideoDelete = async (id) => { const { data } = await $authHost.get("api/photovideo/delete/" + id); return data; }
/** Video ******************************************* */
export const fetchVideoCreate = async (obj) => { const { data } = await $authHost.post("api/video/create/", obj); return data }
export const fetchVideo = async ({ id, name, manufacturer, model3d, color, params1, params2, user, page = 1, limit = 5,}) => {
  const { data } = await $host.get("api/video", {
    params: { id, name, manufacturer, model3d, color, params1, params2, user, page, limit, },
  })
  return data
}
export const fetchVideoUpdate = async (obj) => { const { data } = await $authHost.post("api/video/update/" + obj.id, obj); return data }
export const fetchVideoUploadJPG = async (obj, id) => { const { data } = await $authHost.post("api/video/upload_jpg/" + id, obj); return data }
export const fetchVideoUploadMP4 = async (obj, id) => { const { data } = await $authHost.post("api/video/upload_mp4/" + id, obj); return data }
export const fetchOneVideo = async (id) => { const { data } = await $host.get("api/video/" + id); return data; }
export const fetchVideoDelete = async (id) => { const { data } = await $authHost.get("api/video/delete/" + id); return data; }
/** Photo ******************************************* */
export const fetchPhotoCreate = async (obj) => { const { data } = await $authHost.post("api/photo/create/", obj); return data }
export const fetchPhoto = async ({ id, name, manufacturer, model3d, color, params1, params2, user, page = 1, limit = 5,}) => {
  const { data } = await $host.get("api/photo", {
    params: { id, name, manufacturer, model3d, color, params1, params2, user, page, limit, },
  })
  return data
}
export const fetchPhotoUpdate = async (obj) => { const { data } = await $authHost.post("api/photo/update/" + obj.id, obj); return data }
export const fetchPhotoUploadJPG = async (obj, id) => { const { data } = await $authHost.post("api/photo/upload_jpg/" + id, obj); return data }
export const fetchPhotoUploadMP4 = async (obj, id) => { const { data } = await $authHost.post("api/photo/upload_mp4/" + id, obj); return data }
export const fetchOnePhoto = async (id) => { const { data } = await $host.get("api/photo/" + id); return data; }
export const fetchPhotoDelete = async (id) => { const { data } = await $authHost.get("api/photo/delete/" + id); return data; }
/** Audio ******************************************* */
export const fetchAudioCreate = async (obj) => { const { data } = await $authHost.post("api/audio/create/", obj); return data }
export const fetchAudio = async ({ id, name, manufacturer, model3d, color, params1, params2, user, page = 1, limit = 5,}) => {
  const { data } = await $host.get("api/audio", {
    params: { id, name, manufacturer, model3d, color, params1, params2, user, page, limit, },
  })
  return data
}
export const fetchAudioUpdate = async (obj) => { const { data } = await $authHost.post("api/audio/update/" + obj.id, obj); return data }
export const fetchAudioUploadJPG = async (obj, id) => { const { data } = await $authHost.post("api/audio/upload_jpg/" + id, obj); return data }
export const fetchAudioUploadMP4 = async (obj, id) => { const { data } = await $authHost.post("api/audio/upload_mp4/" + id, obj); return data }
export const fetchOneAudio = async (id) => { const { data } = await $host.get("api/audio/" + id); return data; }
export const fetchAudioDelete = async (id) => { const { data } = await $authHost.get("api/audio/delete/" + id); return data; }

/**  ******************************************* */


/**  ******************************************* */
/**  ******************************************* */
/**  ******************************************* */
