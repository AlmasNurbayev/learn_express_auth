import React from 'react';
import './input.css';
import { FormError } from '../../common/interfaces';

type propsInput = {
  value?: string;
  placeholder?: string;
  name: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  error?: FormError[] | undefined;
  mainfontsize?: number;
  secondfontsize?: number;
  required?: boolean;
  maxLength?: number;
  size?: number;
  style?: React.CSSProperties;
};

export default function Input({ ...props }: propsInput) {
  const id = Math.random().toString();
  let errorString;
  if (props.error) {
    errorString = props.error.find((item) => item.field === props.name)?.error;
  }
  let label;
  if (props.label) {
    label = props.label;
  } else if (props.placeholder) {
    label = props.placeholder;
  } else {
    label = props.name;
  }

  return (
    <div className="input_container">
      <div className="input_with_label">
        <label
          htmlFor={id}
          className="input_label"
          style={props.secondfontsize ? { fontSize: props.secondfontsize } : {}}
        >
          {label}
        </label>
        <input
          {...props}
          className={
            errorString ? 'input_input input_input_invalid' : 'input_input'
          }
          id={id}
          style={
            props.mainfontsize
              ? { ...props.style, fontSize: props.mainfontsize }
              : { ...props.style }
          }
        />
      </div>
      {errorString && (
        <span
          className="input_error"
          style={props.secondfontsize ? { fontSize: props.secondfontsize } : {}}
        >
          {errorString}
        </span>
      )}
    </div>
  );
}
