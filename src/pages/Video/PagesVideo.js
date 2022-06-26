import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Pagination } from "react-bootstrap";
//import "./pages.css";

const PagesVideo = observer(() => {
  const { device } = useContext(Context);
  const pageCount = Math.ceil(
    device.getVideoTotal / device.getVideoLimit
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
          active={device.getVideoPage === page}
          //active={true}
          onClick={() => device.setVideoPage(page)}
        >
          {page}
        </Pagination.Item>
      ))}
    </Pagination>
  );
});

export default PagesVideo;
