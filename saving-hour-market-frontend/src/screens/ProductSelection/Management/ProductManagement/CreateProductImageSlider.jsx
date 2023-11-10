import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const CreateProductImageSlider = ({ imageUrlList }) => {
  return (
    <div className="modal__container">
      <Slide infinite={false}>
        {imageUrlList.map((item, index) => (
          <>
            <div style={{ position: "relative" }}>
              <img
                width="600px"
                height="400px"
                src={item.imageUrl ? item.imageUrl : item}
                key={index}
              />
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "#E3E3E3",
                  bottom: 20,
                  right: 50,
                  fontSize: 24,
                  borderRadius: 5,
                  padding: 2,
                }}
              >
                {index + 1} / {imageUrlList.length}
              </div>
            </div>
          </>
        ))}
      </Slide>
    </div>
  );
};

export default CreateProductImageSlider;
