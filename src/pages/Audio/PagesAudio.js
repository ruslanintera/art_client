import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Pagination } from "react-bootstrap";
//import "./pages.css";

const PagesPhotoVideo = observer(() => {
  const { device } = useContext(Context);
  const pageCount = Math.ceil(
    device.getPhotoVideoTotal / device.getPhotoVideoLimit
  );
  const pages = [];

  for (let i = 0; i < pageCount; i++) {
    pages.push(i + 1);
  }

  return (
    <Pagination className="mt-0" style={{ border: "1px solid #f00" }}>
      {pages.map((page) => (
        <Pagination.Item
          key={page}
          active={device.getPhotoVideoPage === page}
          //active={true}
          onClick={() => device.setPhotoVideoPage(page)}
        >
          {page}
        </Pagination.Item>
      ))}
    </Pagination>
  );
});

export default PagesPhotoVideo;
