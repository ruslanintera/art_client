import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Pagination} from "react-bootstrap";

const PagesComm = observer(() => {
    const {device} = useContext(Context)
    const pageCount = Math.ceil(device.totalCountComm / device.limitComm)
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }
    //console.log("pages", pages, "device.totalCountComm", device.totalCountComm
    //    , "device.limitComm", device.limitComm, "pageCount =", pageCount);
    //alert(334)    
    return (
        <Pagination className="mt-3">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={device.pageComm === page}
                    onClick={() => device.setPageComm(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default PagesComm;
