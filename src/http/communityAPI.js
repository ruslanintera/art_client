import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const createCommunity = async (community) => {
    //console.log("community", community)
    //const {data} = await $authHost.post('api/community', community)
    const {data} = await $host.post('api/community', community)
    return data
}

export const fetchCommunities_OL = async () => {
    const {data} = await $host.get('api/community')
    //console.log("!!! fetchCommunities data = ", data)
    return data
}
export const fetchCommunities = async (typeId, brandId, page = 1, limit= 5) => {  // typeId, brandId, 
    const {data} = await $host.get('api/community', {params: {
            typeId, brandId, page, limit // typeId, brandId, 
        }})
        //console.log("!!! fetchCommunities data = ", data, ", page = ", page)
        return data
}

export const fetchOneCommunity = async (id) => {
    const {data} = await $host.get('api/community/' + id)
    return data
}
