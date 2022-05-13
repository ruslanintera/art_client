import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Pagination} from "react-bootstrap";

const PagesCommunity = observer(() => {
    const {device} = useContext(Context)
    const pageCount = Math.ceil(device.totalCountCommunity / device.limitCommunity)
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }
    //console.log("pages", pages, "device.totalCountCommunity", device.totalCountCommunity
    //    , "device.limitCommunity", device.limitCommunity, "pageCount =", pageCount);
        
    return (
        <Pagination className="mt-3">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={device.pageCommunity === page}
                    onClick={() => device.setPageCommunity(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default PagesCommunity;
