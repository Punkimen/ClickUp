import { useEffect, useState } from "react";
import { InputApp } from "./ui/InputApp";

export const InputBlock = ({ id, label, value, children, ...props }) => {
  return (
    <div className="input-block">
      <label
        className="input-block__label calc__label"
        htmlFor={props.forid ? props.forid : id}
      >
        {label}
      </label>
      <div className="input-block__body">
        <InputApp id={id} value={value} {...props} />
        {children}
      </div>
    </div>
  );
};
