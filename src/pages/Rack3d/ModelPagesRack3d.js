import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Pagination} from "react-bootstrap";

const PagesModelRack3d = observer(() => {
    const {device} = useContext(Context)
    
    
    const pageCount = Math.ceil(device.getModelRack3dTotal / device.getModelRack3dLimit)
    //console.log("device.getModelRack3dTotal = ", device.getModelRack3dTotal, "device.getModelRack3dLimit = ", device.getModelRack3dLimit, "pageCount = ", pageCount)
    
    
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }
    
    return (
        <Pagination className="mt-3">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={device.getModelRack3dPage === page}
                    onClick={() => device.setModelRack3dPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default PagesModelRack3d;
